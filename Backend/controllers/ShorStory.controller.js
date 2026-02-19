import ShortStory from "../modals/Shortstory.modal.js"
import Userstats from "../modals/Userstats.modal.js";
import Userhistory from "../modals/Userhistory.modal.js";
import goodReadShortStory from "../modals/GoodReadShortStory.modal.js";
import mongoose from "mongoose"
import { uploadToCloudinary } from "../utils/cloudinaryUploadFunction.js"
// creator panel
const createShortStory = async (req, res) => {
    console.log("USER:", req.user?._id || "No user");

    try {
        /* ================= USER SAFETY ================= */
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - user not found"
            });
        }

        /* ================= BODY ================= */
        const {
            title,
            story,
            description,
            finalQuestion,
            category,
            status,
            finalAnswer
        } = req.body;

        if (
            !title ||
            !story ||
            !description ||
            !finalQuestion ||
            !category ||
            !finalAnswer
        ) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided"
            });
        }

        if (status && !["draft", "published"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        /* ================= IMAGE UPLOAD ================= */
        let coverImageUrl = null;

        if (req.file) {
            try {
                const uploadResult = await uploadToCloudinary(
                    req.file,
                    "story_covers"
                );

                coverImageUrl = uploadResult?.url || null;
                console.log("Image uploaded:", coverImageUrl);

            } catch (cloudError) {
                console.error("Cloudinary Upload Error:", cloudError);
                return res.status(500).json({
                    success: false,
                    message: "Image upload failed"
                });
            }
        }

        /* ================= CREATE STORY ================= */
        let shortStory;
        try {
            shortStory = await ShortStory.create({
                title,
                story,
                description,
                coverImage: coverImageUrl,
                finalQuestion,
                category,
                author: req.user._id,
                status: status || "draft",
                finalAnswer
            });
        } catch (dbError) {
            console.error("Story Create DB Error:", dbError);
            return res.status(500).json({
                success: false,
                message: "Failed to create story"
            });
        }

        /* ================= UPDATE USER STATS ================= */
        try {
            await Userstats.updateOne(
                { userId: req.user._id },
                { $inc: { totalShortStoriesCreated: 1 } }
            );
        } catch (statsError) {
            console.error("Userstats Update Error:", statsError);
        }

        /* ================= XP SYSTEM ================= */
        if (shortStory.status === "published") {
            try {
                const stats = await Userstats.findOneAndUpdate(
                    { userId: req.user._id },
                    { $inc: { xp: 30 } },
                    { new: true }
                );

                if (stats && stats.xp >= stats.xpToNextLevel) {
                    await Userstats.findOneAndUpdate(
                        { userId: req.user._id },
                        {
                            $inc: { level: 1 },
                            $set: {
                                xp: stats.xp - stats.xpToNextLevel,
                                xpToNextLevel: stats.xpToNextLevel * 2
                            }
                        }
                    );
                }
            } catch (xpError) {
                console.error("XP Update Error:", xpError);
            }
        }

        /* ================= SUCCESS ================= */
        return res.status(201).json({
            success: true,
            message: "Short story created successfully",
            shortStory
        });

    } catch (error) {
        console.error("CREATE STORY FATAL ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};





const listUserShortStory = async (req, res) => {
    try {
        // =========================
        // 1. Validate Auth User
        // =========================
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found in request"
            });
        }

        const userId = req.user._id;

        // =========================
        // 2. Extract & Sanitize Query
        // =========================
        let { status, title, category } = req.query;

        const filter = { author: userId };

        if (status) {
            const allowedStatus = ["draft", "published", "archived"];
            if (!allowedStatus.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid status value"
                });
            }
            filter.status = status;
        }

        if (title && typeof title === "string") {
            filter.title = { $regex: title.trim(), $options: "i" };
        }

        if (category && typeof category === "string") {
            filter.category = category.trim();
        }

        // =========================
        // 3. Fetch Data
        // =========================
        const shortStory = await ShortStory
            .find(filter)
            .sort({ createdAt: -1 })
            .lean();   // faster + safe (no mongoose doc methods)

        // =========================
        // 4. Handle Empty Result
        // =========================
        if (!shortStory || shortStory.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No stories found",
                shortStory: []
            });
        }

        // =========================
        // 5. Success Response
        // =========================
        return res.status(200).json({
            success: true,
            count: shortStory.length,
            shortStory
        });

    } catch (error) {
        console.error("List User ShortStory Error:", error);

        // =========================
        // 6. Mongo / Cast Error Handling
        // =========================
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format"
            });
        }

        if (error.name === "MongoNetworkError") {
            return res.status(503).json({
                success: false,
                message: "Database connection error. Try again later."
            });
        }

        // =========================
        // 7. Generic Server Error
        // =========================
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};




