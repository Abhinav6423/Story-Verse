import axios from "axios"

export const deleteShortStory = async ({ storyId }) => {
    try {
        const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/story/${storyId}`, { withCredentials: true })

        if (res.status === 200) {
            return {
                success: true,
                message: "Short story deleted successfully",
                data: res?.data
            };
        }
    } catch (error) {
        return {
            success: false,
            message: error?.response?.data
        };
    }

}