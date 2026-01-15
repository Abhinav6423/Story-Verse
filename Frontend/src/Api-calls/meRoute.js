import axios from "axios";
import api from "../api/api.js";
export const meRoute = async () => {
    try {
        const res = await api.get(
            `/api/auth/me`,
            // { withCredentials: true }
        );
        return res.data;
    } catch (err) {
        if (err.response?.status === 401) {
            // 👇 THIS IS NORMAL
            return { success: false };
        }
        throw err; // real errors only
    }
};
