const express = require("express");
const router = express.Router();

const {
  createChallenge,
  getAllChallenges,
  getChallengeById,
  updateChallenge,
  deleteChallenge,
  joinChallenge,
} = require("../controllers/challengeController");
const { protect } = require("../middleware/authMiddleware");

// Create Challenge (Logged-in User)
router.post("/", protect, createChallenge);
router.get("/", getAllChallenges);
router.get("/:id", getChallengeById);
router.put("/:id", protect, updateChallenge);
router.delete("/:id", protect, deleteChallenge);
router.post("/:id/join", protect, joinChallenge);

module.exports = router;