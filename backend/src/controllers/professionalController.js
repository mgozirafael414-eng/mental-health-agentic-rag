const prisma = require("../config/database");

const professionalFilter = (user) => ({
  OR: [
    { providerName: { equals: user.name, mode: "insensitive" } },
    { providerName: { equals: user.email, mode: "insensitive" } },
  ],
});

exports.overview = async (req, res) => {
  try {
    const filter = professionalFilter(req.currentUser);
    const now = new Date();
    const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay); endOfDay.setDate(endOfDay.getDate() + 1);
    const [today, upcoming, pending, completed, patients] = await Promise.all([
      prisma.appointment.count({ where: { ...filter, startsAt: { gte: startOfDay, lt: endOfDay } } }),
      prisma.appointment.count({ where: { ...filter, startsAt: { gte: now } } }),
      prisma.appointment.count({ where: { ...filter, status: "Pending" } }),
      prisma.appointment.count({ where: { ...filter, status: "Completed" } }),
      prisma.appointment.findMany({ where: filter, distinct: ["userId"], select: { userId: true } }),
    ]);
    res.json({ success: true, stats: { todayAppointments: today, upcomingAppointments: upcoming, pendingRequests: pending, completedSessions: completed, assignedPatients: patients.length } });
  } catch (error) { console.error("Professional overview error:", error); res.status(500).json({ success: false, message: "Failed to load professional overview." }); }
};

exports.appointments = async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({ where: professionalFilter(req.currentUser), include: { user: { select: { id: true, name: true, email: true } } }, orderBy: { startsAt: "asc" } });
    res.json({ success: true, appointments });
  } catch (error) { console.error("Professional appointments error:", error); res.status(500).json({ success: false, message: "Failed to load professional appointments." }); }
};

exports.updateAppointment = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const current = await prisma.appointment.findFirst({ where: { id, ...professionalFilter(req.currentUser) } });
    if (!current) return res.status(404).json({ success: false, message: "Appointment not found for this professional." });
    const allowed = ["Pending", "Confirmed", "Rejected", "Cancelled", "Completed"];
    if (!allowed.includes(req.body.status)) return res.status(400).json({ success: false, message: "Invalid appointment status." });
    const appointment = await prisma.appointment.update({ where: { id }, data: { status: req.body.status }, include: { user: { select: { id: true, name: true, email: true } } } });
    res.json({ success: true, appointment });
  } catch (error) { console.error("Professional appointment update error:", error); res.status(500).json({ success: false, message: "Failed to update appointment." }); }
};

exports.patients = async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({ where: professionalFilter(req.currentUser), distinct: ["userId"], include: { user: { select: { id: true, name: true, email: true, isActive: true } } } });
    res.json({ success: true, patients: appointments.map(({ user }) => user).filter(Boolean) });
  } catch (error) { console.error("Professional patients error:", error); res.status(500).json({ success: false, message: "Failed to load patients." }); }
};

exports.notifications = async (req, res) => {
  res.json({ success: true, notifications: [] });
};
