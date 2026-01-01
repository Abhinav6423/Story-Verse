import axios from "axios";
export const addShortStoryToGoodReads = async ({ storyId }) => {
  try {
    const res = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/story/${storyId}/goodRead`,
      {},
      { withCredentials: true }
    );

    return res.data; // 👈 IMPORTANT
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong"
    };
  }
};
