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
import { Minimize2 , Maximize2 } from "lucide-react";
const ViewShortStory = () => {
  const { storyId } = useParams();

  const [story, setStory] = useState({});
  const [loading, setLoading] = useState(true);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
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

  // LOGIC: Calculate scroll percentage
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // LOGIC: Toggle Focus Mode (Hides UI + Triggers Fullscreen)
  const toggleFocusMode = () => {
    if (!isFocusMode) {
      setIsFocusMode(true);
      // Optional: Enter browser fullscreen for true immersion
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.log("Fullscreen blocked:", err);
        });
      }
    } else {
      setIsFocusMode(false);
      // Exit browser fullscreen
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className={`min-h-screen bg-[#0b1412] text-gray-200 relative transition-all duration-500 ${isFocusMode ? 'pt-10' : ''}`}>

      {/* --- PROGRESS BAR --- */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-transparent">
        <div
          className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]"
          style={{ width: `${scrollProgress}%`, transition: "width 0.1s ease-out" }}
        />
      </div>

      {/* --- COVER IMAGE (Hidden in Focus Mode) --- */}
      {!isFocusMode && (
        <div className="relative w-full h-[260px] sm:h-[380px] bg-gray-900 animate-in fade-in duration-700">
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
      )}

      {/* CONTENT CONTAINER */}
      <div className="max-w-5xl mx-auto px-4 sm:px-10 pt-16 pb-20">

        {/* HEADER ROW */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

          {/* LEFT: Title + Author */}
          <div className="max-w-2xl">
            <h1 className={`font-serif text-white leading-tight transition-all duration-300 ${isFocusMode ? 'text-2xl sm:text-3xl opacity-80' : 'text-3xl sm:text-4xl'}`}>
              {story.title}
            </h1>

            {/* AUTHOR (Hidden in Focus Mode to reduce noise) */}
            {!isFocusMode && (
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
            )}
          </div>

          {/* RIGHT: ACTION BUTTONS */}
          <div className="flex gap-3 mt-2 md:mt-0 flex-wrap">
            {/* LIKE BUTTON */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${liked ? "bg-white text-black border-white" : "bg-transparent text-gray-300 border-gray-600 hover:border-gray-400"}`}
            >
              <ThumbsUp size={14} className={liked ? "fill-black" : ""} />
              <span>{likesCount} Likes</span>
            </button>

            {/* GOOD READS BUTTON */}
            <button
              onClick={handleGoodReads}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${addedToGoodReads ? "bg-emerald-600 text-white border-emerald-600" : "bg-transparent text-emerald-400 border-emerald-500/60 hover:bg-emerald-500/10"}`}
            >
              <Bookmark size={14} className={addedToGoodReads ? "fill-white" : ""} />
              <span>{goodReadsCount} Good Reads</span>
            </button>

            {/* --- FOCUS MODE TOGGLE --- */}
            <button
              onClick={toggleFocusMode}
              title="Toggle Focus Mode"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300
                ${isFocusMode
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/30"
                  : "bg-transparent text-gray-400 border-gray-700 hover:border-gray-500 hover:text-gray-200"
                }`}
            >
              {isFocusMode ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              <span className="inline">{isFocusMode ? "Exit Focus" : "Focus"}</span>
            </button>
          </div>
        </div>

        {/* DESCRIPTION (Hidden in Focus Mode) */}
        {story.description && !isFocusMode && (
          <div className="mt-10 p-4 rounded-xl bg-white/5 border border-white/5 animate-in fade-in slide-in-from-top-4 duration-500">
            <span className="text-emerald-400 text-xs uppercase tracking-wider font-bold block mb-1">
              Description
            </span>
            <p className="text-sm text-gray-300 leading-relaxed">
              {story.description}
            </p>
          </div>
        )}

        <hr className={`my-10 border-gray-800 transition-opacity ${isFocusMode ? 'opacity-0' : 'opacity-100'}`} />

        {/* STORY CONTENT */}
        <div className="reader-area" style={{ fontFamily: "'Merriweather', serif" }}>
          <div
            className={`prose prose-invert prose-lg max-w-full prose-emerald leading-loose transition-all duration-500 ${isFocusMode ? 'mt-8 text-xl' : ''}`}
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewShortStory;