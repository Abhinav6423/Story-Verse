import express from "express"
const router = express.Router()
import { getUserProfileData, getUserShortStories, updateProfile } from "../controllers/profile.controller.js"
import verifyToken from "../middlewares/VerifyToken.middleware.js"
import verifyFirebaseToken from "../middlewares/verifyFirebaseToken.js"
import upload from "../middlewares/multer.js"

router.get("/userProfile", verifyFirebaseToken, getUserProfileData)
router.get("/userShortStories", verifyFirebaseToken, getUserShortStories)
router.put(
    "/updateProfile",
    verifyFirebaseToken,
    upload.single("profilePic"), // 🔥 IMPORTANT
    updateProfile
);


export default router
