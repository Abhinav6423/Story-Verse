import axios from "axios";
import api from "../api/api";
export const getUserCreatedShortStories = async (status) => {
  const res = await api.get(
    `/api/profile/userShortStories`,
    {
      params: { status },
      // withCredentials: true
    }
  );

  return res.data; // ✅ ALWAYS returns something
};
