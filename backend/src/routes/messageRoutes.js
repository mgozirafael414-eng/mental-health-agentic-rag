const express = require("express");

const {
  addMessage,
  getMessages
} = require("../controllers/messageController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Add message
router.post(
  "/:conversationId",
  authMiddleware,
  addMessage
);

// Get conversation messages
router.get(
  "/:conversationId",
  authMiddleware,
  getMessages
);

module.exports = router;