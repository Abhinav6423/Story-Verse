import axios from "axios";

export const likeShortStory = async ({ storyId }) => {
    const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/story/${storyId}/like`,
        {}, // 👈 empty body
        {
            withCredentials: true, // 👈 config (THIS is what sends cookie)
        }
    );

    return res.data; // 🔥 return raw backend response
};
