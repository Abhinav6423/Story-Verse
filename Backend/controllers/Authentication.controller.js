import User from "../modals/User.modal.js";
import Userstats from "../modals/Userstats.modal.js";
import { OAuth2Client } from "google-auth-library";

/* ---------------- COOKIE UTILS ---------------- */
const setTokenInCookie = (res, token) => {
    const isProd = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
        httpOnly: true,
        secure: isProd,                 // true on Railway
        sameSite: isProd ? "none" : "lax",
        path: "/",
    });
};






/* ---------------- LOCAL REGISTER ---------------- */
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const user = await User.create({
            username,
            email,
            password,
            provider: "local",
            emailVerified: true,
        });

        await Userstats.create({
            userId: user._id,
            username: user.username,
            profilePic: user.profilePic || "",
        });

        const token = user.generateToken();
        setTokenInCookie(res, token);

        return res.status(201).json({
            success: true,
            message: "Registered successfully",
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

/* ---------------- LOCAL LOGIN ---------------- */
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const user = await User.findOne({ email });
        if (!user || user.provider !== "local") {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const isMatch = await user.isPasswordCorrect(password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const token = user.generateToken();
        setTokenInCookie(res, token);

        return res.status(200).json({
            success: true,
            message: "Login successful",
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

/* ---------------- GOOGLE AUTH ---------------- */
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ success: false, message: "Token missing" });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email, name, picture } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                email,
                username: name || email.split("@")[0],
                profilePic: picture,
                provider: "google",
                emailVerified: true,
            });

            await Userstats.create({
                userId: user._id,
                username: user.username,
                profilePic: user.profilePic || "",
            });
        }

        const jwtToken = user.generateToken();
        setTokenInCookie(res, jwtToken);

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePic: user.profilePic,
            },
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Google authentication failed",
        });
    }
};

/* ---------------- LOGOUT ---------------- */
export const logoutUser = async (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};

/* ---------------- CURRENT USER ---------------- */
export const getLoggedInUser = async (req, res) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const user = await User.findById(req.user._id).select("-password");

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
