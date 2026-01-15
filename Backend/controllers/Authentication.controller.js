import User from "../modals/User.modal.js";
import Userstats from "../modals/Userstats.modal.js";
import admin from "../config/firebaseAdmin.js";

/* ================= COOKIE UTILS ================= */
// const setTokenInCookie = (res, token) => {
//   const isProd = process.env.NODE_ENV === "production";

//   res.cookie("token", token, {
//     httpOnly: true,
//     secure: isProd,
//     sameSite: isProd ? "none" : "lax",
//     path: "/",
//     domain: isProd ? ".onrender.com" : undefined, // 👈 IMPORTANT
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//   });
// };




/* ================= FIREBASE LOGIN (MAIN) ================= */
export const firebaseLogin = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false });
    }

    const firebaseToken = authHeader.split(" ")[1];

    const decoded = await admin.auth().verifyIdToken(firebaseToken);
    console.log("✅ Firebase token verified:", decoded.email);

    let user = await User.findOne({ firebaseUid: decoded.uid });

    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        email: decoded.email,
        username: decoded.email.split("@")[0],
      });

      await Userstats.create({
        userId: user._id,
        username: user.username,
      });
    }

    // const token = user.generateToken();

    // setTokenInCookie(res, token);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("🔥 firebaseLogin error:", err);
    return res.status(401).json({ success: false });
  }
};



/* ================= LOGOUT ================= */
// export const logoutUser = async (req, res) => {
//   res.clearCookie("token", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//     path: "/",
//   });

//   return res.status(200).json({
//     success: true,
//     message: "Logged out successfully",
//   });
// };

/* ================= CURRENT USER ================= */
export const getLoggedInUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
