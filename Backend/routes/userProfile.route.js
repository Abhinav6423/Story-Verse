import express from "express"
const router = express.Router()
import { getUserProfileData, getUserShortStories, updateProfile } from "../controllers/profile.controller.js"
import verifyToken from "../middlewares/VerifyToken.middleware.js"
import upload from "../middlewares/multer.js"

router.get("/userProfile", verifyToken, getUserProfileData)
router.get("/userShortStories", verifyToken, getUserShortStories)
router.put(
    "/updateProfile",
    verifyToken,
    upload.single("profilePic"), // 🔥 IMPORTANT
    updateProfile
);


export default router
