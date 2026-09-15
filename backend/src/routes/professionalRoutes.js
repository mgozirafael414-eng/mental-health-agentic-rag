const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const requireProfessional = require("../middleware/professionalMiddleware");
const controller = require("../controllers/professionalController");

router.use(auth, requireProfessional);
router.get("/overview", controller.overview);
router.get("/appointments", controller.appointments);
router.patch("/appointments/:id", controller.updateAppointment);
router.get("/patients", controller.patients);
router.get("/consultations", (req, res) => res.json({ success: true, consultations: [], available: false, message: "Consultations are not available in the current database schema." }));
router.get("/availability", (req, res) => res.json({ success: true, availability: [], available: false, message: "Availability is not available in the current database schema." }));
router.get("/notifications", controller.notifications);

module.exports = router;
