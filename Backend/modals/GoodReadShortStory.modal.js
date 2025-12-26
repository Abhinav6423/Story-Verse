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

const goodReadShortStory = mongoose.model("goodReadShortStory", goodShortStories)
export default goodReadShortStory