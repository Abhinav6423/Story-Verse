import User from "../modals/User.modal.js";
import verifyToken from "../middlewares/VerifyToken.middleware.js";
import { registerUser, loginUser, logoutUser, getLoggedInUser } from "../controllers/Authentication.controller.js";
import express from "express"
import { registerValidator , loginValidator } from "../validator/auth.validator.js";
const router = express.Router()

router.post("/register", registerValidator, registerUser)
router.post("/login", loginValidator, loginUser)
router.get("/logout", verifyToken, logoutUser)
router.get("/me", verifyToken, getLoggedInUser)


export default router;