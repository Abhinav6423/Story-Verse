import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import path from "path";
import express from "express";
import mongoose from "mongoose";
// import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./DBconfig/dbConfig.js";

// ================== CONFIG ==================
mongoose.set("bufferCommands", false);

const app = express();
app.set("trust proxy", 1);

const PORT = process.env.PORT || 7000;

// ================== MIDDLEWARE ==================


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://preface.vercel.app",
    ],
  })
);






app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// ================== ROUTES ==================
import authRoutes from "./routes/authentication.routes.js";
import shortStoryRoutes from "./routes/ShortStory.route.js";
import userProfileRoutes from "./routes/userProfile.route.js";
import storeelRoutes from "./routes/stoReel.routes.js";

app.use("/api/storeel", storeelRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/story", shortStoryRoutes);
app.use("/api/profile", userProfileRoutes);




// ================== HEALTH CHECK ==================
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is alive",
    timestamp: new Date().toISOString(),
  });
});

// app.use(express.static("dist"));

// app.get("*", (req, res, next) => {
//   if (req.path.startsWith("/api")) {
//     return next(); // let API 404 normally
//   }
//   res.sendFile(path.resolve("dist", "index.html"));
// });

// ================== ERROR HANDLER ==================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Server error",
  });
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


