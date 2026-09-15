const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/notificationController");
router.get("/", auth, controller.list);
router.get("/unread-count", auth, controller.unreadCount);
router.patch("/read-all", auth, controller.markAllRead);
router.patch("/:id/read", auth, controller.markRead);
router.delete("/:id", auth, controller.remove);
module.exports = router;
