const prisma = require("../config/database");

const requireAuth = async (req, res, next) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        role: true,
        isActive: true,
        name: true,
        email: true,
      },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is inactive or no longer exists.",
      });
    }

    req.currentUser = user;
    // Authorization uses the current database role, not a role supplied by the client or stale JWT.
    req.user = { ...req.user, userId: user.id, role: user.role };
    return next();
  } catch (error) {
    console.error("Authorization user lookup error:", error);
    return res.status(500).json({
      success: false,
      message: "Authorization failed.",
    });
  }
};

const adminCheck = (req, res, next) => {
  if (!req.currentUser || !["ADMIN", "OWNER"].includes(req.currentUser.role)) {
    return res.status(403).json({
      success: false,
      message: "Administrator access required.",
    });
  }

  return next();
};

const ownerCheck = (req, res, next) => {
  if (!req.currentUser || req.currentUser.role !== "OWNER") {
    return res.status(403).json({
      success: false,
      message: "Owner access required.",
    });
  }

  return next();
};

module.exports = {
  requireAuth,
  adminCheck,
  ownerCheck,
};
