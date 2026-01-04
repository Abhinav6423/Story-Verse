import axios from "axios";

export const listTrendingShortStory = async () => {
    const res = await axios.get(
        `/api/story/trending`,
        {
            withCredentials: true,
        }
    );



    return res?.data; // 🔥 return raw backend response
};