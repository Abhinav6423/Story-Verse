import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
// import axios from "axios";            // ❌ not needed for header auth
// import api from "../api/api";          // ❌ not needed for login in header auth

export const loginUser = async (email, password) => {
    try {
        // 1️⃣ Firebase login (PRIMARY AUTH)
        const { user } = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        // 2️⃣ Email verification check
        if (!user.emailVerified) {
            throw new Error("Please verify your email first");
        }

        /*
        ======================================================
        🧁 COOKIE-BASED AUTH (FOR FUTURE USE)
        ------------------------------------------------------
        // 3️⃣ Get Firebase ID token
        const firebaseToken = await user.getIdToken();
    
        // 4️⃣ Send token to backend → backend sets HTTP-only cookie
        const res = await api.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/firebase-login`,
          {},
          {
            headers: {
              Authorization: `Bearer ${firebaseToken}`,
            },
            withCredentials: true,
          }
        );
        ======================================================
        */

        // 🔐 HEADER-BASED AUTH (CURRENT SETUP)
        // Firebase automatically manages auth state.
        // Axios interceptor will attach the token to every request.

        return {
            success: true,
            message: "User logged in successfully",
            user,
        };
    } catch (error) {
        return {
            success: false,
            message: error.message || "Login failed",
        };
    }
};
