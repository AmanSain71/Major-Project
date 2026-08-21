const express = require("express");
const router = express.Router();

const {
  addProgress,
  getMyProgress,
  getProgressByChallenge,
  updateProgress,
  deleteProgress,
} = require("../controllers/progressController");
const { protect } = require("../middleware/authMiddleware");

// Add Progress
router.post("/", protect, addProgress);
router.get("/my", protect, getMyProgress);
router.get("/challenge/:challengeId", protect, getProgressByChallenge);
router.put("/:id", protect, updateProgress);
router.delete("/:id", protect, deleteProgress);

module.exports = router;