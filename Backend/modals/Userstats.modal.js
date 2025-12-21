import mongoose, { Schema } from "mongoose";

const UserstatsSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        username: {
            type: String,
            required: true
        },
        xp: {
            type: Number,
            default: 0
        },
        xpToNextLevel: {
            type: Number,
            default: 100
        },
        level: {
            type: Number,
            default: 1
        },
        totalShortStoriesCreated: {
            type: Number,
            default: 0
        },
        totalShortStoriesRead: {
            type: Number,
            default: 0
        },
        totalChaptersCreated: {
            type: Number,
            default: 0
        },
        totalChaptersRead: {
            type: Number,
            default: 0
        }
    }, { timestamps: true }
)

const Userstats = mongoose.model("Userstats", UserstatsSchema)
export default Userstats