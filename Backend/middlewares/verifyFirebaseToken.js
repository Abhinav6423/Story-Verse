import admin from "../config/firebaseAdmin.js";
import User from "../modals/User.modal.js";

const verifyFirebaseToken = async (req, res, next) => {
  try {
    // 1️⃣ Read Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    // 2️⃣ Extract Firebase ID token
    const firebaseToken = authHeader.split(" ")[1];

    // 3️⃣ Verify token with Firebase Admin
    const decoded = await admin.auth().verifyIdToken(firebaseToken);

    // 4️⃣ Find user in DB using firebaseUid
    const user = await User.findOne({ firebaseUid: decoded.uid });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // 5️⃣ Attach user to request
    req.user = user;

    // 6️⃣ Continue
    next();
  } catch (error) {
    console.error("verifyFirebaseToken error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default verifyFirebaseToken;
