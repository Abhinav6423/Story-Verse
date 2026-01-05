import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";

import connectDB from "./DBconfig/dbConfig.js";

// ================== CONFIG ==================
mongoose.set("bufferCommands", false);

const app = express();
app.set("trust proxy", 1);

const PORT = process.env.PORT || 7000;

// ================== MIDDLEWARE ==================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ================== ROUTES ==================
import authRoutes from "./routes/authentication.routes.js";
import shortStoryRoutes from "./routes/ShortStory.route.js";
import userProfileRoutes from "./routes/userProfile.route.js";

app.use("/api/auth", authRoutes);
app.use("/api/story", shortStoryRoutes);
app.use("/api/profile", userProfileRoutes);

// ================== FRONTEND SERVING ==================
// NOTE: Server Backend folder se run hota hai,
// isliye ".." mandatory hai
const FRONTEND_DIST_PATH = path.resolve(
  process.cwd(),
  "..",
  "Frontend",
  "dist"
);

console.log("🚀 Serving frontend from:", FRONTEND_DIST_PATH);

// Serve static assets
app.use(express.static(FRONTEND_DIST_PATH));

// SPA fallback (Express v5 compatible)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(FRONTEND_DIST_PATH, "index.html"));
});

// ================== START SERVER ==================
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

// ================== ERROR HANDLER ==================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Server error",
  });
});
