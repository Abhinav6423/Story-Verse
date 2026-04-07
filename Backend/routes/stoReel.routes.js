import { createStoReel, getAllStoReels, getMyStoReels , openStoreel } from "../controllers/stoReel.controller.js";
import express from "express";
import upload from "../middlewares/multer.js";
import verifyFirebaseToken from "../middlewares/verifyFirebaseToken.js";
const router = express.Router();

const createStoReellog = async (req, res) => {
    console.log("🔥 HIT createStoReel");
    // console.log("req.body:", req.body);
    // console.log("req.files:", req.files);
    // console.log("req.user:", req.user);
}

router.post("/post", verifyFirebaseToken,
    upload.fields([{ name: "reelCover", maxCount: 1 }]),
    // createStoReellog,
    createStoReel);


router.get("/all", verifyFirebaseToken, getAllStoReels);

router.get("/my", verifyFirebaseToken, getMyStoReels);

router.get("/open/:id", verifyFirebaseToken, openStoreel);

export default router;


