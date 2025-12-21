import axios from "axios";

export const OpenFeedShortStory = async ({ storyId }) => {
    try {
        const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/story/${storyId}`,
            {
                withCredentials: true,
            }
        );
        return {
            success: true,
            message: "User logged in successfully",
            data: res?.data
        }; // 🔥 return raw backend response
    } catch (error) {
        return {
            success: false,
            message: error?.response?.data
        };
    }
};