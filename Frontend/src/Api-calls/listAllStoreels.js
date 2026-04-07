import api from "../api/api.js";

export const listAllStoreels = async () => {
    try {
        const res = await api.get("/api/storeel/all");
        if (res.status === 200) {
            return { success: true, data: res?.data }
        }
    } catch (error) {
        return {
            success: false,
            message: error?.response?.data?.message || "Something went wrong"
        }
    }
}