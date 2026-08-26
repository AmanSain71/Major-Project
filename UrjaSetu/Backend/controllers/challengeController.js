const Challenge = require("../models/challenge");

// Create Challenge
exports.createChallenge = async (req, res) => {
  try {
    const { title, description, startDate, endDate, target } = req.body;

    const challenge = await Challenge.create({
      title,
      description,
      startDate,
      endDate,
      target,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Challenge created successfully",
      challenge,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Challenges
exports.getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find()
      .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      count: challenges.length,
      challenges,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Challenge By ID
exports.getChallengeById = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("participants", "name email");

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    res.status(200).json({
      success: true,
      challenge,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Challenge
exports.updateChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    const updatedChallenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Challenge updated successfully",
      challenge: updatedChallenge,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Challenge
exports.deleteChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    await Challenge.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Challenge deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Join Challenge
exports.joinChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    // Check if user already joined
    if (
  challenge.participants.some(
    (participant) => participant.toString() === req.user.id
  )
) {
  return res.status(200).json({
    success: true,
    message: "You have already joined this challenge",
  });
}
    // Add user to participants
    challenge.participants.push(req.user.id);

    await challenge.save();

    res.status(200).json({
      success: true,
      message: "Challenge joined successfully",
      challenge,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};