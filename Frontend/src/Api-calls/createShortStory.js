import axios from "axios";

export const createShortStory = async ({ title, story, description, coverImage, finalQuestion, category, status, finalAnswer }) => {
    try {
        const res = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/story/`,
            {
                title,
                story,
                description,
                coverImage,
                finalQuestion,
                category,
                status,
                finalAnswer

            }, { withCredentials: true }
        );

        return {
            success: true,
            message: "User logged in successfully",
            data: res?.data
        }
    } catch (error) {
        return {
            success: false,
            message: error?.response?.data?.message || "Creation failed"
        }
    }
};
