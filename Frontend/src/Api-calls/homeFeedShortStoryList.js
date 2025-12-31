import axios from "axios";

export const listFeedShortStory = async ({ category, title }) => {
  console.log(category)
  const res = await axios.get(
    `/api/story/list`,
    {
      params: { category, title },
      withCredentials: true,
    }
  );

  console.log(res?.data)

  return res?.data; // 🔥 return raw backend response
};
