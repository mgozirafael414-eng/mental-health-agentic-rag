const prisma = require("../config/database");

const professionalAppointmentWhere = (professional) => ({
  OR: [
    { providerName: { equals: professional.name, mode: "insensitive" } },
    { providerName: { equals: professional.email, mode: "insensitive" } },
  ],
});

const canAccessRelationship = async (userId, professionalId) => {
  const professional = await prisma.user.findFirst({ where: { id: professionalId, role: "PROFESSIONAL", isActive: true } });
  if (!professional) return null;
  const appointment = await prisma.appointment.findFirst({ where: { userId, ...professionalAppointmentWhere(professional) }, select: { id: true } });
  return appointment ? professional : null;
};

const conversationInclude = { messages: { orderBy: { createdAt: "asc" }, include: { sender: { select: { id: true, name: true, role: true } } } }, user: { select: { id: true, name: true, email: true } }, professional: { select: { id: true, name: true, email: true } } };

exports.list = async (req, res) => {
  try {
    const where = req.currentUser.role === "PROFESSIONAL" ? { professionalId: req.currentUser.id } : { userId: req.currentUser.id };
    const conversations = await prisma.professionalConversation.findMany({ where, orderBy: { updatedAt: "desc" }, include: conversationInclude });
    return res.json({ success: true, conversations });
  } catch (error) {
    console.error("List professional conversations error:", error);
    return res.status(500).json({ success: false, message: "Failed to load professional conversations." });
  }
};

exports.create = async (req, res) => {
  try {
    if (req.currentUser.role !== "USER") return res.status(403).json({ success: false, message: "Only users can start a professional conversation." });
    const professional = await canAccessRelationship(req.currentUser.id, Number(req.body.professionalId));
    if (!professional) return res.status(403).json({ success: false, message: "You can only contact a professional connected to your appointments." });
    const conversation = await prisma.professionalConversation.upsert({ where: { userId_professionalId: { userId: req.currentUser.id, professionalId: professional.id } }, update: {}, create: { userId: req.currentUser.id, professionalId: professional.id }, include: conversationInclude });
    return res.status(201).json({ success: true, conversation });
  } catch (error) {
    console.error("Create professional conversation error:", error);
    return res.status(500).json({ success: false, message: "Failed to create professional conversation." });
  }
};

exports.send = async (req, res) => {
  try {
    const conversationId = Number(req.params.id);
    const content = String(req.body.content || "").trim();
    if (!content) return res.status(400).json({ success: false, message: "Message content is required." });
    const where = req.currentUser.role === "PROFESSIONAL" ? { id: conversationId, professionalId: req.currentUser.id } : { id: conversationId, userId: req.currentUser.id };
    const conversation = await prisma.professionalConversation.findFirst({ where });
    if (!conversation) return res.status(404).json({ success: false, message: "Professional conversation not found." });
    const message = await prisma.professionalMessage.create({ data: { conversationId, senderId: req.currentUser.id, content }, include: { sender: { select: { id: true, name: true, role: true } } } });
    await prisma.professionalConversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } });
    const recipientId = req.currentUser.role === "PROFESSIONAL" ? conversation.userId : conversation.professionalId;
    await prisma.notification.create({ data: { userId: recipientId, title: "New professional message", message: content.slice(0, 160), type: "PROFESSIONAL_MESSAGE" } });
    return res.status(201).json({ success: true, message });
  } catch (error) {
    console.error("Send professional message error:", error);
    return res.status(500).json({ success: false, message: "Failed to send professional message." });
  }
};

exports.listNotes = async (req, res) => {
  try {
    if (req.currentUser.role !== "PROFESSIONAL") return res.status(403).json({ success: false, message: "Professional access required." });
    const appointments = await prisma.appointment.findMany({
      where: professionalAppointmentWhere(req.currentUser),
      orderBy: { startsAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        sessionNotes: { where: { professionalId: req.currentUser.id }, take: 1 },
      },
    });
    const notes = appointments.map((appointment) => ({
      ...(appointment.sessionNotes[0] || { id: null, content: "", appointmentId: appointment.id }),
      appointment: { ...appointment, sessionNotes: undefined },
    }));
    return res.json({ success: true, notes });
  } catch (error) {
    console.error("List session notes error:", error);
    return res.status(500).json({ success: false, message: "Failed to load session notes." });
  }
};

exports.saveNote = async (req, res) => {
  try {
    if (req.currentUser.role !== "PROFESSIONAL") return res.status(403).json({ success: false, message: "Professional access required." });
    const appointmentId = Number(req.params.appointmentId);
    const appointment = await prisma.appointment.findFirst({ where: { id: appointmentId, ...professionalAppointmentWhere(req.currentUser) } });
    if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found for this professional." });
    const content = String(req.body.content || "").trim();
    if (!content) return res.status(400).json({ success: false, message: "Session note content is required." });
    const note = await prisma.sessionNote.upsert({ where: { appointmentId_professionalId: { appointmentId, professionalId: req.currentUser.id } }, update: { content }, create: { appointmentId, professionalId: req.currentUser.id, content }, include: { appointment: { include: { user: { select: { id: true, name: true, email: true } } } } } });
    return res.status(200).json({ success: true, note });
  } catch (error) {
    console.error("Save session note error:", error);
    return res.status(500).json({ success: false, message: "Failed to save session note." });
  }
};

module.exports = { ...exports };
