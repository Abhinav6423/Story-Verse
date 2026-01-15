import axios from "axios";
import api from "../api/api";
export const userGoodReadsCollection = async () => {
    const res = await api.get(
        `/api/story/goodReads`,
        {
            // withCredentials: true,
        }
    );
    return res?.data; // 🔥 return raw backend response
};