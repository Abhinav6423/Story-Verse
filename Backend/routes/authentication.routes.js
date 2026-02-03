import express from "express";
import verifyToken from "../middlewares/VerifyToken.middleware.js";
import verifyFirebaseToken from "../middlewares/verifyFirebaseToken.js";
import {
  firebaseLogin,
  // logoutUser,
  getLoggedInUser,
} from "../controllers/Authentication.controller.js";

const router = express.Router();

/* ================= FIREBASE AUTH ================= */
router.post("/firebase-login", firebaseLogin);

/* ================= AUTH UTILS ================= */
router.get("/me", verifyFirebaseToken, getLoggedInUser);
// router.get("/logout", verifyToken, logoutUser);

export default router;
