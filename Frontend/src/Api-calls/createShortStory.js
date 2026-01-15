import api from "../api/api.js";

export const createShortStory = async (formData) => {
  try {
    const res = await api.post(
      "/api/story",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return {
      success: true,
      data: res?.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || "Creation failed",
    };
  }
};
