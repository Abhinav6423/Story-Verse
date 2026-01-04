import User from "../modals/User.modal.js";
import Userstats from "../modals/Userstats.modal.js";

/* ---------------- COOKIE UTILS ---------------- */
const setTokenInCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,      // Railway HTTPS
        sameSite: "lax",   // SAME DOMAIN FIX
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
        });

        await Userstats.create({
            userId: user._id,
            username: user.username,
        });

        const token = user.generateToken();
        setTokenInCookie(res, token);

        // 🔥 DEBUG
        console.log("REGISTER SET-COOKIE", res.getHeaders()["set-cookie"]);

        return res.status(201).json({
            success: true,
            message: "Registered successfully",
            user,
        });
    } catch (error) {
        console.error("REGISTER ERROR", error);
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
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
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

        // 🔥 DEBUG (MOST IMPORTANT)
        console.log("LOGIN SET-COOKIE", res.getHeaders()["set-cookie"]);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user,
        });
    } catch (error) {
        console.error("LOGIN ERROR", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* ---------------- LOGOUT ---------------- */
export const logoutUser = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
    });

    console.log("LOGOUT COOKIE CLEARED");

    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};

/* ---------------- CURRENT USER ---------------- */
export const getLoggedInUser = async (req, res) => {
    try {
        // 🔥 DEBUG
        console.log("ME COOKIES", req.cookies);

        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("ME ERROR", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
