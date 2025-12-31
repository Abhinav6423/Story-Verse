import axios from "axios";

export const meRoute = async () => {
    try {
        const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,
            { withCredentials: true }
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
