import axios from "axios";
import api from "../api/api.js";
export const openUserShortStory = async ({ storyId }) => {
    try {
        const res = await api.get(
            `/api/story/me/${storyId}`,
            // { withCredentials: true }
        );

        console.log(res?.data?.shortStory);
        return {
            success: true,
            data: res?.data?.shortStory // ✅ DIRECT ShortStory
        };
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error?.response?.data?.message || "Failed to fetch story",
        };
    }
};
