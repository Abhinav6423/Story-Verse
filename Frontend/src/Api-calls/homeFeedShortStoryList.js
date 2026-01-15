import axios from "axios";
import api from "../api/api.js";
export const listFeedShortStory = async ({ category, title }) => {
  console.log(category)
  const res = await api.get(
    `/api/story/list`,
    {
      params: { category, title },
      // withCredentials: true,
    }
  );

  console.log(res?.data)

  return res?.data; // 🔥 return raw backend response
};
