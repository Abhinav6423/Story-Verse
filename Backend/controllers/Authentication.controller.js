import User from "../modals/User.modal.js";
import Userstats from "../modals/Userstats.modal.js";

/* ---------------- COOKIE UTILS ---------------- */
const setTokenInCookie = (res, token) => {
    const isProd = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
        httpOnly: true,
        secure: isProd,
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
            user,
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
            user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* ---------------- GOOGLE CALLBACK (PASSPORT) ---------------- */
/**
 * Passport already verified Google
 * req.user is available here
 */
export const googleCallback = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL}/`);
        }

        // 🔥 SYNC USER STATS FOR GOOGLE USER
        await Userstats.findOneAndUpdate(
            { userId: user._id },
            {
                username: user.username,
                profilePic: user.profilePic || "",
            },
            { upsert: true }
        );

        const token = user.generateToken();
        setTokenInCookie(res, token);

        return res.redirect(`${process.env.FRONTEND_URL}/auth/success`);
    } catch (error) {
        console.error(error);
        return res.redirect(`${process.env.FRONTEND_URL}/`);
    }
};




/* ---------------- LOGOUT ---------------- */
export const logoutUser = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

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
