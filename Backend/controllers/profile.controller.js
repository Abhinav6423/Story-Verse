import User from "../modals/User.modal.js";
import Userstats from "../modals/Userstats.modal.js";
import ShortStory from "../modals/Shortstory.modal.js";
import { uploadToCloudinary } from "../utils/cloudinaryUploadFunction.js"


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



const updateProfile = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { username } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }


        let profilePicUrl;

        // ✅ Upload image to Cloudinary if provided
        if (req.file) {
            const { url } = await uploadToCloudinary(
                req.file,   // ✅ FIXED (buffer, not path)
                "story_covers"
            );
            profilePicUrl = url;
        }

        // ✅ Update User
        const user = await User.findByIdAndUpdate(
            userId,
            {
                ...(username && { username }),
                ...(profilePicUrl && { profilePic: profilePicUrl }),
            },
            { new: true }
        ).select("username email profilePic provider");


        // ✅ Sync Userstats
        await Userstats.findOneAndUpdate(
            { userId },
            {
                username: user.username,
                ...(profilePicUrl && { profilePic: profilePicUrl }),
            },
            { upsert: true }
        );

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user,
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
