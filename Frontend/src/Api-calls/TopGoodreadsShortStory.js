import axios from "axios"

export const listTopGoodReadsShortStory = async () => {
    const res = await axios.get(
        `/api/story/topGoodReads`,
        {
            withCredentials: true,
        }
    );
    return res?.data; // 🔥 return raw backend response
};