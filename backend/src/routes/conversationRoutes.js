const express = require("express");

const {
  createConversation,
  getConversations,
  getConversation,
  renameConversation,
  togglePin,
  toggleArchive,
  clearMessages,
  deleteConversation,
} = require("../controllers/conversationController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

// GET  /api/conversations?archived=false&sort=newest
router.get("/", getConversations);

// POST /api/conversations
router.post("/", createConversation);

// GET  /api/conversations/:id
router.get("/:id", getConversation);

// PATCH /api/conversations/:id/rename
router.patch("/:id/rename", renameConversation);

// PATCH /api/conversations/:id/pin
router.patch("/:id/pin", togglePin);

// PATCH /api/conversations/:id/archive
router.patch("/:id/archive", toggleArchive);

// DELETE /api/conversations/:id/messages  (clear)
router.delete("/:id/messages", clearMessages);

// DELETE /api/conversations/:id
router.delete("/:id", deleteConversation);

module.exports = router;
