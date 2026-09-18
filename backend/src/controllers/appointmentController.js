const prisma = require("../config/database");

const createAppointmentNotification = async (userId, title, message) => {
  await prisma.notification.create({ data: { userId, title, message, type: "APPOINTMENT" } });
};

const notifyAssignedProfessional = async (appointment, title, message) => {
  const professional = await prisma.user.findFirst({
    where: {
      role: "PROFESSIONAL",
      isActive: true,
      OR: [
        { name: { equals: appointment.providerName, mode: "insensitive" } },
        { email: { equals: appointment.providerName, mode: "insensitive" } },
      ],
    },
    select: { id: true },
  });
  if (professional) await createAppointmentNotification(professional.id, title, message);
};

const allowedStatuses = ["Pending", "Confirmed", "Completed", "Cancelled"];
const allowedTypes = ["Video consultation", "Phone consultation", "In-person consultation"];

exports.getOne = async (req, res) => {
  try {
    const appointment = await prisma.appointment.findFirst({ where: { id: Number(req.params.id), userId: req.user.userId } });
    if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found." });
    return res.json({ success: true, appointment });
  } catch (error) { console.error("Get appointment error:", error); return res.status(500).json({ success: false, message: "Failed to load appointment.", error: error.message }); }
};

exports.list = async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({ where: { userId: req.user.userId }, orderBy: { startsAt: "asc" } });
    res.json({ success: true, appointments });
  } catch (error) { console.error("List appointments error:", error); res.status(500).json({ success: false, message: "Failed to load appointments." }); }
};

exports.create = async (req, res) => {
  try {
    const { providerName, providerRole, startsAt, type, notes, communicationMethod } = req.body;
    const date = new Date(startsAt);
    if (!providerName?.trim() || !providerRole?.trim() || !startsAt || Number.isNaN(date.getTime()) || date <= new Date() || !allowedTypes.includes(type)) return res.status(400).json({ success: false, message: "Provider, future date/time, and a valid appointment type are required." });
    const duplicate = await prisma.appointment.findFirst({ where: { userId: req.user.userId, startsAt: date, status: { not: "Cancelled" } } });
    if (duplicate) return res.status(409).json({ success: false, message: "You already have an appointment at this time." });
    const appointment = await prisma.appointment.create({ data: { userId: req.user.userId, providerName: providerName.trim(), providerRole: providerRole.trim(), startsAt: date, type, notes: notes?.trim() || null, communicationMethod: communicationMethod?.trim() || null } });
    await createAppointmentNotification(req.user.userId, "Appointment requested", "Your appointment request has been submitted successfully.");
    await notifyAssignedProfessional(appointment, "New appointment request", `A user requested an appointment for ${date.toLocaleString()}.`);
    res.status(201).json({ success: true, appointment });
  } catch (error) { console.error("Create appointment error:", error); res.status(500).json({ success: false, message: "Failed to book appointment." }); }
};

exports.remove = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const current = await prisma.appointment.findFirst({ where: { id, userId: req.user.userId } });
    if (!current) return res.status(404).json({ success: false, message: "Appointment not found." });
    if (["Completed", "Confirmed"].includes(current.status)) return res.status(400).json({ success: false, message: "This appointment cannot be deleted." });
    await prisma.appointment.delete({ where: { id } });
    return res.json({ success: true });
  } catch (error) { console.error("Delete appointment error:", error); return res.status(500).json({ success: false, message: "Failed to delete appointment.", error: error.message }); }
};

exports.update = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const current = await prisma.appointment.findFirst({ where: { id, userId: req.user.userId } });
    if (!current) return res.status(404).json({ success: false, message: "Appointment not found." });
    if (["Completed", "Cancelled"].includes(current.status)) return res.status(400).json({ success: false, message: "This appointment can no longer be changed." });
    const data = {};
    if (req.body.status) { if (!allowedStatuses.includes(req.body.status)) return res.status(400).json({ success: false, message: "Invalid appointment status." }); data.status = req.body.status; }
    if (req.body.startsAt) { const date = new Date(req.body.startsAt); if (Number.isNaN(date.getTime()) || date <= new Date()) return res.status(400).json({ success: false, message: "Appointment date must be in the future." }); data.startsAt = date; }
    const appointment = await prisma.appointment.update({ where: { id }, data });
    if (data.status === "Confirmed") { await createAppointmentNotification(req.user.userId, "Appointment approved", "Your appointment has been approved. Check your appointments for the scheduled details."); await notifyAssignedProfessional(appointment, "Appointment confirmed", "An appointment has been confirmed."); }
    if (data.status === "Cancelled") { await createAppointmentNotification(req.user.userId, "Appointment cancelled", "Your appointment has been cancelled."); await notifyAssignedProfessional(appointment, "Appointment cancelled", "An appointment has been cancelled."); }
    if (data.status === "Rejected") { await createAppointmentNotification(req.user.userId, "Appointment rejected", "Your appointment request was rejected. Please check your appointments for more information."); await notifyAssignedProfessional(appointment, "Appointment rejected", "An appointment request was rejected."); }
    res.json({ success: true, appointment });
  } catch (error) { console.error("Update appointment error:", error); res.status(500).json({ success: false, message: "Failed to update appointment." }); }
};