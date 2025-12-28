import ShortStory from "../modals/Shortstory.modal.js"
import Userstats from "../modals/Userstats.modal.js";
import Userhistory from "../modals/Userhistory.modal.js";
import goodReadShortStory from "../modals/GoodReadShortStory.modal.js";
import mongoose from "mongoose"
// creator panel
const createShortStory = async (req, res) => {
    try {
        const {
            title,
            story,
            description,
            coverImage,
            finalQuestion,
            category,
            status,
            finalAnswer
        } = req.body;

        if (!title || !story || !description || !coverImage || !finalQuestion || !category || !finalAnswer) {
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

        const shortStory = await ShortStory.create({
            title,
            story,
            description,
            coverImage,
            finalQuestion,
            category,
            author: req.user._id,
            status: status || "draft",
            finalAnswer: finalAnswer
        });

        await Userstats.updateOne(
            { userId: req.user._id },

            { $inc: { totalShortStoriesCreated: 1 } }
        )

        if (shortStory.status === "published") {

            const stats = await Userstats.findOneAndUpdate(
                { userId: req.user._id },
                { $inc: { xp: 30 } },
                { new: true }

            )

            if (stats.xp >= stats.xpToNextLevel) {
                await Userstats.findOneAndUpdate(
                    { userId: req.user._id },
                    {
                        $inc: { level: 1 },
                        $set: {
                            xp: stats.xp - stats.xpToNextLevel,
                            xpToNextLevel: stats.xpToNextLevel * 2
                        }
                    }

                )
            }
        }



        return res.status(201).json({
            success: true,
            message: "Short story created successfully",
            shortStory
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const listUserShortStory = async (req, res) => {
    try {
        const userId = req.user._id;
        const { status, title, category } = req.query;

        const filter = { author: userId };

        if (status) {
            filter.status = status;
        }

        title && (filter.title = { $regex: title, $options: "i" }); // 👈 case-insensitive
        category && (filter.category = category)

        const shortStory = await ShortStory
            .find(filter)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            shortStory
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const openUserShortStory = async (req, res) => {
    try {
        const { storyId } = req.params;
        const userId = req.user._id;

        if (!storyId) {
            return res.status(400).json({
                success: false,
                message: "storyId is required"
            })
        }

        const shortStoryExists = await ShortStory.findById(storyId)
        if (!shortStoryExists) {
            return res.status(404).json({
                success: false,
                message: "Short story not found"
            })
        }

        if (shortStoryExists.author.toString() !== userId.toString()) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }

        return res.status(200).json({
            success: true,
            ShortStory: shortStoryExists
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateShortStory = async (req, res) => {
    try {
        const { storyId } = req.params;
        const { title, story, description, coverImage, finalQuestion, category, status } = req.body;

        if (!storyId) {
            return res.status(400).json({
                success: false,
                message: "storyId is required"
            });
        }

        const shortStory = await ShortStory.findById(storyId);

        if (!shortStory) {
            return res.status(404).json({
                success: false,
                message: "Short story not found"
            });
        }

        if (shortStory.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        if (status && !["draft", "published"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        // ✅ update only provided fields
        if (title !== undefined) shortStory.title = title;
        if (story !== undefined) shortStory.story = story;
        if (description !== undefined) shortStory.description = description;
        if (coverImage !== undefined) shortStory.coverImage = coverImage;
        if (finalQuestion !== undefined) shortStory.finalQuestion = finalQuestion;
        if (category !== undefined) shortStory.category = category;
        if (status !== undefined) shortStory.status = status;

        // ✅ check if anything changed
        if (!shortStory.isModified()) {
            return res.status(400).json({
                success: false,
                message: "No changes provided"
            });
        }

        await shortStory.save();

        return res.status(200).json({
            success: true,
            message: "Short story updated successfully",
            shortStory
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const deleteShortStory = async (req, res) => {
    try {
        const { storyId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(storyId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid storyId"
            });
        }

        const shortStory = await ShortStory.findById(storyId);

        if (!shortStory) {
            return res.status(404).json({
                success: false,
                message: "Short story not found"
            });
        }

        if (shortStory.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // 🧹 CLEANUP RELATED DATA FIRST
        await Promise.all([   // to perform multiple async operations in parallel and wait for all to finish before moving on
            goodReadShortStory.deleteMany({ story: storyId }),

        ]);

        // ❌ DELETE STORY
        await ShortStory.findByIdAndDelete(storyId);

        // 🎯 XP UPDATE (only if published)
        if (shortStory.status === "published") {
            const stats = await Userstats.findOneAndUpdate(
                { userId: req.user._id },
                { $inc: { xp: -30 } },
                { new: true }
            );

            // prevent negative xp
            if (stats && stats.xp < 0) {
                await Userstats.findOneAndUpdate(
                    { userId: req.user._id },
                    { $set: { xp: 0 } }
                );
            }
        }

        return res.status(200).json({
            success: true,
            message: "Short story deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



// Home Feed 
const listShortStory = async (req, res) => {
    try {
        const { category, title } = req.query;
        const userId = req.user._id;

        const filter = {
            status: "published",
        };

        if (category) {
            filter.category = category;
        }

        if (title) {
            filter.title = { $regex: title, $options: "i" };
        }

        const stories = await ShortStory.find(filter)
            .populate("author", "username profilePic")
            .sort({ createdAt: -1 })
            .lean(); // 👈 IMPORTANT

        const formattedStories = stories.map((story) => ({
            ...story,
            isLiked: story.likedBy?.some(
                (id) => id.toString() === userId.toString()
            ),
            isGoodRead: story.GoodReadsBy?.some((id) => id.toString() === userId.toString())
        }));

        return res.status(200).json({
            success: true,
            shortStory: formattedStories,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



const openShortStory = async (req, res) => {
    try {
        const { storyId } = req.params

        if (!storyId) {
            return res.status(400).json({
                success: false,
                message: "storyId is required"
            })
        }

        const userId = req.user._id

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized"
            })
        }

        const shortStory = await ShortStory.findById(storyId).populate("author", "username profilePic")

        if (!shortStory || shortStory.status !== "published") {
            return res.status(404).json({
                success: false,
                message: "Short story not found"
            })
        }

        const isLiked = shortStory.likedBy?.some(
            id => id.toString() === userId.toString()
        );

        const addedToGoodReads = await goodReadShortStory.findOne({
            reader: userId,
            story: storyId
        })

        const isGoodRead = addedToGoodReads ? true : false


        return res.status(200).json({
            success: true,
            ShortStory: {
                ...shortStory._doc,
                isLiked,
                isGoodRead
            }
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const userAnswer = async (req, res) => {
    try {
        const { storyId } = req.params;
        const { answer } = req.body;
        const userId = req.user._id;

        if (!storyId || !answer) {
            return res.status(400).json({
                success: false,
                message: "storyId and answer are required"
            });
        }

        const shortStory = await ShortStory.findById(storyId);

        if (!shortStory || shortStory.status !== "published") {
            return res.status(404).json({
                success: false,
                message: "Short story not found"
            });
        }

        // Normalize answers
        const correctAnswer = shortStory.finalAnswer.trim().toLowerCase();
        const userAnswer = answer.trim().toLowerCase();

        if (correctAnswer !== userAnswer) {
            return res.status(403).json({
                success: false,
                message: "Wrong answer"
            });
        }

        // Prevent XP farming
        const alreadyAnswered = await Userhistory.findOne({
            userId,
            storyId
        });

        if (alreadyAnswered) {
            return res.status(400).json({
                success: false,
                message: "You already completed this story"
            });
        }

        // Record completion
        await Userhistory.create({
            reader: userId,
            contentId: storyId,
            contentType: "shortStory"
        });

        await Userstats.findOneAndUpdate(
            { userId },
            {
                $inc: {
                    xp: 20,
                    totalShortStoriesRead: 1
                }
            }
        );

        return res.status(200).json({
            success: true,
            message: "Correct answer! XP awarded 🎉"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const likeShortStory = async (req, res) => {
    try {
        const { storyId } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(storyId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid storyId"
            });
        }

        // Try UNLIKE first (toggle OFF)
        const unliked = await ShortStory.findOneAndUpdate(
            {
                _id: storyId,
                likedBy: userId
            },
            {
                $pull: { likedBy: userId },
                $inc: { likes: -1 },

            },
            { new: true }
        );

        // If UNLIKE happened
        if (unliked) {
            return res.status(200).json({
                success: true,
                message: "Story unliked",
                likes: unliked.likes,
                isLiked: false
            });
        }

        // Else → LIKE
        const liked = await ShortStory.findOneAndUpdate(
            { _id: storyId },
            {
                $addToSet: { likedBy: userId },
                $inc: { likes: 1 }
            },
            { new: true }
        );

        if (!liked) {
            return res.status(404).json({
                success: false,
                message: "Story not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Story liked",
            likes: liked.likes,
            isLiked: true
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



const listTrendingShortStory = async (req, res) => {
    try {
        const userId = req.user?._id;

        const TOTAL_TRENDING = 10;

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

        const storiesWithActions = shortStories.map((story) => ({
            ...story,
            isLiked: userId ? story.likedBy?.includes(userId) : false,
            isGoodRead: userId ? story.GoodReadsBy?.includes(userId) : false,
        }));

        return res.status(200).json({
            success: true,
            totalCount: storiesWithActions.length, // always <= 10
            shortStories: storiesWithActions,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


const listGoodReads = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get good-read relations for this user
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

        // Convert relations → stories
        const stories = goodReads
            .filter(gr => gr.story) // safety if story was deleted
            .map(gr => {
                const story = gr.story;
                return {
                    ...story,
                    isLiked: story.likedBy?.includes(userId),
                    isGoodRead: true
                };
            });

        return res.status(200).json({
            success: true,
            count: stories.length,
            shortStories: stories
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



const markGoodReadShortStory = async (req, res) => {
    try {
        const { storyId } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(storyId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid storyId"
            });
        }

        // Toggle OFF
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
            );

            return res.status(200).json({
                success: true,
                message: "Removed from Good Read",
                goodRead: false,
                totalGoodReads: story.totalGoodReads
            });
        }

        // Toggle ON
        await goodReadShortStory.create({
            reader: userId,
            story: storyId
        });

        const story = await ShortStory.findByIdAndUpdate(
            storyId,
            {
                $inc: { totalGoodReads: 1 },
                $addToSet: { GoodReadsBy: userId } // 👈 IMPORTANT
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Marked as Good Read",
            goodRead: true,
            totalGoodReads: story.totalGoodReads
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getTopGoodReads = async (req, res) => {
    try {
        const goodreads = await goodReadShortStory.aggregate([
            {
                $group: {
                    _id: "$story",
                    totalGoodReads: { $sum: 1 }
                }
            },
            { $sort: { totalGoodReads: -1, createdAt: -1 } },
            { $limit: 3 },

            {
                $lookup: {
                    from: "shortstories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "story"
                }
            },
            { $unwind: "$story" },

            {
                $lookup: {
                    from: "users",
                    localField: "story.author",
                    foreignField: "_id",
                    as: "author"
                }
            },
            { $unwind: "$author" },

            {
                $project: {
                    totalGoodReads: 1,
                    story: {
                        _id: "$story._id",
                        title: "$story.title",
                        description: "$story.description",
                        coverImage: "$story.coverImage",
                        category: "$story.category",
                        createdAt: "$story.createdAt",
                        author: {
                            _id: "$author._id",
                            username: "$author.username",
                            profilePic: "$author.profilePic"
                        },
                        totalGoodReads: "$story.totalGoodReads",

                    }
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            goodreads
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};







export { createShortStory, listShortStory, openShortStory, updateShortStory, deleteShortStory, listUserShortStory, openUserShortStory, userAnswer, likeShortStory, listTrendingShortStory, markGoodReadShortStory, listGoodReads, getTopGoodReads }; 