const openUserShortStory = async (req, res) => {
    try {
        // =========================
        // 1. Validate Auth User
        // =========================
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found in request"
            });
        }

        const userId = req.user._id;

        // =========================
        // 2. Validate storyId
        // =========================
        const { storyId } = req.params;

        if (!storyId) {
            return res.status(400).json({
                success: false,
                message: "storyId is required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(storyId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid storyId format"
            });
        }

        // =========================
        // 3. Fetch Story
        // =========================
        const shortStory = await ShortStory
            .findById(storyId)
            .lean();  // performance boost

        if (!shortStory) {
            return res.status(404).json({
                success: false,
                message: "Short story not found"
            });
        }

        // =========================
        // 4. Authorization Check
        // =========================
        if (shortStory.author.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: You are not allowed to access this story"
            });
        }

        // =========================
        // 5. Success Response
        // =========================
        return res.status(200).json({
            success: true,
            shortStory
        });

    } catch (error) {
        console.error("Open User ShortStory Error:", error);

        // =========================
        // 6. Mongo Cast Error
        // =========================
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format"
            });
        }

        // =========================
        // 7. DB Connection Issue
        // =========================
        if (error.name === "MongoNetworkError") {
            return res.status(503).json({
                success: false,
                message: "Database connection error. Try again later."
            });
        }

        // =========================
        // 8. Generic Server Error
        // =========================
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



const updateShortStory = async (req, res) => {
    try {
        // =========================
        // 1. Validate Auth User
        // =========================
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found in request"
            });
        }

        const userId = req.user._id;

        // =========================
        // 2. Validate storyId
        // =========================
        const { storyId } = req.params;

        if (!storyId) {
            return res.status(400).json({
                success: false,
                message: "storyId is required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(storyId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid storyId format"
            });
        }

        // =========================
        // 3. Extract Body
        // =========================
        const {
            title,
            story,
            description,
            finalQuestion,
            finalAnswer,
            category,
            status
        } = req.body;

        // =========================
        // 4. Validate Status
        // =========================
        if (status && !["draft", "published"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value"
            });
        }

        // =========================
        // 5. Handle Image Upload
        // =========================
        let coverImage;

        if (req.file) {
            try {
                const { url } = await uploadToCloudinary(req.file, "story_covers");
                coverImage = url;
            } catch (uploadError) {
                console.error("Cloudinary Upload Error:", uploadError);
                return res.status(500).json({
                    success: false,
                    message: "Image upload failed"
                });
            }
        }

        // =========================
        // 6. Fetch Story
        // =========================
        const shortStory = await ShortStory.findById(storyId);

        if (!shortStory) {
            return res.status(404).json({
                success: false,
                message: "Short story not found"
            });
        }

        // =========================
        // 7. Authorization Check
        // =========================
        if (shortStory.author.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: You cannot update this story"
            });
        }

        // =========================
        // 8. Store Previous Status
        // =========================
        const previousStatus = shortStory.status;

        // =========================
        // 9. Update Fields (Safe)
        // =========================
        if (title !== undefined) shortStory.title = title;
        if (story !== undefined) shortStory.story = story;
        if (description !== undefined) shortStory.description = description;
        if (coverImage !== undefined) shortStory.coverImage = coverImage;
        if (finalQuestion !== undefined) shortStory.finalQuestion = finalQuestion;
        if (finalAnswer !== undefined) shortStory.finalAnswer = finalAnswer;
        if (category !== undefined) shortStory.category = category;
        if (status !== undefined) shortStory.status = status;

        await shortStory.save();

        // =========================
        // 10. XP Logic (Safe)
        // =========================
        const XP_REWARD = 30;

        try {
            // draft → published
            if (previousStatus === "draft" && shortStory.status === "published") {
                await Userstats.findOneAndUpdate(
                    { userId: shortStory.author },
                    { $inc: { xp: XP_REWARD } },
                    { new: true, upsert: true }
                );
            }

            // published → draft
            if (previousStatus === "published" && shortStory.status === "draft") {
                await Userstats.findOneAndUpdate(
                    { userId: shortStory.author },
                    [
                        {
                            $set: {
                                xp: {
                                    $max: [
                                        { $add: ["$xp", -XP_REWARD] },
                                        0
                                    ]
                                }
                            }
                        }
                    ],
                    { new: true }
                );
            }
        } catch (xpError) {
            console.error("XP Update Error:", xpError);
            // Do NOT fail main request if XP fails
        }

        // =========================
        // 11. Success Response
        // =========================
        return res.status(200).json({
            success: true,
            message: "Short story updated successfully",
            shortStory
        });

    } catch (error) {
        console.error("Update ShortStory Error:", error);

        // =========================
        // 12. Mongo Cast Error
        // =========================
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format"
            });
        }

        // =========================
        // 13. Mongo Validation Error
        // =========================
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                message: messages.join(", ")
            });
        }

        // =========================
        // 14. DB Connection Error
        // =========================
        if (error.name === "MongoNetworkError") {
            return res.status(503).json({
                success: false,
                message: "Database connection error. Try again later."
            });
        }

        // =========================
        // 15. Generic Error
        // =========================
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};






