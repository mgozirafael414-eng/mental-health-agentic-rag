const express = require("express");

const {
  getCurrentUser,
  updateProfile,
  changePassword,
  updatePreferences,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// GET CURRENT USER
// Protected route
// ========================================

router.get("/me", authMiddleware, getCurrentUser);
router.patch("/me", authMiddleware, updateProfile);
router.patch("/me/password", authMiddleware, changePassword);
router.patch("/me/preferences", authMiddleware, updatePreferences);

module.exports = router;