import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";

import connectDB from "./DBconfig/dbConfig.js";

// Load env variables
dotenv.config({ path: "./.env" });

// Disable mongoose buffering (prevents 10s hangs)
mongoose.set("bufferCommands", false);

const app = express();
const PORT = process.env.PORT || 5000;

// ================== MIDDLEWARES ==================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ================== CORS ==================
const allowedOrigins = [
    "http://localhost:5173",
    "https://story-verse-lac.vercel.app"
];

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow non-browser requests (Postman, curl)
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            // ❗ Do NOT throw error
            return callback(null, false);
        },
        credentials: true
    })
);

// ================== ROUTES ==================
import authenticationRoutes from "./routes/authentication.routes.js";
import shortStoryRoutes from "./routes/ShortStory.route.js";
import userProfileRoutes from "./routes/userProfile.route.js";

app.use("/api/auth", authenticationRoutes);
app.use("/api/story", shortStoryRoutes);
app.use("/api/profile", userProfileRoutes);

// ================== HEALTH CHECK ==================
app.get("/", (req, res) => {
    res.send("Server is up and running ✅");
});

// ================== START SERVER ==================
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
