const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const requireAuth = require("../middleware/roleMiddleware").requireAuth;
const controller = require("../controllers/professionalCommunicationController");

router.use(auth, requireAuth);
router.get("/", controller.list);
router.post("/", controller.create);
router.post("/:id/messages", controller.send);
router.get("/notes", controller.listNotes);
router.put("/notes/:appointmentId", controller.saveNote);

module.exports = router;
