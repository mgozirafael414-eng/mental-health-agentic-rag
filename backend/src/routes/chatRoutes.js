const express = require("express");

const {
  chat
} = require("../controllers/chatController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// CHAT
// ========================================

router.post(
  "/:conversationId",
  authMiddleware,
  chat
);

module.exports = router;