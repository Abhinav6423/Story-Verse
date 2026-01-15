import axios from "axios";
import api from "../api/api.js";
export const likeShortStory = async ({ storyId }) => {
    try {
        const res = await api.put(
            `/api/story/${storyId}/like`,
            {}, // 👈 empty body
            // {
            //     withCredentials: true, // 👈 config (THIS is what sends cookie)
            // }
        );
        // console.log(res?.data);
        return {
            success: true,
            message: "User logged in successfully",
            data: res?.data
        }
    } catch (error) {
        return {
            success: false,
            message: error?.response?.data
        }
    };
}
