import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import api from "../api/api"; // 👈 axios instance with interceptor

export const loginUser = async (email, password) => {
    try {
        // 1️⃣ Firebase login
        const { user } = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        // 2️⃣ Email verification
        if (!user.emailVerified) {
            throw new Error("Please verify your email first");
        }

        // 🔥 3️⃣ BACKEND LOGIN ROUTE — YAHIN CALL HOGA
        // token automatically interceptor se lagega
        await api.post("/api/auth/firebase-login");

        // 4️⃣ success
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
