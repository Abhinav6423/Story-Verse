import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ThumbsUp, Bookmark, MessageSquare, X } from "lucide-react";
import { toast } from "react-toastify";

import Loader from "../Loader.jsx";
import { OpenFeedShortStory } from "../../Api-calls/OpenFeedShortStory.js";
import { likeShortStory } from "../../Api-calls/likeShortStory.js";
import { addShortStoryToGoodReads } from "../../Api-calls/addShortStoryToGoodReads.js";
import { answerQuestionShortStory } from "../../Api-calls/answerQuestionShortStory.js";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const ViewShortStory = () => {
  const { storyId } = useParams();

  const [story, setStory] = useState({});
  const [loading, setLoading] = useState(true);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const [addedToGoodReads, setAddedToGoodReads] = useState(false);
  const [goodReadsCount, setGoodReadsCount] = useState(0);

  const [questionPopup, setQuestionPopup] = useState(false);
  const [answer, setAnswer] = useState("");
  const [alreadyAnswered, setAlreadyAnswered] = useState(false);

  /* ---------------- FETCH STORY ---------------- */
  const fetchStory = async () => {
    try {
      const result = await OpenFeedShortStory({ storyId });

      if (result?.success) {
        const data = result.data.ShortStory;
        setStory(data);
        setLiked(data.isLiked);
        setAddedToGoodReads(data.isGoodRead);
        setLikesCount(data.likes);
        setGoodReadsCount(data.totalGoodReads);
        setAlreadyAnswered(data.isQuestionAnswered === true);
      }
    } catch (error) {
      console.error("Error fetching story:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStory();
  }, [storyId]);

  /* ---------------- BODY SCROLL LOCK ---------------- */
  useEffect(() => {
    if (!questionPopup) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "auto";
    };
  }, [questionPopup]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-gray-800">
      {/* COVER IMAGE */}
      <div className="relative w-full h-[260px] sm:h-[350px]">
        {story?.coverImage ? (
          <LazyLoadImage
            src={story.coverImage}
            alt={story.title}
            effect="blur"
            wrapperClassName="w-full h-full"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-sky-100 text-sky-900">
            <h3 className="text-lg font-semibold">{story.title}</h3>
          </div>
        )}

        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-[#1f3d34] text-white px-6 py-2 rounded-full shadow-lg border-4 border-white">
          {story.category}
        </span>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-10 pt-16">
        {/* TITLE */}
        <h1 className="text-3xl sm:text-4xl font-serif text-center text-gray-900">
          {story.title}
        </h1>

        {/* AUTHOR */}
        <div className="flex justify-center gap-2 mt-2">
          <img
            src={story.author?.profilePic}
            alt={story.author?.username}
            loading="lazy"
            className="w-6 h-6 rounded-full object-cover"
          />
          <p className="text-sm text-gray-500">
            {story.author?.username}
          </p>
        </div>

        {/* DESCRIPTION ✅ ADDED BACK */}
        {story.description && (
          <p
            className="
              mt-6
              text-base sm:text-lg
              text-gray-600
              font-serif
              leading-relaxed
              max-w-3xl
              mx-auto
              text-center
            "
          >
            {story.description}
          </p>
        )}

        <hr className="my-8 border-gray-200" />

        {/* STORY CONTENT */}
        <div
          className="prose prose-gray max-w-full"
          dangerouslySetInnerHTML={{ __html: story.story }}
        />
      </div>
    </div>
  );
};

export default ViewShortStory;
