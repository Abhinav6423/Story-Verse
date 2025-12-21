import mongoose, { Schema } from "mongoose";

const shortStorySchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        story: {
            type: String,
            required: true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        coverImage: {
            type: String,
            required: true
        },
        finalQuestion: {
            type: String,
            required: true
        },
        finalAnswer: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["published", "draft"],
            required: true
        },
        likes: {
            type: Number,
            default: 0
        },
        likedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        category: {
            type: String,
            required: true
        }
    }, { timestamps: true }
)

export default mongoose.model("ShortStory", shortStorySchema)