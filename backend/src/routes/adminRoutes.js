const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const { requireAuth, adminCheck, ownerCheck } = require("../middleware/roleMiddleware");
const controller = require("../controllers/adminController");

const router = express.Router();

// Authenticate with the same JWT middleware used by normal protected routes,
// then load the current account and apply the endpoint-specific role policy.
const adminAccess = [authMiddleware, requireAuth, adminCheck];
const ownerAccess = [authMiddleware, requireAuth, ownerCheck];
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    const extension = file.originalname.toLowerCase().split(".").pop();
    if (!["txt", "md"].includes(extension)) {
      return callback(new Error("Only .txt and .md resource files are supported."));
    }
    return callback(null, true);
  },
});

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
router.get("/resources", ...adminAccess, controller.listResources);
router.post("/resources/upload", ...adminAccess, (req, res, next) => {
  upload.single("file")(req, res, (error) => {
    if (error) return res.status(400).json({ success: false, message: error.message });
    return next();
  });
}, controller.uploadResource);
router.get("/owner/admins", ...ownerAccess, controller.admins);
router.post("/owner/admins", ...ownerAccess, controller.createAdmin);
router.patch("/owner/admins/:id", ...ownerAccess, controller.updateAdmin);
router.delete("/owner/admins/:id", ...ownerAccess, controller.deleteAdmin);

module.exports = router;
