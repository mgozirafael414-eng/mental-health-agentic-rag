const prisma = require("../config/database");

exports.list = async (req, res) => {
  try { const notifications = await prisma.notification.findMany({ where: { userId: req.user.userId }, orderBy: { createdAt: "desc" } }); res.json({ success: true, notifications }); }
  catch (error) { console.error("List notifications error:", error); res.status(500).json({ success: false, message: "Failed to load notifications.", error: error.message }); }
};
exports.unreadCount = async (req, res) => {
  try {
    const count = await prisma.notification.count({ where: { userId: req.user.userId, isRead: false } });
    return res.json({ success: true, count });
  } catch (error) { console.error("Unread notification count error:", error); return res.status(500).json({ success: false, message: "Failed to load unread notification count.", error: error.message }); }
};

exports.markRead = async (req, res) => {
  try { const notification = await prisma.notification.updateMany({ where: { id: Number(req.params.id), userId: req.user.userId }, data: { isRead: true } }); res.json({ success: true, notification }); }
  catch (error) { res.status(500).json({ success: false, message: "Failed to mark notification as read." }); }
};
exports.markAllRead = async (req, res) => {
  try { await prisma.notification.updateMany({ where: { userId: req.user.userId, isRead: false }, data: { isRead: true } }); res.json({ success: true }); }
  catch (error) { res.status(500).json({ success: false, message: "Failed to mark notifications as read." }); }
};
exports.remove = async (req, res) => {
  try { await prisma.notification.deleteMany({ where: { id: Number(req.params.id), userId: req.user.userId } }); res.json({ success: true }); }
  catch (error) { res.status(500).json({ success: false, message: "Failed to delete notification." }); }
};