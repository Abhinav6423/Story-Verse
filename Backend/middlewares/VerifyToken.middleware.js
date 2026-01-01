import User from "../modals/User.modal.js";
import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        // 🔹 Not logged in is NORMAL
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not logged in",
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch {
            // 🔹 Invalid/expired token = logout state
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("verifyToken error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export default verifyToken;
