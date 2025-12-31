import dotenv from "dotenv";
dotenv.config({ path: "./.env" }); // ✅ MUST BE FIRST

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";

import connectDB from "./DBconfig/dbConfig.js";
import "./config/Passport.js"; // env now available

// Disable mongoose buffering
mongoose.set("bufferCommands", false);

const app = express();
const PORT = process.env.PORT || 5000;

// Required for cookies behind proxy (Railway / Vercel)
app.set("trust proxy", 1);

// ================== MIDDLEWARE ==================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ================== CORS ==================
app.use(cors({ credentials: true }));


// ================== PASSPORT ==================
app.use(passport.initialize());

// ================== ROUTES ==================
import authenticationRoutes from "./routes/authentication.routes.js";
import shortStoryRoutes from "./routes/ShortStory.route.js";
import userProfileRoutes from "./routes/userProfile.route.js";

app.use("/api/auth", authenticationRoutes);
app.use("/api/story", shortStoryRoutes);
app.use("/api/profile", userProfileRoutes);

// ================== HEALTH ==================
app.get("/", (req, res) => {
    res.send("Server is up and running ✅");
});

// ================== START ==================
const startServer = async () => {
    try {
        await connectDB();
        console.log("✅ MongoDB connected");

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server", error);
        process.exit(1);
    }
};

startServer();
