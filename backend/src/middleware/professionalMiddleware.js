const prisma = require("../config/database");

const requireProfessional = async (req, res, next) => {
  try {
    if (!req.user?.userId) return res.status(401).json({ success: false, message: "Authentication required." });
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });
    if (!user || !user.isActive) return res.status(401).json({ success: false, message: "Account is inactive or no longer exists." });
    if (user.role !== "PROFESSIONAL") return res.status(403).json({ success: false, message: "Professional access required." });
    req.currentUser = user;
    return next();
  } catch (error) {
    console.error("Professional authorization error:", error);
    return res.status(500).json({ success: false, message: "Professional authorization failed." });
  }
};

module.exports = requireProfessional;
