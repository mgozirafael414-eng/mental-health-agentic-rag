const prisma = require("../config/database");

const safeUser = (user) => ({ id: user.id, name: user.name, email: user.email, role: user.role, isActive: user.isActive, createdAt: user.createdAt, updatedAt: user.updatedAt });
const writeAudit = (userId, action, entity, entityId, details) => prisma.auditLog.create({ data: { userId, action, entity, entityId: entityId == null ? null : String(entityId), details } });

exports.dashboard = async (req, res) => {
  try {
    const [totalUsers, admins, totalAppointments, pendingAppointments, approvedAppointments, completedAppointments, unreadNotifications, recentActivity] = await Promise.all([
      prisma.user.count({ where: { role: "USER" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.appointment.count(),
      prisma.appointment.count({ where: { status: "Pending" } }),
      prisma.appointment.count({ where: { status: "Confirmed" } }),
      prisma.appointment.count({ where: { status: "Completed" } }),
      prisma.notification.count({ where: { isRead: false } }),
      prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, action: true, entity: true, createdAt: true } }),
    ]);
    res.json({ success: true, stats: { totalUsers, activeUsers: await prisma.user.count({ where: { role: "USER", isActive: true } }), adminUsers: admins, professionals: null, totalAppointments, pendingAppointments, approvedAppointments, completedAppointments, unreadNotifications, recentActivity } });
  } catch (error) { console.error("Admin dashboard error:", error); res.status(500).json({ success: false, message: "Failed to load admin dashboard.", error: error.message }); }
};

exports.listUsers = async (req, res) => {
  try { const { search, role, active } = req.query; const users = await prisma.user.findMany({ where: { ...(search ? { OR: [{ name: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }] } : {}), ...(role && ["USER", "PROFESSIONAL", "ADMIN", "OWNER"].includes(role) ? { role } : {}), ...(active === "true" || active === "false" ? { isActive: active === "true" } : {}) }, orderBy: { createdAt: "desc" }, select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true, updatedAt: true } }); res.json({ success: true, users }); }
  catch (error) { console.error("Admin users error:", error); res.status(500).json({ success: false, message: "Failed to load users.", error: error.message }); }
};

exports.getUser = async (req, res) => { try { const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) }, select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true, updatedAt: true } }); if (!user) return res.status(404).json({ success: false, message: "User not found." }); res.json({ success: true, user }); } catch (error) { console.error("Admin get user error:", error); res.status(500).json({ success: false, message: "Failed to load user." }); } };

exports.updateUser = async (req, res) => {
  try {
    const id = Number(req.params.id); const target = await prisma.user.findUnique({ where: { id } }); if (!target) return res.status(404).json({ success: false, message: "User not found." });
    if (target.role === "OWNER" && req.currentUser.role !== "OWNER") return res.status(403).json({ success: false, message: "Only the owner can modify an owner." });
    const data = {}; if (typeof req.body.isActive === "boolean") data.isActive = req.body.isActive;
    if (req.body.role) { if (!["USER", "PROFESSIONAL", "ADMIN", "OWNER"].includes(req.body.role)) return res.status(400).json({ success: false, message: "Invalid role." }); if (req.currentUser.role !== "OWNER") return res.status(403).json({ success: false, message: "Only the owner can change roles." }); if (target.role === "OWNER" && req.body.role !== "OWNER" && await prisma.user.count({ where: { role: "OWNER", isActive: true } }) <= 1) return res.status(409).json({ success: false, message: "At least one active owner must remain." }); data.role = req.body.role; }
    const updated = await prisma.user.update({ where: { id }, data, select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true, updatedAt: true } }); await writeAudit(req.currentUser.id, data.role ? "ROLE_CHANGED" : data.isActive === false ? "USER_DEACTIVATED" : "USER_UPDATED", "User", id, data); res.json({ success: true, user: updated });
  } catch (error) { console.error("Admin update user error:", error); res.status(500).json({ success: false, message: "Failed to update user.", error: error.message }); }
};

