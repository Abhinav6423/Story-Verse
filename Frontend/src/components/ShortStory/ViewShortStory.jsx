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
import { Minimize2, Maximize2 } from "lucide-react";
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
          const data = result.data.shortStory;
          console.log(result.data.shortStory)
          setStory(data);
          setLiked(data?.isLiked);
          setAddedToGoodReads(data?.isGoodRead);
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

    < div className={`min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#152a25] via-[#0b1412] to-[#070c0b] text-gray-300 relative transition-all duration-700 ${isFocusMode ? 'pt-8' : ''}`
    }>

      {/* --- PROGRESS BAR --- */}
      < div className="fixed top-0 left-0 w-full h-[2px] z-50 bg-transparent" >
        <div
          className="h-full bg-emerald-500 shadow-[0_0_8px_#10b981]"
          style={{ width: `${scrollProgress}%`, transition: "width 0.15s ease-out" }}
        />
      </div >

      {/* --- COVER IMAGE --- */}
      {
        !isFocusMode && (
          <div className="relative w-full h-[35vh] sm:h-[45vh] animate-in fade-in duration-1000">
            {story?.coverImage ? (
              <img
                src={story.coverImage}
                alt={story.title}
                fetchPriority="high"
                className="w-full h-full object-cover opacity-70 mix-blend-luminosity"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-emerald-900/10">
                <h3 className="text-xl font-serif text-gray-500 tracking-wide">{story.title}</h3>
              </div>
            )}
            {/* Deep fade into the radial background */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1412] via-[#0b1412]/60 to-transparent z-10 pointer-events-none" />
          </div>
        )
      }

      {/* CONTENT CONTAINER */}
      <div className={`mx-auto px-6 sm:px-8 pb-24 relative z-20 transition-all duration-700 ${isFocusMode ? 'max-w-3xl' : 'max-w-4xl pt-10 sm:-mt-16'}`}>

        {/* --- CENTERED HEADER SECTION --- */}
        <div className="flex flex-col items-center text-center gap-6 md:gap-8">

          {/* CATEGORY BADGE */}
          {!isFocusMode && (
            <div className="mb-[-0.5rem] animate-in slide-in-from-bottom-2 fade-in duration-700">
              <span className="inline-flex items-center justify-center bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-5 py-1.5 rounded-full font-bold tracking-[0.25em] text-[10px] sm:text-xs uppercase shadow-[0_0_20px_rgba(16,185,129,0.05)] backdrop-blur-md">
                {story.category}
              </span>
            </div>
          )}

          {/* TITLE */}
          <div className="max-w-3xl flex flex-col items-center">
            {/* Note: Recommend using 'Playfair Display' or 'Lora' for this font-serif */}
            <h1 className={`font-serif text-gray-50 leading-[1.15] tracking-tight transition-all duration-500 ${isFocusMode ? 'text-3xl sm:text-4xl opacity-90' : 'text-4xl sm:text-5xl lg:text-6xl drop-shadow-xl'}`}>
              {story.title}
            </h1>

            {/* AUTHOR */}
            {!isFocusMode && (
              <div className="flex items-center gap-3 mt-8 animate-in fade-in duration-1000 delay-150">
                <img
                  src={story.author?.profilePic}
                  alt={story.author?.username}
                  className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500/20 shadow-lg"
                />
                <div className="flex flex-col text-left">
                  <p className="text-sm text-gray-200 font-semibold tracking-wide">
                    {story.author?.username}
                  </p>
                  <p className="text-xs text-emerald-500/80 font-medium">Writer</p>
                </div>
              </div>
            )}
          </div>

          {/* --- MOBILE-OPTIMIZED ACTION BUTTONS --- */}
          {/* Centered, wrapping gracefully, with better touch targets (py-2.5) for phones */}
          <div className={`flex justify-center gap-3 flex-wrap w-full mt-4 transition-opacity duration-500 ${isFocusMode ? 'opacity-30 hover:opacity-100' : 'opacity-100'}`}>

            <button
              onClick={handleLike}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 backdrop-blur-md flex-grow-0 sm:flex-grow-0 ${liked ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]" : "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white"}`}
            >
              <ThumbsUp size={16} className={liked ? "fill-emerald-400 text-emerald-400" : ""} />
              <span>
                {liked ? "Loved" : "Love this"}
                <span className="opacity-50 ml-1.5 font-normal">· {likesCount}</span>
              </span>
            </button>

            <button
              onClick={handleGoodReads}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 backdrop-blur-md flex-grow-0 sm:flex-grow-0 ${addedToGoodReads ? "bg-emerald-500/90 text-[#070c0b] border border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white"}`}
            >
              <Bookmark size={16} className={addedToGoodReads ? "fill-[#070c0b]" : ""} />
              <span>{addedToGoodReads ? "In Library" : "Keep for later"}</span>
            </button>

            <button
              onClick={toggleFocusMode}
              title="Toggle Focus Mode"
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 backdrop-blur-md w-full sm:w-auto
              ${isFocusMode
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/25"
                  : "bg-transparent text-gray-400 border border-gray-700/50 hover:border-gray-500/50 hover:text-gray-200"
                }`}
            >
              {isFocusMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              <span>{isFocusMode ? "Return to surface" : "Deep Focus"}</span>
            </button>
          </div>
        </div>

        {/* DESCRIPTION */}
        {story.description && !isFocusMode && (
          <div className="mt-14 text-center max-w-2xl mx-auto text-lg sm:text-xl text-gray-400/90 italic font-serif leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            “{story.description}”
          </div>
        )}

        <hr className={`my-12 w-24 mx-auto border-emerald-500/20 transition-opacity duration-700 ${isFocusMode ? 'opacity-0 my-6' : 'opacity-100'}`} />

        {/* STORY CONTENT */}
        {/* Recommend 'Lora' or 'Merriweather' for this body font */}
        <div
          className="reader-area mx-auto max-w-3xl"
          style={{ fontFamily: "'Lora', 'Merriweather', 'Georgia', serif" }}
        >
          <div
            className={`
            prose prose-invert max-w-none prose-emerald 
            prose-headings:font-serif prose-headings:text-gray-100 prose-headings:font-normal prose-headings:text-center
            prose-p:text-gray-300 prose-p:leading-[2.2] prose-p:tracking-normal prose-p:text-justify sm:prose-p:text-left
            prose-a:text-emerald-400 prose-a:decoration-emerald-400/30 hover:prose-a:decoration-emerald-400
            transition-all duration-700
            ${isFocusMode ? 'prose-xl sm:prose-2xl mt-4 text-gray-200' : 'prose-lg text-gray-300'}
          `}
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </div>
      </div>
    </div >
  );
};

export default ViewShortStory;