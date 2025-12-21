import express from "express";
import verifyToken from "../middlewares/VerifyToken.middleware.js";

import {
   createShortStory,
   listShortStory,
   openShortStory,
   updateShortStory,
   deleteShortStory,
   listUserShortStory,
   openUserShortStory,
   userAnswer,
   likeShortStory,
   listTrendingShortStory,
} from "../controllers/ShorStory.controller.js";

const router = express.Router();

/* =========================
   CREATOR / AUTHOR ROUTES
   ========================= */

router.post("/", verifyToken, createShortStory);
router.get("/me", verifyToken, listUserShortStory);
router.get("/me/:storyId", verifyToken, openUserShortStory);
router.put("/:storyId", verifyToken, updateShortStory);
router.delete("/:storyId", verifyToken, deleteShortStory);

/* =========================
   PUBLIC / READER ROUTES
   ========================= */

// 🔥 FIXED ROUTE (must be BEFORE :storyId)
router.get("/trending", verifyToken, listTrendingShortStory);

// list all stories
router.get("/list", verifyToken, listShortStory);

// open a single story
router.get("/:storyId", verifyToken, openShortStory);

// submit answer
router.post("/:storyId/answer", verifyToken, userAnswer);

// like a story
router.put("/:storyId/like", verifyToken, likeShortStory);

export default router;
