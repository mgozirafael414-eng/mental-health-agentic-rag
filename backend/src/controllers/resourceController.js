const prisma = require("../config/database");

// ========================================
// RESOURCE CONTROLLER
// ========================================

// ========================================
// GET RESOURCES (list, search, filter, paginate)
// GET /api/resources?search=&category=&page=1&limit=9
// ========================================

exports.getResources = async (req, res) => {
  try {
    const userId = req.user.userId;

    const search = (req.query.search || "").trim();
    const category = (req.query.category || "").trim();
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 9));
    const skip = (page - 1) * limit;

    // ========================================
    // BUILD FILTER
    // ========================================

    const where = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { shortDescription: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ];
    }

    // ========================================
    // COUNT + FETCH IN PARALLEL
    // ========================================

    const [total, resources] = await Promise.all([
      prisma.resource.count({ where }),
      prisma.resource.findMany({
        where,
        skip,
        take: limit,
        orderBy: { dateUpdated: "desc" },
        select: {
          id: true,
          title: true,
          category: true,
          shortDescription: true,
          readTimeMinutes: true,
          dateUpdated: true,
          source: true,
          keyPoints: true,
        },
      }),
    ]);

    // ========================================
    // GET BOOKMARKED IDS FOR THIS USER
    // ========================================

    const bookmarks = await prisma.resourceBookmark.findMany({
      where: { userId },
      select: { resourceId: true },
    });

    const bookmarkedIds = new Set(bookmarks.map((b) => b.resourceId));

    // ========================================
    // ANNOTATE WITH BOOKMARK FLAG
    // ========================================

    const annotated = resources.map((r) => ({
      ...r,
      isBookmarked: bookmarkedIds.has(r.id),
    }));

    return res.status(200).json({
      success: true,
      resources: annotated,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });

  } catch (error) {
    console.error("Get resources error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve resources.",
    });
  }
};

// ========================================
// GET SINGLE RESOURCE (full content)
// GET /api/resources/:id
// ========================================

exports.getResource = async (req, res) => {
  try {
    const userId = req.user.userId;
    const resourceId = parseInt(req.params.id);

    if (isNaN(resourceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID.",
      });
    }

    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found.",
      });
    }

    // ========================================
    // CHECK BOOKMARK STATUS
    // ========================================

    const bookmark = await prisma.resourceBookmark.findUnique({
      where: {
        userId_resourceId: {
          userId,
          resourceId,
        },
      },
    });

    // ========================================
    // FETCH RELATED RESOURCES (stubs)
    // ========================================

    let relatedResources = [];

    if (
      Array.isArray(resource.relatedResourceIds) &&
      resource.relatedResourceIds.length > 0
    ) {
      relatedResources = await prisma.resource.findMany({
        where: {
          id: { in: resource.relatedResourceIds },
        },
        select: {
          id: true,
          title: true,
          category: true,
          shortDescription: true,
          readTimeMinutes: true,
        },
      });
    }

    return res.status(200).json({
      success: true,
      resource: {
        ...resource,
        isBookmarked: Boolean(bookmark),
        relatedResources,
      },
    });

  } catch (error) {
    console.error("Get resource error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve resource.",
    });
  }
};

// ========================================
// GET CATEGORIES
// GET /api/resources/categories
// ========================================

exports.getCategories = async (req, res) => {
  try {
    const categoryCounts = await prisma.resource.groupBy({
      by: ["category"],
      _count: { id: true },
      orderBy: { category: "asc" },
    });

    const categories = categoryCounts.map((c) => ({
      name: c.category,
      count: c._count.id,
    }));

    return res.status(200).json({
      success: true,
      categories,
    });

  } catch (error) {
    console.error("Get categories error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve categories.",
    });
  }
};

// ========================================
// TOGGLE BOOKMARK
// POST /api/resources/:id/bookmark
// ========================================

exports.toggleBookmark = async (req, res) => {
  try {
    const userId = req.user.userId;
    const resourceId = parseInt(req.params.id);

    if (isNaN(resourceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID.",
      });
    }

    // ========================================
    // CHECK RESOURCE EXISTS
    // ========================================

    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      select: { id: true },
    });

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found.",
      });
    }

    // ========================================
    // TOGGLE: ADD OR REMOVE
    // ========================================

    const existing = await prisma.resourceBookmark.findUnique({
      where: {
        userId_resourceId: {
          userId,
          resourceId,
        },
      },
    });

    if (existing) {
      await prisma.resourceBookmark.delete({
        where: {
          userId_resourceId: {
            userId,
            resourceId,
          },
        },
      });

      return res.status(200).json({
        success: true,
        isBookmarked: false,
        message: "Bookmark removed.",
      });
    }

    await prisma.resourceBookmark.create({
      data: { userId, resourceId },
    });

    return res.status(201).json({
      success: true,
      isBookmarked: true,
      message: "Resource bookmarked.",
    });

  } catch (error) {
    console.error("Toggle bookmark error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update bookmark.",
    });
  }
};

// ========================================
// GET BOOKMARKED RESOURCES
// GET /api/resources/bookmarks
// ========================================

exports.getBookmarks = async (req, res) => {
  try {
    const userId = req.user.userId;

    const bookmarks = await prisma.resourceBookmark.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        resource: {
          select: {
            id: true,
            title: true,
            category: true,
            shortDescription: true,
            readTimeMinutes: true,
            dateUpdated: true,
            source: true,
            keyPoints: true,
          },
        },
      },
    });

    const resources = bookmarks.map((b) => ({
      ...b.resource,
      isBookmarked: true,
      bookmarkedAt: b.createdAt,
    }));

    return res.status(200).json({
      success: true,
      resources,
    });

  } catch (error) {
    console.error("Get bookmarks error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve bookmarks.",
    });
  }
};

// ========================================
// GET RECENTLY VIEWED  (client-side only –
// this endpoint just validates + returns
// resource stubs for a list of IDs)
// POST /api/resources/recently-viewed
// body: { ids: [1, 2, 3] }
// ========================================

exports.getRecentlyViewed = async (req, res) => {
  try {
    const userId = req.user.userId;
    const ids = req.body.ids;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(200).json({
        success: true,
        resources: [],
      });
    }

    const validIds = ids
      .map((id) => parseInt(id))
      .filter((id) => !isNaN(id))
      .slice(0, 10);

    const resources = await prisma.resource.findMany({
      where: { id: { in: validIds } },
      select: {
        id: true,
        title: true,
        category: true,
        shortDescription: true,
        readTimeMinutes: true,
        dateUpdated: true,
      },
    });

    // ========================================
    // GET BOOKMARK STATUS
    // ========================================

    const bookmarks = await prisma.resourceBookmark.findMany({
      where: { userId, resourceId: { in: validIds } },
      select: { resourceId: true },
    });

    const bookmarkedIds = new Set(bookmarks.map((b) => b.resourceId));

    // Preserve original order
    const idOrder = validIds.reduce((acc, id, i) => {
      acc[id] = i;
      return acc;
    }, {});

    const ordered = resources
      .map((r) => ({ ...r, isBookmarked: bookmarkedIds.has(r.id) }))
      .sort((a, b) => idOrder[a.id] - idOrder[b.id]);

    return res.status(200).json({
      success: true,
      resources: ordered,
    });

  } catch (error) {
    console.error("Get recently viewed error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve recently viewed resources.",
    });
  }
};
