import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import connectDB from "../DBconfig/dbConfig.js";

mongoose.set("bufferCommands", false);

const app = express();

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://preface.vercel.app",
        ],
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import authRoutes from "../routes/authentication.routes.js";
import shortStoryRoutes from "../routes/ShortStory.route.js";
import userProfileRoutes from "../routes/userProfile.route.js";

app.use("/api/auth", authRoutes);
app.use("/api/story", shortStoryRoutes);
app.use("/api/profile", userProfileRoutes);

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Server is alive 🚀",
    });
});

// ✅ Better DB caching
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null };
}

const connectOnce = async () => {
    if (cached.conn) return;
    cached.conn = await connectDB();
};

export default async function handler(req, res) {
    await connectOnce();
    return app(req, res);
}