const deleteShortStory = async (req, res) => {
    try {
        // =========================
        // 1. Validate Auth User
        // =========================
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found in request"
            });
        }

        const userId = req.user._id;

        // =========================
        // 2. Validate storyId
        // =========================
        const { storyId } = req.params;

        if (!storyId) {
            return res.status(400).json({
                success: false,
                message: "storyId is required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(storyId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid storyId format"
            });
        }

        // =========================
        // 3. Fetch Story
        // =========================
        const shortStory = await ShortStory.findById(storyId);

        if (!shortStory) {
            return res.status(404).json({
                success: false,
                message: "Short story not found"
            });
        }

        // =========================
        // 4. Authorization Check
        // =========================
        if (shortStory.author.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: You cannot delete this story"
            });
        }

        // =========================
        // 5. Cleanup Related Data
        // =========================
        try {
            await Promise.all([
                goodReadShortStory.deleteMany({ story: storyId }),
                // add other related cleanup here if needed
            ]);
        } catch (cleanupError) {
            console.error("Cleanup Error:", cleanupError);
            return res.status(500).json({
                success: false,
                message: "Failed to cleanup related data"
            });
        }

        // =========================
        // 6. Delete Story
        // =========================
        await ShortStory.findByIdAndDelete(storyId);

        // =========================
        // 7. XP Update (Safe)
        // =========================
        const XP_REWARD = 30;

        if (shortStory.status === "published") {
            try {
                await Userstats.findOneAndUpdate(
                    { userId },
                    [
                        {
                            $set: {
                                xp: {
                                    $max: [
                                        { $add: ["$xp", -XP_REWARD] },
                                        0
                                    ]
                                }
                            }
                        }
                    ],
                    { new: true }
                );
            } catch (xpError) {
                console.error("XP Update Error:", xpError);
                // Do NOT fail delete if XP update fails
            }
        }

        // =========================
        // 8. Success Response
        // =========================
        return res.status(200).json({
            success: true,
            message: "Short story deleted successfully"
        });

    } catch (error) {
        console.error("Delete ShortStory Error:", error);

        // =========================
        // 9. Mongo Cast Error
        // =========================
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format"
            });
        }

        // =========================
        // 10. Mongo Validation Error
        // =========================
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                message: messages.join(", ")
            });
        }

        // =========================
        // 11. DB Connection Error
        // =========================
        if (error.name === "MongoNetworkError") {
            return res.status(503).json({
                success: false,
                message: "Database connection error. Try again later."
            });
        }

        // =========================
        // 12. Generic Error
        // =========================
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};




