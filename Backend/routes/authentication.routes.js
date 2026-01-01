import express from "express";
import verifyToken from "../middlewares/VerifyToken.middleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  getLoggedInUser,
} from "../controllers/Authentication.controller.js";
import { registerValidator, loginValidator } from "../validator/auth.validator.js";

const router = express.Router();

/* ---------- LOCAL AUTH ---------- */
router.post("/register", registerValidator, registerUser);
router.post("/login", loginValidator, loginUser);




/* ---------- AUTH UTILS ---------- */
router.get("/me", verifyToken, getLoggedInUser);
router.get("/logout", verifyToken, logoutUser);

export default router;
