import express from "express"
const router = express.Router()
import { getUserProfileData, getUserShortStories } from "../controllers/profile.controller.js"
import verifyToken from "../middlewares/VerifyToken.middleware.js"

router.get("/userProfile", verifyToken, getUserProfileData)
router.get("/userShortStories", verifyToken, getUserShortStories)

export default router
