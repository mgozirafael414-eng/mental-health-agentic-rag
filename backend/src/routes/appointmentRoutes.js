const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/appointmentController");
router.get("/", auth, controller.list);
router.post("/", auth, controller.create);
router.get("/:id", auth, controller.getOne);
router.patch("/:id", auth, controller.update);
router.delete("/:id", auth, controller.remove);
module.exports = router;
