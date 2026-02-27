import api from "../api/api.js";

export const recommendShortStory = async ({ currentStoryId, category }) => {
    try {
        const res = await api.get("/api/story/recommend", {
            params: {
                category,
                currentStoryId
            }
        });

        if (res.status === 200) {
            return {
                success: true,
                data: res?.data?.stories || []
            };
        }

        return { success: false };

    } catch (error) {
        return {
            success: false,
            message: error?.response?.data?.message ||
                error.message ||
                "Failed to fetch recommended stories"
        };
    }
};