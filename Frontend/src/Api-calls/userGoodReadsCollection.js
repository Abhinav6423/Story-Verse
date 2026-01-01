import axios from "axios";

export const userGoodReadsCollection = async () => {
    const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/story/goodReads`,
        {
            withCredentials: true,
        }
    );
    return res?.data; // 🔥 return raw backend response
};