import axios from "axios";

export const listTrendingShortStory = async () => {
    const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/story/trending`,
        {
            withCredentials: true,
        }
    );



    return res?.data; // 🔥 return raw backend response
};