// Home Feed 
const listShortStory = async (req, res) => {
    try {
        // =========================
        // 1. Safe User (optional auth)
        // =========================
        const userId = req.user?._id || null;

        // =========================
        // 2. Extract & Sanitize Query
        // =========================
        let { category, title } = req.query;

        const filter = {
            status: "published",
        };

        if (category && typeof category === "string") {
            filter.category = category.trim();
        }

        if (title && typeof title === "string") {
            filter.title = {
                $regex: title.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), // escape regex
                $options: "i",
            };
        }

        // =========================
        // 3. Fetch Stories
        // =========================
        const stories = await ShortStory.find(filter)
            .populate("author", "username profilePic")
            .sort({ createdAt: -1 })
            .lean();

        if (!stories || stories.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No stories found",
                shortStory: [],
            });
        }

        // =========================
        // 4. Format Stories
        // =========================
        const formattedStories = stories.map((story) => {
            let isLiked = false;
            let isGoodRead = false;

            if (userId) {
                isLiked = story.likedBy?.some(
                    (id) => id.toString() === userId.toString()
                );

                isGoodRead = story.GoodReadsBy?.some(
                    (id) => id.toString() === userId.toString()
                );
            }

            return {
                ...story,
                isLiked,
                isGoodRead,
            };
        });

        // =========================
        // 5. Success Response
        // =========================
        return res.status(200).json({
            success: true,
            count: formattedStories.length,
            shortStory: formattedStories,
        });

    } catch (error) {
        console.error("List ShortStory Error:", error);

        // =========================
        // 6. Mongo Cast Error
        // =========================
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid query format",
            });
        }

        // =========================
        // 7. Mongo Network Error
        // =========================
        if (error.name === "MongoNetworkError") {
            return res.status(503).json({
                success: false,
                message: "Database connection error. Try again later.",
            });
        }

        // =========================
        // 8. Generic Error
        // =========================
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};




const openShortStory = async (req, res) => {
    try {
        // =========================
        // 1. Validate storyId
        // =========================
        const { storyId } = req.params;

        if (!storyId) {
            return res.status(400).json({
                success: false,
                message: "storyId is required",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(storyId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid storyId format",
            });
        }

        // =========================
        // 2. Validate Auth User
        // =========================
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found in request",
            });
        }

        const userId = req.user._id;

        // =========================
        // 3. Fetch Story
        // =========================
        const shortStory = await ShortStory.findById(storyId)
            .populate("author", "username profilePic")
            .lean();

        if (!shortStory || shortStory.status !== "published") {
            return res.status(404).json({
                success: false,
                message: "Short story not found",
            });
        }

        // =========================
        // 4. Like Status (Safe)
        // =========================
        let isLiked = false;

        if (Array.isArray(shortStory.likedBy)) {
            isLiked = shortStory.likedBy.some(
                (id) => id.toString() === userId.toString()
            );
        }

        // =========================
        // 5. GoodRead Status
        // =========================
        let isGoodRead = false;

        try {
            const addedToGoodReads = await goodReadShortStory.findOne({
                reader: userId,
                story: storyId,
            }).lean();

            isGoodRead = !!addedToGoodReads;
        } catch (goodReadError) {
            console.error("GoodRead Check Error:", goodReadError);
        }

        // =========================
        // 6. Question Answer Status
        // =========================
        let isQuestionAnswered = false;

        try {
            const alreadyAnswered = await Userhistory.findOne({
                reader: userId,
                contentId: storyId,
                contentType: "shortStory",
            }).lean();

            isQuestionAnswered = !!alreadyAnswered;
        } catch (historyError) {
            console.error("UserHistory Check Error:", historyError);
        }

        // =========================
        // 7. Success Response
        // =========================
        return res.status(200).json({
            success: true,
            shortStory: {
                ...shortStory,
                isLiked,
                isGoodRead,
                isQuestionAnswered,
            },
        });

    } catch (error) {
        console.error("Open ShortStory Error:", error);

        // =========================
        // 8. Mongo Cast Error
        // =========================
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format",
            });
        }

        // =========================
        // 9. Mongo Network Error
        // =========================
        if (error.name === "MongoNetworkError") {
            return res.status(503).json({
                success: false,
                message: "Database connection error. Try again later.",
            });
        }

        // =========================
        // 10. Generic Error
        // =========================
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};



