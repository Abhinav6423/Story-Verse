import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import connectDB from "./DBconfig/dbConfig.js";

// ================== CONFIG ==================
mongoose.set("bufferCommands", false);

const app = express();
const PORT = process.env.PORT || 7000;

// ================== MIDDLEWARE ==================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // 🔥 REQUIRED

app.use(
    cors({
        origin: "http://localhost:5173", // 👈 FRONTEND URL
        credentials: true,               // 👈 COOKIE SUPPORT
    })
);

// ================== ROUTES ==================
import authRoutes from "./routes/authentication.routes.js";
import shortStoryRoutes from "./routes/ShortStory.route.js";
import userProfileRoutes from "./routes/userProfile.route.js";

app.use("/api/auth", authRoutes);
app.use("/api/story", shortStoryRoutes);
app.use("/api/profile", userProfileRoutes);

// ================== HEALTH ==================
app.get("/", (req, res) => {
    res.send("Server running ✅");
});

// ================== START ==================
const startServer = async () => {
    try {
        await connectDB();
        console.log("✅ MongoDB connected");

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("❌ Server error", err);
    }
};

startServer();
