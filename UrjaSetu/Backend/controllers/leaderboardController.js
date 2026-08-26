const mongoose = require("mongoose");
const Progress = require("../models/progress");

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Progress.aggregate([
      {
        $match: {
          challenge: new mongoose.Types.ObjectId(req.params.challengeId),
        },
      },

      {
        $group: {
          _id: "$user",
          totalProgress: {
            $sum: "$progress",
          },
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },

      {
        $unwind: "$user",
      },

      {
        $project: {
          _id: 0,
          userId: "$user._id",
          name: "$user.name",
          email: "$user.email",
          totalProgress: 1,
        },
      },

      {
        $sort: {
          totalProgress: -1,
        },
      },
    ]);

    // Add Rank
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      ...user,
    }));

    res.status(200).json({
      success: true,
      leaderboard: rankedLeaderboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};