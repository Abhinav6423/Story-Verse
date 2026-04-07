import api from "../api/api.js";

export const openStoreel = async (id) => {
    try {
        const res = await api.get(`/api/storeel/open/${id}`);
        return res?.data; // 🔥 return raw backend response
    } catch (error) {
        return {
            success: false,
            message: error?.response?.data?.message || "Something went wrong"
        }
    }
}