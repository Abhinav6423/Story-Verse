import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signOut
} from "firebase/auth";
import { auth } from "../firebase.js";

export const signupUser = async (email, password) => {
    try {
        const userCred = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        await sendEmailVerification(userCred.user);

        // 🔐 force verification before login
        await signOut(auth);

        return {
            success: true,
            message: "Verification email sent. Please check your inbox."
        };
    } catch (error) {
        return {
            success: false,
            message: error.message || "Signup failed"
        };
    }
};
