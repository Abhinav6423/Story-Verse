import User from "../modals/User.modal.js";
import Userstats from "../modals/Userstats.modal.js";
import ShortStory from "../modals/Shortstory.modal.js";



const getUserProfileData = async (req, res) => {
    try {
        // req.user verifyToken se aata hai
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const userStats = await Userstats.findOne({ userId });

        // 👇 agar stats hi nahi mile
        if (!userStats) {
            return res.status(404).json({
                success: false,
                message: "User stats not found",
            });
        }

        return res.status(200).json({
            success: true,
            userStats, // 🔥 actual data bhejna zaroori hai
        });
    } catch (error) {
        console.error("getUserProfileData error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export default getUserProfileData;


/* ================= USER STORIES ================= */
const getUserShortStories = async (req, res) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const filter = { author: userId };
        if (req.query.status) filter.status = req.query.status;

        const stories = await ShortStory.find(filter);

        return res.status(200).json({
            success: true,
            data: stories,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* ================= UPDATE PROFILE ================= */
const updateProfile = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { profilePic, username } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        if (!username) {
            return res.status(400).json({
                success: false,
                message: "Username is required",
            });
        }

        // ✅ Update User (auth source of truth)
        const user = await User.findByIdAndUpdate(
            userId,
            {
                username,
                ...(profilePic && { profilePic }),
            },
            { new: true }
        ).select("username email profilePic provider");

        // ✅ Keep Userstats in sync (prevents stale UI)
        await Userstats.findOneAndUpdate(
            { userId },
            {
                username: user.username,
                ...(profilePic && { profilePic }),
            },
            { upsert: true }
        );

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user, // 🔥 frontend can update AuthProvider instantly
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export {
    getUserProfileData,
    getUserShortStories,
    updateProfile,
};
