const bcrypt = require("bcryptjs");
const prisma = require("../config/database");

const safeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
  notificationPreferences: user.notificationPreferences || {
    appointmentReminders: true,
    wellnessReminders: true,
    generalNotifications: true,
  },
});

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    return res.json({ success: true, user: safeUser(user) });
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({ success: false, message: "Failed to load profile." });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name?.trim() || !email?.trim()) return res.status(400).json({ success: false, message: "Name and email are required." });
    const user = await prisma.user.update({ where: { id: req.user.userId }, data: { name: name.trim(), email: email.trim().toLowerCase() } });
    return res.json({ success: true, user: safeUser(user), message: "Settings updated successfully." });
  } catch (error) {
    const message = error.code === "P2002" ? "That email is already in use." : "Failed to update profile.";
    return res.status(error.code === "P2002" ? 409 : 500).json({ success: false, message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6) return res.status(400).json({ success: false, message: "Current password and a new password of at least 6 characters are required." });
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) return res.status(401).json({ success: false, message: "Current password is incorrect." });
    await prisma.user.update({ where: { id: user.id }, data: { password: await bcrypt.hash(newPassword, 12) } });
    return res.json({ success: true, message: "Password changed successfully." });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ success: false, message: "Failed to change password." });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const preferences = {
      appointmentReminders: Boolean(req.body.appointmentReminders),
      wellnessReminders: Boolean(req.body.wellnessReminders),
      generalNotifications: Boolean(req.body.generalNotifications),
    };
    const user = await prisma.user.update({ where: { id: req.user.userId }, data: { notificationPreferences: preferences } });
    return res.json({ success: true, user: safeUser(user), message: "Notification preferences updated." });
  } catch (error) {
    console.error("Update preferences error:", error);
    return res.status(500).json({ success: false, message: "Failed to update preferences." });
  }
};