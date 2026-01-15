import express from "express";
import verifyToken from "../middlewares/VerifyToken.middleware.js";
import verifyFirebaseToken from "../middlewares/verifyFirebaseToken.js";
import upload from "../middlewares/multer.js";
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
   getTopGoodReads,
} from "../controllers/ShorStory.controller.js";

const router = express.Router();

/* =========================
   CREATOR / AUTHOR ROUTES
   ========================= */

router.post("/", verifyFirebaseToken,
   upload.single("coverImage"),
   createShortStory);

router.get("/me", verifyFirebaseToken, listUserShortStory);
router.get("/me/:storyId", verifyFirebaseToken, openUserShortStory);

router.put("/:storyId",
   upload.single("coverImage"),
   verifyFirebaseToken, updateShortStory);
router.delete("/:storyId", verifyFirebaseToken, deleteShortStory);

router.get("/goodReads", verifyFirebaseToken, listGoodReads);

/* =========================
   PUBLIC / READER ROUTES
   ========================= */

// 🔥 STATIC ROUTES FIRST
router.get("/trending", verifyFirebaseToken, listTrendingShortStory);
router.get("/list", verifyFirebaseToken, listShortStory);
router.get("/topGoodReads", verifyFirebaseToken, getTopGoodReads);

// 🔥 DYNAMIC ROUTES LAST
router.get("/:storyId", verifyFirebaseToken, openShortStory);
router.post("/:storyId/answer", verifyFirebaseToken, userAnswer);
router.put("/:storyId/like", verifyFirebaseToken, likeShortStory);
router.put("/:storyId/goodRead", verifyFirebaseToken, markGoodReadShortStory);

export default router;
