import axios from "axios";

export const userGoodReadsCollection = async () => {
    const res = await axios.get(
        `/api/story/goodReads`,
        {
            withCredentials: true,
        }
    );
    return res?.data; // 🔥 return raw backend response
};