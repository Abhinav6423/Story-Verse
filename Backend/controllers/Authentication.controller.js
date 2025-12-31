import User from "../modals/User.modal.js";
import Userstats from "../modals/Userstats.modal.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
const setTokenInCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,        // only true on https
        sameSite: "none",
        path: "/",
    });

}



const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // 🔑 CREATE RAW TOKEN
        const rawToken = crypto.randomBytes(32).toString("hex");

        // 🔐 HASH TOKEN FOR DB
        const hashedToken = crypto
            .createHash("sha256")
            .update(rawToken)
            .digest("hex");

        const user = await User.create({
            username,
            email,
            password,
            emailVerified: false,
            emailVerifyToken: hashedToken,
            emailVerifyExpire: Date.now() + 24 * 60 * 60 * 1000 // 24h
        });

        await Userstats.create({
            userId: user._id,
            username: user.username,
            profilePic: user.profilePic
        });

        const verifyURL = `${process.env.FRONTEND_URL}/verify-email?token=${rawToken}`;

        await sendEmail({
            to: user.email,
            subject: "Verify your email - StoryFlix",
            html: `
        <h2>Welcome to StoryFlix</h2>
        <p>Please verify your email to continue.</p>
        <a href="${verifyURL}" target="_blank">Verify Email</a>
        <p>This link expires in 24 hours.</p>
    `,
        });

        return res.status(201).json({
            success: true,
            message: "Registered successfully. Verify email.",
            // verifyToken: rawToken // ⚠️ TEMP (for testing)
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist",
            });
        }

        const isMatch = await user.isPasswordCorrect(password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // 🔒 BLOCK UNVERIFIED USERS
        if (!user.emailVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email before logging in",
            });
        }

        const token = await user.generateToken();
        setTokenInCookie(res, token);

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePic: user.profilePic,
            },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json(
            {
                success: true,
                message: "User logged out successfully"
            }
        )
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: error.message
            }
        )
    }
}

const getLoggedInUser = async (req, res) => {
    try {
        const userId = req.user._id
        if (!userId) {
            return res.status(400).json(
                {
                    success: false,
                    message: "You are Unauthorized"
                }
            )
        }
        const user = await User.findById(userId).select("-password")
        return res.status(200).json(
            {
                success: true,
                user: user
            }
        )
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: error.message
            }
        )
    }
}

export { registerUser, loginUser, logoutUser, getLoggedInUser }