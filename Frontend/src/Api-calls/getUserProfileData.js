import axios from "axios";

export const getUserProfileData = async () => {
    try {
        const res = await axios.get(
            `/api/profile/userProfile`,
            { withCredentials: true }
        );

        // ✅ always return consistent shape
        return {
            success: true,
            data: res?.data,
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
