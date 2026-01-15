// import axios from "axios";

// export const logoutUser = async () => {
//     try {
//         const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL
//             }/api/auth/logout`, { withCredentials: true })
//         return {
//             success: true,
//             message: "User logged out successfully",
//             data: res?.data
//         }
//     } catch (error) {
//         return {
//             success: false,
//             message: error?.response?.data
//         }
//     }
// }

// Api-calls/logout.js
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
// import api from "../api/api"; // 👈 keep commented for future cookie auth

export const logoutUser = async () => {
  // 🔐 Firebase logout (PRIMARY)
  await signOut(auth);

  /*
  ======================================================
  🧁 COOKIE-BASED LOGOUT (FOR FUTURE USE)
  ------------------------------------------------------
  await api.post("/api/auth/logout", {}, { withCredentials: true });
  ======================================================
  */
};