const userAnswer = async (req, res) => {
    try {
        const { storyId } = req.params;
        const { answer } = req.body;
        const userId = req.user._id;

        if (!storyId) {
            return res.status(400).json({
                success: false,
                message: "storyId is required",
            });
        }

        const shortStory = await ShortStory.findById(storyId);

        if (!shortStory || shortStory.status !== "published") {
            return res.status(404).json({
                success: false,
                message: "Short story not found",
            });
        }

        /* ================= CHECK IF ALREADY ANSWERED ================= */
        const alreadyAnswered = await Userhistory.findOne({
            reader: userId,
            contentId: storyId,
            contentType: "shortStory",
        });

        if (alreadyAnswered) {
            return res.status(200).json({
                success: true,
                correctlyAnswered: true,
                message: "You already answered this question",
            });
        }

        /* ================= VALIDATE ANSWER ================= */
        if (!answer || !answer.trim()) {
            return res.status(400).json({
                success: false,
                message: "Answer is required",
            });
        }

        const correctAnswer = shortStory.finalAnswer.trim().toLowerCase();
        const userAnswer = answer.trim().toLowerCase();

        if (correctAnswer !== userAnswer) {
            return res.status(403).json({
                success: false,
                correctlyAnswered: false,
                message: "Wrong answer",
            });
        }

        /* ================= RECORD SUCCESS ================= */
        await Userhistory.create({
            reader: userId,
            contentId: storyId,
            contentType: "shortStory",
        });

        await Userstats.findOneAndUpdate(
            { userId },
            {
                $inc: {
                    xp: 20,
                    totalShortStoriesRead: 1,
                },
            },
            { upsert: true }
        );

        return res.status(200).json({
            success: true,
            correctlyAnswered: true,
            message: "Correct answer! XP awarded 🎉",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


const likeShortStory = async (req, res) => {
    try {
        // =========================
        // 1. Validate Auth User
        // =========================
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found in request",
            });
        }

        const userId = req.user._id;

        // =========================
        // 2. Validate storyId
        // =========================
        const { storyId } = req.params;

        if (!storyId) {
            return res.status(400).json({
                success: false,
                message: "storyId is required",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(storyId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid storyId format",
            });
        }

        // =========================
        // 3. Ensure Story Exists & Published
        // =========================
        const exists = await ShortStory.findById(storyId).select("status likes").lean();

        if (!exists || exists.status !== "published") {
            return res.status(404).json({
                success: false,
                message: "Story not found",
            });
        }

        // =========================
        // 4. Try UNLIKE (toggle off)
        // =========================
        const unliked = await ShortStory.findOneAndUpdate(
            { _id: storyId, likedBy: userId },
            {
                $pull: { likedBy: userId },
                $inc: { likes: -1 },
            },
            { new: true }
        ).select("likes");

        if (unliked) {
            // prevent negative likes (safety)
            if (unliked.likes < 0) {
                await ShortStory.updateOne(
                    { _id: storyId },
                    { $set: { likes: 0 } }
                );
                unliked.likes = 0;
            }

            return res.status(200).json({
                success: true,
                message: "Story unliked",
                likes: unliked.likes,
                isLiked: false,
            });
        }

        // =========================
        // 5. Else → LIKE (toggle on)
        // =========================
        const liked = await ShortStory.findOneAndUpdate(
            { _id: storyId },
            {
                $addToSet: { likedBy: userId },
                $inc: { likes: 1 },
            },
            { new: true }
        ).select("likes");

        if (!liked) {
            return res.status(404).json({
                success: false,
                message: "Story not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Story liked",
            likes: liked.likes,
            isLiked: true,
        });

    } catch (error) {
        console.error("Like ShortStory Error:", error);

        // =========================
        // 6. Mongo Cast Error
        // =========================
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format",
            });
        }

        // =========================
        // 7. Mongo Network Error
        // =========================
        if (error.name === "MongoNetworkError") {
            return res.status(503).json({
                success: false,
                message: "Database connection error. Try again later.",
            });
        }

        // =========================
        // 8. Generic Error
        // =========================
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};





const listTrendingShortStory = async (req, res) => {
    try {
        // =========================
        // 1. Safe User (optional auth)
        // =========================
        const userId = req.user?._id || null;

        const TOTAL_TRENDING = 10;

        // =========================
        // 2. Fetch Trending Stories
        // =========================
        const shortStories = await ShortStory.find({
            status: "published",
        })
            .sort({
                likes: -1,
                totalGoodReads: -1,
                createdAt: -1,
            })
            .limit(TOTAL_TRENDING)
            .populate("author", "username profilePic")
            .lean();

        if (!shortStories || shortStories.length === 0) {
            return res.status(200).json({
                success: true,
                totalCount: 0,
                shortStories: [],
            });
        }

        // =========================
        // 3. Attach User Actions (Safe)
        // =========================
        const storiesWithActions = shortStories.map((story) => {
            let isLiked = false;
            let isGoodRead = false;

            if (userId) {
                if (Array.isArray(story.likedBy)) {
                    isLiked = story.likedBy.some(
                        (id) => id.toString() === userId.toString()
                    );
                }

                if (Array.isArray(story.GoodReadsBy)) {
                    isGoodRead = story.GoodReadsBy.some(
                        (id) => id.toString() === userId.toString()
                    );
                }
            }

            return {
                ...story,
                isLiked,
                isGoodRead,
            };
        });

        // =========================
        // 4. Success Response
        // =========================
        return res.status(200).json({
            success: true,
            totalCount: storiesWithActions.length,
            shortStories: storiesWithActions,
        });

    } catch (error) {
        console.error("List Trending ShortStory Error:", error);

        // =========================
        // 5. Mongo Cast Error
        // =========================
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid query format",
            });
        }

        // =========================
        // 6. Mongo Network Error
        // =========================
        if (error.name === "MongoNetworkError") {
            return res.status(503).json({
                success: false,
                message: "Database connection error. Try again later.",
            });
        }

        // =========================
        // 7. Generic Error
        // =========================
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


