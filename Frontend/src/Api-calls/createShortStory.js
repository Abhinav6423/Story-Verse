import axios from "axios";

export const createShortStory = async (formData) => {
    try {
        const res = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL
            }/api/story/`,
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
