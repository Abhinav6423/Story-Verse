import axios from "axios";

export const answerQuestionShortStory = async ({ storyId, answer }) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/story/${storyId}/answer`,
      { answer : answer },
      { withCredentials: true }
    );

    return {
      success: true,
      message: res?.data?.message || "Answer submitted successfully",
      data: res?.data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error?.response?.data?.message || "Something went wrong",
    };
  }
};
