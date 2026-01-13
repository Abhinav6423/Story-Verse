import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";

export const loginUser = async (email, password) => {
    try {
        // 1️⃣ Firebase login
        const { user } = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        // 2️⃣ Email verification check
        if (!user.emailVerified) {
            throw new Error("Please verify your email first");
        }

        // 3️⃣ Get Firebase ID token
        const firebaseToken = await user.getIdToken();

        // 4️⃣ Send token to backend → backend sets COOKIE
        const res = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL
            }/api/auth/firebase-login`,   // 👈 IMPORTANT
            {},
            {
                headers: {
                    Authorization: `Bearer ${firebaseToken}`
                },
                withCredentials: true        // 👈 MOST IMPORTANT
            }
        );

        return {
            success: true,
            message: "User logged in successfully",
            data: res.data
        };

    } catch (error) {
        return {
            success: false,
            message: error.message || "Login failed"
        };
    }
};
