const prisma = require("../config/database");

// ========================================
// SHARED: LIST INCLUDE
// ========================================

const LIST_INCLUDE = {
  _count: {
    select: { messages: true },
  },
  messages: {
    orderBy: { createdAt: "desc" },
    take: 1,
    select: {
      content: true,
      role: true,
      createdAt: true,
    },
  },
};

// ========================================
// SHARED: FIND OWNED CONVERSATION
// ========================================

const findOwned = async (conversationId, userId) => {
  const id = Number(conversationId);
  if (isNaN(id)) return null;
  return prisma.conversation.findFirst({
    where: { id, userId },
  });
};

// ========================================
// CREATE CONVERSATION
// POST /api/conversations
// ========================================

exports.createConversation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title } = req.body;

    const conversation = await prisma.conversation.create({
      data: {
        userId,
        title: title || "New Conversation",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Conversation created successfully.",
      conversation,
    });
  } catch (error) {
    console.error("Create conversation error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create conversation.",
    });
  }
};

// ========================================
// GET USER CONVERSATIONS
// GET /api/conversations?archived=false&sort=newest
// ========================================

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.userId;
    const showArchived = req.query.archived === "true";
    const sortOldest = req.query.sort === "oldest";

    const conversations = await prisma.conversation.findMany({
      where: { userId, isArchived: showArchived },
      orderBy: showArchived
        ? [{ updatedAt: sortOldest ? "asc" : "desc" }]
        : [
            { isPinned: "desc" },
            { updatedAt: sortOldest ? "asc" : "desc" },
          ],
      include: LIST_INCLUDE,
    });

    return res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("Get conversations error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve conversations.",
    });
  }
};

// ========================================
// GET SINGLE CONVERSATION (full messages)
// GET /api/conversations/:id
// ========================================

exports.getConversation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const conversationId = Number(req.params.id);

    if (isNaN(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID.",
      });
    }

    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, userId },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    return res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Get conversation error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve conversation.",
    });
  }
};

// ========================================
// RENAME CONVERSATION
// PATCH /api/conversations/:id/rename
// body: { title }
// ========================================

exports.renameConversation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required.",
      });
    }

    const conversation = await findOwned(req.params.id, userId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    const updated = await prisma.conversation.update({
      where: { id: conversation.id },
      data: { title: title.trim().slice(0, 120) },
    });

    return res.status(200).json({
      success: true,
      message: "Conversation renamed.",
      conversation: updated,
    });
  } catch (error) {
    console.error("Rename conversation error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to rename conversation.",
    });
  }
};

// ========================================
// TOGGLE PIN
// PATCH /api/conversations/:id/pin
// ========================================

exports.togglePin = async (req, res) => {
  try {
    const userId = req.user.userId;
    const conversation = await findOwned(req.params.id, userId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    const updated = await prisma.conversation.update({
      where: { id: conversation.id },
      data: { isPinned: !conversation.isPinned },
    });

    return res.status(200).json({
      success: true,
      isPinned: updated.isPinned,
      message: updated.isPinned
        ? "Conversation pinned."
        : "Conversation unpinned.",
      conversation: updated,
    });
  } catch (error) {
    console.error("Toggle pin error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update pin.",
    });
  }
};

// ========================================
// TOGGLE ARCHIVE
// PATCH /api/conversations/:id/archive
// ========================================

exports.toggleArchive = async (req, res) => {
  try {
    const userId = req.user.userId;
    const conversation = await findOwned(req.params.id, userId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    const updated = await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        isArchived: !conversation.isArchived,
        // always unpin when archiving
        isPinned: conversation.isArchived
          ? conversation.isPinned
          : false,
      },
    });

    return res.status(200).json({
      success: true,
      isArchived: updated.isArchived,
      message: updated.isArchived
        ? "Conversation archived."
        : "Conversation unarchived.",
      conversation: updated,
    });
  } catch (error) {
    console.error("Toggle archive error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update archive status.",
    });
  }
};

// ========================================
// CLEAR CONVERSATION MESSAGES
// DELETE /api/conversations/:id/messages
// ========================================

exports.clearMessages = async (req, res) => {
  try {
    const userId = req.user.userId;
    const conversation = await findOwned(req.params.id, userId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    await prisma.message.deleteMany({
      where: { conversationId: conversation.id },
    });

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    return res.status(200).json({
      success: true,
      message: "Conversation cleared.",
    });
  } catch (error) {
    console.error("Clear messages error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to clear conversation.",
    });
  }
};

// ========================================
// DELETE CONVERSATION
// DELETE /api/conversations/:id
// ========================================

exports.deleteConversation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const conversation = await findOwned(req.params.id, userId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    await prisma.conversation.delete({
      where: { id: conversation.id },
    });

    return res.status(200).json({
      success: true,
      message: "Conversation deleted successfully.",
    });
  } catch (error) {
    console.error("Delete conversation error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete conversation.",
    });
  }
};