const listGoodReads = async (req, res) => {
    try {
        // =========================
        // 1. Validate Auth User
        // =========================
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found in request"
            });
        }

        const userId = req.user._id;

        // =========================
        // 2. Fetch GoodReads
        // =========================
        const goodReads = await goodReadShortStory
            .find({ reader: userId })
            .populate({
                path: "story",
                populate: {
                    path: "author",
                    select: "username profilePic"
                }
            })
            .sort({ createdAt: -1 })
            .lean();

        if (!goodReads || goodReads.length === 0) {
            return res.status(200).json({
                success: true,
                count: 0,
                shortStories: []
            });
        }

        // =========================
        // 3. Map Relations → Stories (Safe)
        // =========================
        const stories = goodReads
            .filter(gr => gr.story && gr.story.status === "published") // skip deleted/unpublished
            .map(gr => {
                const story = gr.story;

                let isLiked = false;

                if (Array.isArray(story.likedBy)) {
                    isLiked = story.likedBy.some(
                        id => id.toString() === userId.toString()
                    );
                }

                return {
                    ...story,
                    isLiked,
                    isGoodRead: true
                };
            });

        // =========================
        // 4. Success Response
        // =========================
        return res.status(200).json({
            success: true,
            count: stories.length,
            shortStories: stories
        });

    } catch (error) {
        console.error("List GoodReads Error:", error);

        // =========================
        // 5. Mongo Cast Error
        // =========================
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format"
            });
        }

        // =========================
        // 6. Mongo Network Error
        // =========================
        if (error.name === "MongoNetworkError") {
            return res.status(503).json({
                success: false,
                message: "Database connection error. Try again later."
            });
        }

        // =========================
        // 7. Generic Server Error
        // =========================
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



