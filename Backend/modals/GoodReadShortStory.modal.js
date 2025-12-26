import mongoose, { Schema } from "mongoose";

const goodShortStories = new Schema(
    {
        reader: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        story: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ShortStory",
            required: true
        }
    }, { timestamps: true }
)

goodShortStories.index({ reader: 1, story: 1 }, { unique: true })


const goodReadShortStory = mongoose.model("goodReadShortStory", goodShortStories)
export default goodReadShortStory