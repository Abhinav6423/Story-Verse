import axios from "axios";

export const listTrendingShortStory = async ({ page, limit }) => {
    const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/story/trending`,
        {
            params: { page, limit },

            withCredentials: true,
        }
    );



    return res?.data; // 🔥 return raw backend response
};