const markGoodReadShortStory = async (req, res) => {
    try {
        // =========================
        // 1. Validate Auth User
        // =========================
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found in request"
            });
        }

        const userId = req.user._id;

        // =========================
        // 2. Validate storyId
        // =========================
        const { storyId } = req.params;

        if (!storyId) {
            return res.status(400).json({
                success: false,
                message: "storyId is required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(storyId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid storyId format"
            });
        }

        // =========================
        // 3. Ensure Story Exists & Published
        // =========================
        const exists = await ShortStory
            .findById(storyId)
            .select("status totalGoodReads")
            .lean();

        if (!exists || exists.status !== "published") {
            return res.status(404).json({
                success: false,
                message: "Story not found"
            });
        }

        // =========================
        // 4. Toggle OFF (Remove GoodRead)
        // =========================
        const removed = await goodReadShortStory.findOneAndDelete({
            reader: userId,
            story: storyId
        });

        if (removed) {
            const story = await ShortStory.findByIdAndUpdate(
                storyId,
                {
                    $inc: { totalGoodReads: -1 },
                    $pull: { GoodReadsBy: userId }
                },
                { new: true }
            ).select("totalGoodReads");

            // Prevent negative count
            let total = story?.totalGoodReads ?? 0;
            if (total < 0) {
                await ShortStory.updateOne(
                    { _id: storyId },
                    { $set: { totalGoodReads: 0 } }
                );
                total = 0;
            }

            return res.status(200).json({
                success: true,
                message: "Removed from Good Read",
                goodRead: false,
                totalGoodReads: total
            });
        }

        // =========================
        // 5. Toggle ON (Add GoodRead)
        // =========================
        try {
            await goodReadShortStory.create({
                reader: userId,
                story: storyId
            });
        } catch (createErr) {
            // Handle duplicate key (race condition safety)
            if (createErr.code !== 11000) {
                throw createErr;
            }
        }

        const story = await ShortStory.findByIdAndUpdate(
            storyId,
            {
                $inc: { totalGoodReads: 1 },
                $addToSet: { GoodReadsBy: userId }
            },
            { new: true }
        ).select("totalGoodReads");

        return res.status(200).json({
            success: true,
            message: "Marked as Good Read",
            goodRead: true,
            totalGoodReads: story?.totalGoodReads ?? 1
        });

    } catch (error) {
        console.error("Mark GoodRead ShortStory Error:", error);

        // =========================
        // 6. Mongo Cast Error
        // =========================
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format"
            });
        }

        // =========================
        // 7. Mongo Network Error
        // =========================
        if (error.name === "MongoNetworkError") {
            return res.status(503).json({
                success: false,
                message: "Database connection error. Try again later."
            });
        }

        // =========================
        // 8. Generic Error
        // =========================
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


const getTopGoodReads = async (req, res) => {
    try {
        // =========================
        // 1. Aggregation Pipeline
        // =========================
        const goodreads = await goodReadShortStory.aggregate([
            {
                $group: {
                    _id: "$story",
                    totalGoodReads: { $sum: 1 }
                }
            },

            { $sort: { totalGoodReads: -1 } },
            { $limit: 5 },

            // ================= STORY LOOKUP =================
            {
                $lookup: {
                    from: "shortstories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "story"
                }
            },
            { $unwind: "$story" },

            // only published stories
            {
                $match: {
                    "story.status": "published"
                }
            },

            // ================= AUTHOR LOOKUP =================
            {
                $lookup: {
                    from: "users",
                    localField: "story.author",
                    foreignField: "_id",
                    as: "author"
                }
            },
            { $unwind: "$author" },

            // ================= FINAL SHAPE =================
            {
                $project: {
                    _id: 0,
                    totalGoodReads: 1,
                    story: {
                        _id: "$story._id",
                        title: "$story.title",
                        description: "$story.description",
                        coverImage: "$story.coverImage",
                        category: "$story.category",
                        createdAt: "$story.createdAt",
                        totalGoodReads: "$story.totalGoodReads",
                        author: {
                            _id: "$author._id",
                            username: "$author.username",
                            profilePic: "$author.profilePic"
                        }
                    }
                }
            }
        ]);

        // =========================
        // 2. Handle Empty Result
        // =========================
        if (!goodreads || goodreads.length === 0) {
            return res.status(200).json({
                success: true,
                count: 0,
                goodreads: []
            });
        }

        // =========================
        // 3. Success Response
        // =========================
        return res.status(200).json({
            success: true,
            count: goodreads.length,
            goodreads
        });

    } catch (error) {
        console.error("Get Top GoodReads Error:", error);

        // =========================
        // 4. Mongo Aggregation / Cast Error
        // =========================
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid aggregation format"
            });
        }

        // =========================
        // 5. Mongo Network Error
        // =========================
        if (error.name === "MongoNetworkError") {
            return res.status(503).json({
                success: false,
                message: "Database connection error. Try again later."
            });
        }

        // =========================
        // 6. Generic Server Error
        // =========================
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



export { createShortStory, listShortStory, openShortStory, updateShortStory, deleteShortStory, listUserShortStory, openUserShortStory, userAnswer, likeShortStory, listTrendingShortStory, markGoodReadShortStory, listGoodReads, getTopGoodReads }; 