import express from "express";
import verifyToken from "../middlewares/VerifyToken.middleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  getLoggedInUser,
  googleAuth,
} from "../controllers/Authentication.controller.js";
import { registerValidator, loginValidator } from "../validator/auth.validator.js";
import { verifyEmail } from "../controllers/verifyEmail.controller.js";

const router = express.Router();

router.post("/register", registerValidator, registerUser);
router.post("/login", loginValidator, loginUser);
router.post("/google", googleAuth);          // ✅ THIS WAS MISSING
router.get("/logout", verifyToken, logoutUser);
router.get("/me", verifyToken, getLoggedInUser);
router.get("/verify-email", verifyEmail);

export default router;
