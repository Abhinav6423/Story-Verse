import axios from "axios";

export const updateProfile = async (data) => {
    try {
        const res = await axios.put(
            "/api/profile/updateProfile",
            data,
            {
                withCredentials: true,
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
