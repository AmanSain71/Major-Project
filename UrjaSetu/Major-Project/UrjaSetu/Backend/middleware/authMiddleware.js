const User = require("../models/User");
const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = decoded;

            next();
        } catch (error) {
            return res.status(401).json({
                message: "Not authorized, token failed",
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            message: "No token, authorization denied",
        });
    }
};

const admin = (req, res, next) => {
    if (req.user) {
        User.findById(req.user.id)
            .then((user) => {
                if (user.role === "admin") {
                    next();
                } else {
                    res.status(403).json({
                        message: "Access Denied. Admin only.",
                    });
                }
            })
            .catch((err) => {
                res.status(500).json({
                    message: err.message,
                });
            });
    } else {
        res.status(401).json({
            message: "Not Authorized",
        });
    }
};

module.exports = {
    protect,
    admin,
};