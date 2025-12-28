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
   markGoodReadShortStory,
   listGoodReads,
   getTopGoodReads
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

router.get("/goodReads", verifyToken, listGoodReads);

/* =========================
   PUBLIC / READER ROUTES
   ========================= */

// 🔥 STATIC ROUTES FIRST
router.get("/trending", verifyToken, listTrendingShortStory);
router.get("/list", verifyToken, listShortStory);
router.get("/topGoodReads", verifyToken, getTopGoodReads);

// 🔥 DYNAMIC ROUTES LAST
router.get("/:storyId", verifyToken, openShortStory);
router.post("/:storyId/answer", verifyToken, userAnswer);
router.put("/:storyId/like", verifyToken, likeShortStory);
router.put("/:storyId/goodRead", verifyToken, markGoodReadShortStory);

export default router;
