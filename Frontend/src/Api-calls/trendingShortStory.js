import axios from "axios";
import api from "../api/api";
export const listTrendingShortStory = async () => {
    const res = await api.get(
        `${import.meta.env.VITE_BACKEND_URL
        }/api/story/trending`,
        {
            // withCredentials: true,
        }
    );



    return res?.data; // 🔥 return raw backend response
};