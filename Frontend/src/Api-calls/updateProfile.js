import axios from "axios";
import api from "../api/api";
export const updateProfile = async (data) => {
    try {
        const res = await api.put(
            `/api/profile/updateProfile`,
            data,
            {
                // withCredentials: true,
            }
        );

        // ✅ axios already parsed JSON
        return res.data;
    } catch (error) {
        return {
            success: false,
            message:
                error?.response?.data?.message || "Something went wrong",
        };
    }
};
