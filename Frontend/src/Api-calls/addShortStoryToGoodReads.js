import axios from "axios";
import api from "../api/api.js";
export const addShortStoryToGoodReads = async ({ storyId }) => {
  try {
    const res = await api.put(
      `/api/story/${storyId}/goodRead`,
      {}
      // { withCredentials: true }
    );

    return res.data; // 👈 IMPORTANT
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong"
    };
  }
};
