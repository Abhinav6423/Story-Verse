import api from "../api/api.js";

export const createStoreel = async ({ title, slidesText, reelStory, reelCover }) => {

    if (!title || !slidesText || !reelStory || !reelCover) {
        return { success: false, message: "All fields are required" }
    }

    try {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("slidesText", JSON.stringify(slidesText)); // backend parses this
        formData.append("reelStory", reelStory);
        formData.append("reelCover", reelCover); // actual File object

        console.log("FormData entries:");
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        const res = await api.post("/api/storeel/post", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        if (res.status === 201) {
            return { success: true, message: res?.data }
        }
    } catch (error) {
        return {
            success: false,
            message: error?.response?.data?.message || "Something went wrong"
        }
    }
}