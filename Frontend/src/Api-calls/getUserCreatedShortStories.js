import axios from "axios";

export const getUserCreatedShortStories = async (status) => {
  const res = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/profile/userShortStories`,
    {
      params: { status },
      withCredentials: true
    }
  );

  return res.data; // ✅ ALWAYS returns something
};
