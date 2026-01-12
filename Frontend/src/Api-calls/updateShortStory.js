import axios from "axios";

export const updateShortStory = async (formData, storyId) => {
    try {
        const res = await axios.put(
            `/api/story/${storyId}`,
            formData,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return {
            success: true,
            data: res?.data
        };
    } catch (error) {
        return {
            success: false,
            message: error?.response?.data?.message || "Creation failed"
        };
    }
};
