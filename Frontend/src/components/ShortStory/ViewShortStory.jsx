import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ThumbsUp, Bookmark, X } from "lucide-react";
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

  /* ---------------- LIKE ---------------- */
  const handleLike = async () => {
    const wasLiked = liked;

    setLiked(!wasLiked);
    setLikesCount((p) => (wasLiked ? p - 1 : p + 1));

    try {
      await likeShortStory({ storyId });
      toast.success(wasLiked ? "Like removed" : "Story liked ❤️");
    } catch {
      setLiked(wasLiked);
      setLikesCount((p) => (wasLiked ? p + 1 : p - 1));
      toast.error("Action failed");
    }
  };

  /* ---------------- GOOD READ ---------------- */
  const handleGoodReads = async () => {
    const wasAdded = addedToGoodReads;

    setAddedToGoodReads(!wasAdded);
    setGoodReadsCount((p) => (wasAdded ? p - 1 : p + 1));

    try {
      const result = await addShortStoryToGoodReads({ storyId });
      if (!result?.success) throw new Error();
      toast.success(
        wasAdded ? "Removed from Good Reads" : "Added to Good Reads 📚"
      );
    } catch {
      setAddedToGoodReads(wasAdded);
      setGoodReadsCount((p) => (wasAdded ? p + 1 : p - 1));
      toast.error("Action failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#0b1412] text-gray-200 ">
      {/* COVER */}
      <div className="relative w-full h-[260px] sm:h-[380px]">
        {story?.coverImage ? (
          <LazyLoadImage
            src={story.coverImage}
            alt={story.title}
            effect="blur"
            wrapperClassName="w-full h-full"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-emerald-900/40">
            <h3 className="text-lg font-semibold">{story.title}</h3>
          </div>
        )}

        {/* DARK GRADIENT OVERLAY */}
        {/* <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#0b1412]" /> */}

        {/* CATEGORY */}
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-emerald-600 text-white px-6 py-2 rounded-full shadow-lg border-[4px] border-[#0b1412] text-sm">
          {story.category}
        </span>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-4 sm:px-10 pt-16">

        {/* HEADER ROW */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

          {/* LEFT: Title + Author + Description */}
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-serif text-white">
              {story.title}
            </h1>

            {/* AUTHOR */}
            <div className="flex items-center gap-2 mt-2">
              <img
                src={story.author?.profilePic}
                alt={story.author?.username}
                loading="lazy"
                className="w-6 h-6 rounded-full object-cover"
              />
              <p className="text-sm text-gray-400">
                {story.author?.username}
              </p>
            </div>


          </div>

          {/* RIGHT: ACTION BUTTONS */}
          <div className="flex md:flex gap-3 md:items-end">
            <button
              onClick={handleLike}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${liked
                ? "bg-white text-black border-white"
                : "bg-transparent text-gray-300 border-gray-500 hover:border-white"
                }`}
            >
              <ThumbsUp size={14} className="inline mr-1" />
              {likesCount} Likes
            </button>

            <button
              onClick={handleGoodReads}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${addedToGoodReads
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-transparent text-emerald-400 border-emerald-500/60 hover:bg-emerald-600/10"
                }`}
            >
              <Bookmark size={14} className="inline mr-1" />
              {goodReadsCount} Good Reads
            </button>
          </div>
        </div>

        {/* DESCRIPTION */}
        {story.description && (
          <p className="mt-11 text-sm text-gray-400 leading-relaxed ">
            <span className="text-emerald-400 font-medium block mb-2">
              Description
            </span>
            {story.description}
          </p>
        )}

        <hr className="my-10 border-gray-700/60" />

        {/* STORY CONTENT */}
        <div
          className="prose prose-invert prose-lg max-w-full leading-relaxed text-gray-300"
          dangerouslySetInnerHTML={{ __html: story.story }}
        />
      </div>

    </div>
  );

};

export default ViewShortStory;
