const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middleware/authMiddleware");
const { register, login } = require("../controllers/authControllers");


// Register
router.post("/register", register);


// Login
router.post("/login", login);


// Profile
router.get("/profile", protect, async (req, res) => {
    try {
        const User = require("../models/User");

        const user = await User.findById(req.user.id)
            .select("-password");

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// Admin
router.get("/admin", protect, admin, (req, res) => {
    res.status(200).json({
        message: "Welcome Admin 👑"
    });
});


module.exports = router;