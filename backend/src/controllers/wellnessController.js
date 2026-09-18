const prisma = require("../config/database");

const validateScale = (value, label) => {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1 || number > 5) {
    throw new Error(`${label} must be an integer from 1 to 5.`);
  }
  return number;
};

const selectCheckIn = {
  id: true,
  mood: true,
  stressLevel: true,
  energyLevel: true,
  sleepHours: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
};

exports.list = async (req, res) => {
  try {
    const checkIns = await prisma.wellnessCheckIn.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: selectCheckIn,
    });
    return res.json({ success: true, checkIns });
  } catch (error) {
    console.error("List wellness check-ins error:", error);
    return res.status(500).json({ success: false, message: "Failed to load wellness check-ins." });
  }
};

exports.create = async (req, res) => {
  try {
    const { mood, stressLevel, energyLevel, sleepHours, notes } = req.body;
    const data = {
      userId: req.user.userId,
      mood: validateScale(mood, "Mood"),
      stressLevel: validateScale(stressLevel, "Stress level"),
      energyLevel: validateScale(energyLevel, "Energy level"),
      sleepHours: sleepHours === null || sleepHours === "" || sleepHours === undefined ? null : Number(sleepHours),
      notes: notes?.trim() || null,
    };
    if (data.sleepHours !== null && (!Number.isFinite(data.sleepHours) || data.sleepHours < 0 || data.sleepHours > 24)) {
      return res.status(400).json({ success: false, message: "Sleep hours must be between 0 and 24." });
    }
    const checkIn = await prisma.wellnessCheckIn.create({ data, select: selectCheckIn });
    return res.status(201).json({ success: true, checkIn });
  } catch (error) {
    const status = /must be an integer|Sleep hours/.test(error.message) ? 400 : 500;
    if (status === 500) console.error("Create wellness check-in error:", error);
    return res.status(status).json({ success: false, message: status === 400 ? error.message : "Failed to save wellness check-in." });
  }
};

exports.update = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const current = await prisma.wellnessCheckIn.findFirst({ where: { id, userId: req.user.userId } });
    if (!current) return res.status(404).json({ success: false, message: "Wellness check-in not found." });
    const data = {};
    if (req.body.mood !== undefined) data.mood = validateScale(req.body.mood, "Mood");
    if (req.body.stressLevel !== undefined) data.stressLevel = validateScale(req.body.stressLevel, "Stress level");
    if (req.body.energyLevel !== undefined) data.energyLevel = validateScale(req.body.energyLevel, "Energy level");
    if (req.body.sleepHours !== undefined) data.sleepHours = req.body.sleepHours === null || req.body.sleepHours === "" ? null : Number(req.body.sleepHours);
    if (req.body.notes !== undefined) data.notes = req.body.notes?.trim() || null;
    const checkIn = await prisma.wellnessCheckIn.update({ where: { id }, data, select: selectCheckIn });
    return res.json({ success: true, checkIn });
  } catch (error) {
    console.error("Update wellness check-in error:", error);
    return res.status(400).json({ success: false, message: error.message || "Failed to update wellness check-in." });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await prisma.wellnessCheckIn.deleteMany({ where: { id: Number(req.params.id), userId: req.user.userId } });
    if (!result.count) return res.status(404).json({ success: false, message: "Wellness check-in not found." });
    return res.json({ success: true });
  } catch (error) {
    console.error("Delete wellness check-in error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete wellness check-in." });
  }
};
