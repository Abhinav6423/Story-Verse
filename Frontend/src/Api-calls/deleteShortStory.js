import axios from "axios"
import api from "../api/api";

export const deleteShortStory = async ({ storyId }) => {
    try {
        const res = await api.delete(`/api/story/${storyId}`)

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