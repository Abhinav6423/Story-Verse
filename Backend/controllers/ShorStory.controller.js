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
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        await ShortStory.findByIdAndDelete(storyId);

        if (shortStory.status === "published") {
            const stats = await Userstats.findOneAndUpdate(
                { userId: req.user._id },
                { $inc: { xp: -30 } },
                { new: true }
            )


            // prevent negative xp 

            if (stats && stats.xp < 0) {
                await Userstats.findOneAndUpdate(
                    { userId: req.user._id },
                    { $set: { xp: 0 } },
                    { new: true }
                )
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
                message: "Invalid storyId",
            });
        }

        // Find story first
        const story = await ShortStory.findById(storyId);

        if (!story) {
            return res.status(404).json({
                success: false,
                message: "Story not found",
            });
        }

        const alreadyLiked = story.likedBy.includes(userId);

        // If already liked → just return current state (NO ERROR)
        if (alreadyLiked) {
            return res.status(200).json({
                success: true,
                message: "Story already liked",
                likes: story.likes,
                isLiked: true,
            });
        }

        // Like the story
        story.likedBy.push(userId);
        story.likes += 1;
        await story.save();

        return res.status(200).json({
            success: true,
            message: "Story liked successfully",
            likes: story.likes,
            isLiked: true,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


const listTrendingShortStory = async (req, res) => {
    try {
        let { page = 1, limit = 1 } = req.query;

        page = parseInt(page, 10);
        limit = parseInt(limit, 10);

        if (page < 1) page = 1;
        if (limit < 1 || limit > 50) limit = 1;

        const skip = (page - 1) * limit;

        // ✅ TOTAL documents count (CRITICAL)
        const totalCount = await ShortStory.countDocuments({
            status: "published",
        });

        const shortStories = await ShortStory.find({
            status: "published",
        })
            .sort({
                likes: -1,
                createdAt: -1,
                _id: -1
            }) // 🔥 trending
            .skip(skip)
            .limit(limit)
            .populate("author", "username profilePic")
            .lean();

        return res.status(200).json({
            success: true,
            page,
            limit,
            totalCount,     // ✅ correct
            shortStories,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const markGoodReadShortStory = async (req, res) => {
    try {
        const { storyId } = req.params

        if (!storyId) {
            return res.status(400).json({
                success: false,
                message: "storyId is required"
            })
        }

        const story = await ShortStory.findById(storyId)
        if (!story) {
            return res.status(404).json({
                success: false,
                message: "Short story not found"
            })
        }

        await goodReadShortStory.create({
            reader: req.user._id,
            story: storyId
        })

        return res.status(200).json({
            success: true,
            message: "Short story marked as good read",
            goodRead: true
        })

    } catch (error) {
        // 👇 Duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Short story already marked as good read",
                goodRead: true
            })
        }

        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}







export { createShortStory, listShortStory, openShortStory, updateShortStory, deleteShortStory, listUserShortStory, openUserShortStory, userAnswer, likeShortStory, listTrendingShortStory, markGoodReadShortStory } 