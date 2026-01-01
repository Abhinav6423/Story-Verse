import express from "express";
import passport from "passport";
import verifyToken from "../middlewares/VerifyToken.middleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  getLoggedInUser,
  googleCallback,
} from "../controllers/Authentication.controller.js";
import { registerValidator, loginValidator } from "../validator/auth.validator.js";
import { verifyEmail } from "../controllers/verifyEmail.controller.js";

const router = express.Router();

/* ---------- LOCAL AUTH ---------- */
router.post("/register", registerValidator, registerUser);
router.post("/login", loginValidator, loginUser);

/* ---------- GOOGLE AUTH (PASSPORT) ---------- */
// Step 1: Redirect user to Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["openid", "profile", "email"],
    session: false,
  })
);


// Step 2: Google redirects back here
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/`,
  }),
  googleCallback
);


/* ---------- AUTH UTILS ---------- */
router.get("/me", verifyToken, getLoggedInUser);
router.get("/logout", verifyToken, logoutUser);
router.get("/verify-email", verifyEmail);

export default router;