exports.listAppointments = async (req, res) => { try { const appointments = await prisma.appointment.findMany({ where: { ...(req.query.status ? { status: req.query.status } : {}), ...(req.query.userId ? { userId: Number(req.query.userId) } : {}) }, include: { user: { select: { id: true, name: true, email: true } } }, orderBy: { startsAt: "asc" } }); res.json({ success: true, appointments }); } catch (error) { console.error("Admin appointments error:", error); res.status(500).json({ success: false, message: "Failed to load appointments.", error: error.message }); } };
exports.updateAppointment = async (req, res) => { try { const appointment = await prisma.appointment.update({ where: { id: Number(req.params.id) }, data: { status: req.body.status }, include: { user: { select: { id: true, name: true, email: true } } } }); await writeAudit(req.currentUser.id, `APPOINTMENT_${String(req.body.status).toUpperCase()}`, "Appointment", appointment.id, { status: req.body.status }); res.json({ success: true, appointment }); } catch (error) { console.error("Admin update appointment error:", error); res.status(500).json({ success: false, message: "Failed to update appointment.", error: error.message }); } };
exports.listNotifications = async (req, res) => { try { const notifications = await prisma.notification.findMany({ include: { user: { select: { id: true, name: true, email: true } } }, orderBy: { createdAt: "desc" } }); res.json({ success: true, notifications }); } catch (error) { console.error("Admin notifications error:", error); res.status(500).json({ success: false, message: "Failed to load notification activity.", error: error.message }); } };
exports.createNotification = async (req, res) => { try { const { userId, userIds, title, message, type = "SYSTEM" } = req.body; if (!title?.trim() || !message?.trim()) return res.status(400).json({ success: false, message: "Title and message are required." }); const ids = userId ? [Number(userId)] : Array.isArray(userIds) ? userIds.map(Number).filter(Boolean) : (await prisma.user.findMany({ where: { isActive: true }, select: { id: true } })).map((user) => user.id); if (!ids.length) return res.status(400).json({ success: false, message: "At least one recipient is required." }); const result = await prisma.notification.createMany({ data: [...new Set(ids)].map((id) => ({ userId: id, title: title.trim(), message: message.trim(), type })) }); await writeAudit(req.currentUser.id, "NOTIFICATION_SENT", "Notification", null, { recipients: ids.length, type }); res.status(201).json({ success: true, count: result.count }); } catch (error) { console.error("Admin create notification error:", error); res.status(500).json({ success: false, message: "Failed to send notification.", error: error.message }); } };
exports.auditLogs = async (req, res) => { try { const logs = await prisma.auditLog.findMany({ include: { user: { select: { id: true, name: true, email: true } } }, orderBy: { createdAt: "desc" }, take: 200 }); res.json({ success: true, logs }); } catch (error) { console.error("Audit logs error:", error); res.status(500).json({ success: false, message: "Failed to load audit logs.", error: error.message }); } };
exports.admins = async (req, res) => { try { const admins = await prisma.user.findMany({ where: { role: { in: ["ADMIN", "OWNER"] } }, select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true } }); res.json({ success: true, admins }); } catch (error) { console.error("Admins error:", error); res.status(500).json({ success: false, message: "Failed to load administrators.", error: error.message }); } };
exports.professionals = async (req, res) => { res.json({ success: true, professionals: [], available: false, message: "Professional accounts are not available in the current database schema." }); };
exports.createAdmin = async (req, res) => { try { const user = await prisma.user.update({ where: { id: Number(req.body.userId) }, data: { role: "ADMIN" }, select: { id: true, name: true, email: true, role: true, isActive: true } }); await writeAudit(req.currentUser.id, "ADMIN_CREATED", "User", user.id, {}); res.status(201).json({ success: true, user }); } catch (error) { console.error("Create admin error:", error); res.status(500).json({ success: false, message: "Failed to create administrator.", error: error.message }); } };
exports.updateAdmin = async (req, res) => { req.body.role = req.body.role || "ADMIN"; return exports.updateUser(req, res); };
exports.deleteAdmin = async (req, res) => { req.body = { role: "USER" }; return exports.updateUser(req, res); };
