import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { ThumbsUp, Bookmark } from "lucide-react";
import { toast } from "react-toastify";
import DOMpurify from "dompurify";
import Loader from "../Loader.jsx";
import { OpenFeedShortStory } from "../../Api-calls/OpenFeedShortStory.js";
import { likeShortStory } from "../../Api-calls/likeShortStory.js";
import { addShortStoryToGoodReads } from "../../Api-calls/addShortStoryToGoodReads.js";
import { answerQuestionShortStory } from "../../Api-calls/answerQuestionShortStory.js";

const ViewShortStory = () => {
  const { storyId } = useParams();

  const [story, setStory] = useState({});
  const [loading, setLoading] = useState(true);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const [addedToGoodReads, setAddedToGoodReads] = useState(false);
  const [goodReadsCount, setGoodReadsCount] = useState(0);

  // OPTIMIZATION: Memoize sanitized HTML
  const sanitizedContent = useMemo(() => {
    if (!story.story) return "";
    return DOMpurify.sanitize(story.story);
  }, [story.story]);

  /* ---------------- FETCH STORY ---------------- */
  useEffect(() => {
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
        }
      } catch (error) {
        console.error("Error fetching story:", error);
      } finally {
        setLoading(false);
      }
    };
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
    <div className="min-h-screen bg-[#0b1412] text-gray-200">
      {/* COVER IMAGE */}
      <div className="relative w-full h-[260px] sm:h-[380px] bg-gray-900">
        {story?.coverImage ? (
          <img
            src={story.coverImage}
            alt={story.title}
            fetchPriority="high"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-emerald-900/40">
            <h3 className="text-lg font-semibold">{story.title}</h3>
          </div>
        )}

        {/* CATEGORY TAG */}
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-emerald-600 text-white px-6 py-2 rounded-full shadow-lg border-[4px] border-[#0b1412] text-sm font-medium z-10 whitespace-nowrap">
          {story.category}
        </span>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-4 sm:px-10 pt-16 pb-20">

        {/* HEADER ROW */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

          {/* LEFT: Title + Author */}
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-serif text-white leading-tight">
              {story.title}
            </h1>

            {/* AUTHOR */}
            <div className="flex items-center gap-2 mt-3">
              <img
                src={story.author?.profilePic}
                alt={story.author?.username}
                className="w-6 h-6 rounded-full object-cover bg-gray-700"
              />
              <p className="text-sm text-gray-400 font-medium">
                {story.author?.username}
              </p>
            </div>
          </div>

          {/* RIGHT: ACTION BUTTONS */}
          <div className="flex gap-3 mt-2 md:mt-0">
            {/* LIKE BUTTON */}
            <button
              onClick={handleLike}
              className={`
                flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors
                ${liked
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-gray-300 border-gray-600 hover:border-gray-400"
                }
              `}
            >
              <ThumbsUp size={14} className={liked ? "fill-black" : ""} />
              <span>{likesCount} Likes</span>
            </button>

            {/* GOOD READS BUTTON */}
            <button
              onClick={handleGoodReads}
              className={`
                 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors
                ${addedToGoodReads
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-transparent text-emerald-400 border-emerald-500/60 hover:bg-emerald-500/10"
                }
              `}
            >
              <Bookmark size={14} className={addedToGoodReads ? "fill-white" : ""} />
              <span>{goodReadsCount} Good Reads</span>
            </button>
          </div>
        </div>

        {/* DESCRIPTION */}
        {story.description && (
          <div className="mt-10 p-4 rounded-xl bg-white/5 border border-white/5">
            <span className="text-emerald-400 text-xs uppercase tracking-wider font-bold block mb-1">
              Description
            </span>
            <p className="text-sm text-gray-300 leading-relaxed">
              {story.description}
            </p>
          </div>
        )}

        <hr className="my-10 border-gray-800" />

        {/* STORY CONTENT */}
        <div className="reader-area">
          <div
            className="prose prose-invert prose-lg max-w-full prose-emerald"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewShortStory;