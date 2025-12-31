import axios from "axios";

export const getUserProfileData = async () => {
    try {
        const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/profile/userProfile`,
            { withCredentials: true }
        );

        // ✅ always return consistent shape
        return {
            success: true,
            user: res.data?.data?.user || null,
            stats: res.data?.data?.stats || null,
        };
    } catch (error) {
        return {
            success: false,
            message:
                error?.response?.data?.message ||
                "Failed to fetch user profile",
        };
    }
};
