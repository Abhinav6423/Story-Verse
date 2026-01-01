import axios from 'axios'

export const updateShortStory = async ({ storyId, title, story, description, coverImage, finalQuestion, finalAnswer, category, status }) => {
    try {
        const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/story/${storyId}`, { title, story, description, coverImage, finalQuestion, finalAnswer, category, status }, { withCredentials: true })

        if (res.status === 200) {
            return {
                success: true,
                message: "Short story updated successfully",
                data: res?.data
            };
        }
    } catch (error) {
        return {
            success: false,
            message: error?.response?.data?.message || "Something went wrong"
        };
    }
}