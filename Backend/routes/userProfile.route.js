import express from "express"
const router = express.Router()
import { getUserProfileData, getUserShortStories, updateProfile } from "../controllers/profile.controller.js"
import verifyToken from "../middlewares/VerifyToken.middleware.js"

router.get("/userProfile", verifyToken, getUserProfileData)
router.get("/userShortStories", verifyToken, getUserShortStories)
router.put("/updateProfile", verifyToken, updateProfile)

export default router
