import express from "express"
import mongoose, { Schema } from "mongoose";

const Userhistorymodel = new Schema(
    {
        reader: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        contentType: {
            type: String,
            enum: ["shortStory", "Chapter"],
            required: true
        },
        contentId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    }
)

const Userhistory = mongoose.model("Userhistory", Userhistorymodel)
export default Userhistory