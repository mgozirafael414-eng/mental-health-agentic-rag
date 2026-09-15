const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { requireAuth, adminCheck, ownerCheck } = require("../middleware/roleMiddleware");
const controller = require("../controllers/adminController");

const router = express.Router();

// Authenticate with the same JWT middleware used by normal protected routes,
// then load the current account and apply the endpoint-specific role policy.
const adminAccess = [authMiddleware, requireAuth, adminCheck];
const ownerAccess = [authMiddleware, requireAuth, ownerCheck];

router.get("/dashboard", ...adminAccess, controller.dashboard);
router.get("/users", ...adminAccess, controller.listUsers);
router.get("/users/:id", ...adminAccess, controller.getUser);
router.patch("/users/:id", ...adminAccess, controller.updateUser);
router.get("/professionals", ...adminAccess, controller.professionals);
router.get("/appointments", ...adminAccess, controller.listAppointments);
router.patch("/appointments/:id", ...adminAccess, controller.updateAppointment);
router.get("/notifications", ...adminAccess, controller.listNotifications);
router.post("/notifications", ...adminAccess, controller.createNotification);
router.get("/audit-logs", ...adminAccess, controller.auditLogs);
router.get("/resources", ...adminAccess, (req, res) => res.json({
  success: true,
  message: "Resource management is not yet enabled.",
}));
router.get("/owner/admins", ...ownerAccess, controller.admins);
router.post("/owner/admins", ...ownerAccess, controller.createAdmin);
router.patch("/owner/admins/:id", ...ownerAccess, controller.updateAdmin);
router.delete("/owner/admins/:id", ...ownerAccess, controller.deleteAdmin);

module.exports = router;
