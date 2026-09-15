const express = require("express");

const {
  getResources,
  getResource,
  getCategories,
  toggleBookmark,
  getBookmarks,
  getRecentlyViewed,
} = require("../controllers/resourceController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// All resource routes require authentication
router.use(authMiddleware);

// GET /api/resources/categories  — must be before /:id
router.get("/categories", getCategories);

// GET /api/resources/bookmarks
router.get("/bookmarks", getBookmarks);

// POST /api/resources/recently-viewed
router.post("/recently-viewed", getRecentlyViewed);

// GET /api/resources?search=&category=&page=&limit=
router.get("/", getResources);

// GET /api/resources/:id
router.get("/:id", getResource);

// POST /api/resources/:id/bookmark
router.post("/:id/bookmark", toggleBookmark);

module.exports = router;
