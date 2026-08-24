const Progress = require("../models/Progress");
const Challenge = require("../models/Challenge");

// Add Progress
exports.addProgress = async (req, res) => {
  try {
    const { challengeId, date, progress } = req.body;

    // Check Challenge Exists
    const challenge = await Challenge.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    // Create Progress
    const newProgress = await Progress.create({
      user: req.user.id,
      challenge: challengeId,
      date,
      progress,
    });

    res.status(201).json({
      success: true,
      message: "Progress added successfully",
      progress: newProgress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get My Progress
exports.getMyProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user.id })
      .populate("challenge", "title description");

    res.status(200).json({
      success: true,
      count: progress.length,
      progress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Progress By Challenge
exports.getProgressByChallenge = async (req, res) => {
  try {
    const progress = await Progress.find({
      challenge: req.params.challengeId,
    }).populate("user", "name email");

    res.status(200).json({
      success: true,
      count: progress.length,
      progress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Update Progress
exports.updateProgress = async (req, res) => {
  try {
    const progress = await Progress.findById(req.params.id);

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress not found",
      });
    }

    const updatedProgress = await Progress.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Progress updated successfully",
      progress: updatedProgress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Progress
exports.deleteProgress = async (req, res) => {
  try {
    const progress = await Progress.findById(req.params.id);

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress not found",
      });
    }

    await Progress.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Progress deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};