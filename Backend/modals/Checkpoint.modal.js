import express, { Schema } from "mongoose"

const CheckPointSchema = new Schema(
    {
        contentType: {
            type: String,
            enum: ["ShortStory", "Chapter"],
            required: true
        },
        contentId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        question: {
            type: String,
            required: true
        },
        solution: {
            type: String,
            required: true
        }
    }
)

const CheckPoint = mongoose.model("CheckPoint", CheckPointSchema)
export default CheckPoint

