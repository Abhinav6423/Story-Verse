import axios from "axios";
import api from "../api/api";
export const OpenFeedShortStory = async ({ storyId }) => {
    try {
        const res = await api.get(
            `/api/story/${storyId}`,
            {
                // withCredentials: true,
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