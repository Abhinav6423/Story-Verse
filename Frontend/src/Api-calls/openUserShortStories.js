import axios from "axios";
export const openUserShortStory = async ({ storyId }) => {
    try {
        const res = await axios.get(
            `/api/story/me/${storyId}`,
            { withCredentials: true }
        );

        // console.log(res?.data?.ShortStory);
        return {
            success: true,
            data: res.data.ShortStory, // ✅ DIRECT ShortStory
        };
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error?.response?.data?.message || "Failed to fetch story",
        };
    }
};
