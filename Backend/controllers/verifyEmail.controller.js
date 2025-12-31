import crypto from "crypto";
import User from "../modals/User.modal.js";

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Verification token is missing",
            });
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            emailVerifyToken: hashedToken,
            emailVerifyExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired token",
            });
        }

        user.emailVerified = true;
        user.emailVerifyToken = undefined;
        user.emailVerifyExpire = undefined;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


