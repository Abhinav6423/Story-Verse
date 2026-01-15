import axios from "axios"
import api from "../api/api";
export const listTopGoodReadsShortStory = async () => {
    const res = await api.get(
        `/api/story/topGoodReads`,
        {
            // withCredentials: true,
        }
    );
    return res?.data; // 🔥 return raw backend response
};