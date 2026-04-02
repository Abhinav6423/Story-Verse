import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { ThumbsUp, Bookmark, Minimize2, Maximize2, X, Star, Target, Play } from "lucide-react";
import { toast } from "react-toastify";
import DOMpurify from "dompurify";
import Loader from "../Loader.jsx";
import { OpenFeedShortStory } from "../../Api-calls/OpenFeedShortStory.js";
import { likeShortStory } from "../../Api-calls/likeShortStory.js";
import { addShortStoryToGoodReads } from "../../Api-calls/addShortStoryToGoodReads.js";
import { answerQuestionShortStory } from "../../Api-calls/answerQuestionShortStory.js";
import { recommendShortStory } from "../../Api-calls/recommendShortStrory.js";
import RecommendShortStory from "./RecommendShortStory.jsx";
import { getCategoryGradient } from "../../utils/GetStoryGradient.jsx"
const ViewShortStory = () => {
  const { storyId } = useParams();

  const [story, setStory] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [addedToGoodReads, setAddedToGoodReads] = useState(false);
  const [goodReadsCount, setGoodReadsCount] = useState(0);
  const [recommendedStories, setRecommendedStories] = useState([]);
  const [showChapters, setShowChapters] = useState(false);

  // --- NEW STORY MODE STATES ---
  const [isStoryMode, setIsStoryMode] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // ✅ Reset state on story change
  useEffect(() => {
    setStory({});
    setRecommendedStories([]);
    setLoading(true);
    window.scrollTo(0, 0);
  }, [storyId]);

  // OPTIMIZATION & CHUNKING: Derive HTML, Chapters, and Slides in one pass
  const { htmlContent, chapters, slides } = useMemo(() => {
    if (!story.story) {
      return { htmlContent: "", chapters: [], slides: [] };
    }

    const clean = DOMpurify.sanitize(story.story);
    const parser = new DOMParser();
    const doc = parser.parseFromString(clean, "text/html");

    const extractedChapters = [];
    const generatedSlides = [];
    let chapterCounter = 1;

    // 1. Extract Chapters for Sidebar Index
    const headings = doc.querySelectorAll("h1 , h2, h3");
    headings.forEach((heading, index) => {
      const id = `chapter-${index + 1}`;
      heading.setAttribute("id", id);
      extractedChapters.push({
        id,
        title: heading.textContent,
      });
    });

    // 2. Generate Slides for Story Mode
    Array.from(doc.body.children).forEach((node) => {
      if (node.nodeName.match(/^H[1-6]$/i)) {
        generatedSlides.push({
          type: "chapter",
          number: chapterCounter++,
          title: node.textContent.trim(),
        });
      } else if (node.textContent && node.textContent.trim() !== "") {
        const text = node.textContent.trim();
        const words = text.split(/\s+/);
        let currentChunk = "";

        for (let word of words) {
          // ~250 character limit per slide
          if ((currentChunk + word).length > 250 && currentChunk.length > 0) {
            generatedSlides.push({ type: "text", content: currentChunk.trim() });
            currentChunk = word + " ";
          } else {
            currentChunk += word + " ";
          }
        }
        if (currentChunk.trim().length > 0) {
          generatedSlides.push({ type: "text", content: currentChunk.trim() });
        }
      }
    });

    return {
      htmlContent: doc.body.innerHTML,
      chapters: extractedChapters,
      slides: generatedSlides,
    };
  }, [story.story]);

  // LOGIC: Scroll to chapter when URL has a hash
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const fetchRecommendedStories = async () => {
    setLoadingRecommendations(true);
    try {
      const response = await recommendShortStory({ currentStoryId: storyId, category: story?.category });
      if (response.success) {
        setRecommendedStories(response.data);
      }
    } catch (error) {
      console.error("Error fetching recommended stories:", error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  /* ---------------- FETCH STORY ---------------- */
  useEffect(() => {
    const fetchStory = async () => {
      try {
        const result = await OpenFeedShortStory({ storyId });

        if (result?.success) {
          const data = result.data.shortStory;
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

  // Fetch recommended stories when the main story's category is available/changes
  useEffect(() => {
    if (story?.category) {
      fetchRecommendedStories();
    }
  }, [story?.category]);

  /* ---------------- LIKE & GOODREADS ---------------- */
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

  const handleGoodReads = async () => {
    const wasAdded = addedToGoodReads;
    setAddedToGoodReads(!wasAdded);
    setGoodReadsCount((p) => (wasAdded ? p - 1 : p + 1));

    try {
      const result = await addShortStoryToGoodReads({ storyId });
      if (!result?.success) throw new Error();
      toast.success(wasAdded ? "Removed from Good Reads" : "Added to Good Reads 📚");
    } catch {
      setAddedToGoodReads(wasAdded);
      setGoodReadsCount((p) => (wasAdded ? p + 1 : p - 1));
      toast.error("Action failed");
    }
  };

  /* ---------------- SCROLL & FOCUS MODES ---------------- */
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFocusMode = () => {
    if (!isFocusMode) {
      setIsFocusMode(true);
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((err) => console.log("Fullscreen blocked:", err));
      }
    } else {
      setIsFocusMode(false);
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  /* ---------------- STORY MODE SLIDE NAVIGATION ---------------- */
  const nextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    } else {
      closeStoryMode(); // Auto-close when finishing the last slide
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  const openStoryMode = () => {
    setIsStoryMode(true);
    setCurrentSlideIndex(0);
    document.body.style.overflow = "hidden"; // Lock background scroll
  };

  const closeStoryMode = () => {
    setIsStoryMode(false);
    document.body.style.overflow = "auto"; // Restore scroll
  };

  // Cleanup effect in case component unmounts while in story mode
  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);


  if (loading) return <Loader />;

  return (
    <div className={`min-h-screen bg-black text-gray-300 relative transition-all duration-700 ${isFocusMode ? 'pt-8' : ''}`}>

      {/* --- FOOLPROOF EXIT FOCUS ESCAPE HATCH --- */}
      {isFocusMode && (
        <button
          onClick={toggleFocusMode}
          className="fixed top-10 left-1/2 -translate-x-1/2 z-[9999] group flex items-center gap-3 px-6 py-3 rounded-full bg-[#111111]/90 backdrop-blur-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.8)] transition-all duration-300 active:scale-95 animate-in slide-in-from-bottom-8 fade-in"
        >
          <Minimize2 size={16} className="group-hover:scale-90 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Exit Focus</span>
        </button>
      )}

      {/* --- COVER IMAGE --- */}
      {!isFocusMode && (
        <div className="relative w-full h-[45vh] sm:h-[55vh] animate-in fade-in duration-[1.5s] overflow-hidden bg-[#0b1412] group">

          {story?.coverImage ? (
            <img
              src={story.posterImage || story.coverImage}
              alt={story.title}
              fetchPriority="high"
              className="w-full h-full object-cover scale-105 transition-transform duration-10000 ease-linear group-hover:scale-110 opacity-80 brightness-75 contrast-125 relative z-0"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#050a08]">
              <h3 className="text-xl font-serif text-emerald-900/50 tracking-wider uppercase">{story.title}</h3>
            </div>
          )}



        </div>
      )}

      {/* --- SIDE CHAPTER INDEX --- */}
      {chapters.length > 0 && (
        <>
          <button
            onClick={() => setShowChapters(!showChapters)}
            className="fixed right-4 bottom-24 sm:bottom-14 md:bottom-4 z-[80] bg-emerald-500 text-black px-6 py-3 rounded-full text-sm font-semibold shadow-2xl hover:scale-105 transition-all duration-300"
          >
            {showChapters ? "Close Index" : "Index"}
          </button>

          {showChapters && (
            <div className="fixed inset-0 z-[90] flex justify-end">

              {/* Overlay */}
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowChapters(false)}
              />

              {/* Sidebar */}
              <div className="relative w-80 bg-[#0b1412] h-full p-8 overflow-y-auto border-l border-emerald-900/30 shadow-2xl animate-in slide-in-from-right duration-300 no-scrollbar">

                {/* Header */}
                <h4 className="text-lg sm:text-xl tracking-widest uppercase text-emerald-500 mb-2 font-semibold">
                  INDEX
                </h4>

                {/* UX Hint */}
                <p className="text-xs text-gray-100 mb-6 tracking-widest font-bold">
                  TAP A CHAPTER TO JUMP
                </p>

                {/* Chapters */}
                <div className="flex flex-col gap-3">
                  {chapters.map((chapter, index) => (
                    <button
                      key={chapter.id}
                      onClick={() => {
                        scrollToSection(chapter.id);
                        setShowChapters(false);
                      }}
                      className="group relative text-left font-serif text-[15px] text-gray-300 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 hover:text-white bg-white/[0.02] hover:bg-white/5 active:scale-[0.98]"
                    >

                      {/* Left indicator bar */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 bg-emerald-500 rounded-full transition-all duration-300 group-hover:h-6" />

                      {/* Chapter number */}
                      <span className="block text-[10px] tracking-widest text-gray-600 mb-1">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      {/* Title + arrow */}
                      <span className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300">
                        {chapter.title}
                        <span className="opacity-100  group-hover:opacity-100 transition-opacity duration-300">
                          →
                        </span>
                      </span>

                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* CONTENT CONTAINER */}
      <div className={`mx-auto flex flex-col items-center pb-20 relative z-20 transition-all duration-700 w-full px-4 sm:px-6 md:px-8 ${isFocusMode ? 'max-w-3xl' : 'max-w-4xl pt-10 sm:pt-16'}`}>

        {/* --- CENTERED HEADER SECTION --- */}
        <div className="flex flex-col w-full relative z-20 items-start text-left mb-16">

          {!isFocusMode && (
            <div className="w-full flex flex-col items-start animate-in slide-in-from-bottom-8 fade-in duration-1000">

              {/* 1. Raw Metadata (Replaces Top Badge & Tags) */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[9px] sm:text-[10px] font-mono tracking-[0.3em] uppercase text-emerald-500/80 mb-6">
                <span className="flex items-center gap-2 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,1)] animate-pulse"></span>
                  Archive Selection
                </span>
                <span className="text-gray-700">/</span>
                <span className="text-gray-400">
                  {story?.category || "FICTION"}
                </span>
                <span className="text-gray-700">/</span>
                <span className="text-gray-500">
                  AUTHOR // {story?.author?.username || "UNKNOWN"}
                </span>
              </div>

              {/* 2. Monumental Title */}
              <h1 className="text-6xl sm:text-7xl md:text-[6rem] font-medium text-white tracking-tighter leading-[0.95] drop-shadow-2xl mb-8 -ml-1">
                {story.title}
              </h1>

              {/* 3. Editorial Description (Thin, elegant, left-bordered) */}
              {story.description && (
                <p className="text-base sm:text-lg text-gray-400 font-light leading-relaxed max-w-2xl border-l-2 border-emerald-500/30 pl-6 backdrop-blur-sm mb-12">
                  {story.description}
                </p>
              )}
            </div>
          )}

          {/* Focus Mode Title */}
          {isFocusMode && (
            <h1 className="text-4xl sm:text-5xl font-medium text-white/40 tracking-tight leading-[1.1] mb-16 w-full text-center animate-in fade-in duration-700">
              {story.title}
            </h1>
          )}

          {/* --- 4. IN-FLOW CINEMATIC ACTION BUTTONS --- */}
          {/* Not floating. Sits directly below the text. Hides during Focus Mode. */}
          <div className={`relative flex flex-col sm:flex-row items-start gap-4 sm:gap-6 w-full transition-all duration-500 ${isFocusMode ? 'hidden' : 'opacity-100'}`}>

            {/* Primary CTA: Read Now */}
            <button
              onClick={openStoryMode}
              className="group relative flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-emerald-500 text-black font-bold text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 hover:bg-emerald-400 active:scale-95 shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_50px_rgba(16,185,129,0.4)] overflow-hidden w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-[1.2s] ease-in-out" />
              <span className="relative z-10 whitespace-nowrap">Read Now</span>
              <Play size={14} className="fill-black text-black relative z-10 group-hover:scale-110 transition-transform duration-300" />
            </button>

            {/* Secondary Actions: Glassmorphic Control Bar */}
            <div className="flex items-center p-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 w-full sm:w-auto shadow-xl">

              {/* Focus Mode Toggle */}
              <button
                onClick={toggleFocusMode}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-medium text-xs sm:text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <Target size={16} />
                <span className="hidden sm:inline">Focus</span>
              </button>

              {/* Divider */}
              <div className="w-[1px] h-4 bg-white/10 hidden sm:block"></div>

              {/* Save Button */}
              <button
                onClick={handleGoodReads}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300
          ${addedToGoodReads ? "bg-emerald-500/15 text-emerald-400" : "text-gray-400 hover:text-white hover:bg-white/10"}`}
              >
                <Bookmark size={16} className={addedToGoodReads ? "fill-emerald-400" : ""} />
                <span className="hidden sm:inline">{addedToGoodReads ? "Saved" : "Save"}</span>
              </button>

              {/* Divider */}
              <div className="w-[1px] h-4 bg-white/10 hidden sm:block"></div>

              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300
          ${liked ? "bg-emerald-500/15 text-emerald-400" : "text-gray-400 hover:text-white hover:bg-white/10"}`}
              >
                <ThumbsUp size={16} className={liked ? "fill-emerald-400" : ""} /> {story.likes}
              </button>
            </div>

          </div>
        </div>

        {/* --- MAIN SCROLLING TEXT --- */}
        <div className="reader-area w-full max-w-3xl mx-auto font-sans">
          <div
            className={`prose prose-invert max-w-none prose-emerald 
              prose-headings:text-gray-100 prose-headings:font-semibold prose-headings:text-left 
              prose-p:text-[#c4c4c4] prose-p:leading-[1.8] sm:prose-p:leading-[2] prose-p:text-left 
              prose-a:text-emerald-400 prose-a:decoration-emerald-400/30 hover:prose-a:decoration-emerald-400 
              transition-all duration-700 
              ${isFocusMode ? 'prose-lg sm:prose-xl mt-4' : 'prose-sm sm:prose-base'}`}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>



      </div>







      {/* --- THE DESCENT / ARCHIVE SECTION --- */}
      <div className="relative w-full bg-gradient-to-b from-transparent via-[#050908] to-[#020403] pt-24 pb-16 border-t border-emerald-900/20 shadow-[inset_0_40px_60px_rgba(0,0,0,0.3)]">
        <div className="mx-auto max-w-3xl px-6 sm:px-8 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 relative">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-900/10 blur-[80px] rounded-full pointer-events-none" />
          <h3 className="text-3xl sm:text-4xl text-gray-100 font-serif tracking-tight mb-5 relative z-10">The descent is complete.</h3>
          <p className="text-gray-400 font-serif italic text-[1.15rem] mb-12 max-w-2xl leading-relaxed relative z-10">
            You just spent focused time entirely submerged in <span className="text-emerald-400/80">"{story.title}"</span>. In a world built on infinite scrolling, holding your attention here is a rare ritual. Let the silence settle.
          </p>
          <div className="flex flex-col items-center gap-5 mb-20 p-8 sm:p-10 bg-[#08100e] rounded-2xl border border-emerald-500/15 shadow-[0_10px_40px_rgba(0,0,0,0.6)] backdrop-blur-md w-full max-w-lg relative z-10 group transition-all duration-500 hover:border-emerald-500/30">
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-gray-300 font-medium tracking-wide">Did this story get under your skin?</p>
              <p className="text-xs text-gray-500">Secure it in your personal archive before it fades.</p>
            </div>
            <button
              onClick={handleGoodReads}
              className={`flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-semibold transition-all duration-300 w-full md:w-4/5 ${addedToGoodReads ? "bg-emerald-500/90 text-[#070c0b] shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-[0.98]" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 hover:scale-[1.02]"}`}
            >
              <Bookmark size={18} className={addedToGoodReads ? "fill-[#070c0b]" : ""} />
              <span>{addedToGoodReads ? "Secured in Archive" : "Archive this feeling"}</span>
            </button>
          </div>
          <div className="flex flex-col items-center relative z-10 w-full">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[1px] w-8 bg-emerald-500/30"></span>
              <p className="text-[10px] text-emerald-500/80 uppercase tracking-[0.4em] font-bold">Pattern Match Found</p>
              <span className="h-[1px] w-8 bg-emerald-500/30"></span>
            </div>
            <h4 className="text-xl sm:text-2xl text-gray-200 font-serif mb-3">Because you survived "{story.title}"</h4>
            <p className="text-sm text-gray-500 mb-10 max-w-md">We analyzed the atmospheric signature of what you just read. You may not want to go deeper... but your next descent is waiting.</p>
            <div className="animate-bounce mb-12">
              <svg className="w-5 h-5 text-emerald-500/50" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
            </div>
          </div>
        </div>
        <RecommendShortStory relatedStories={recommendedStories} />
      </div>


      {/* --- STORY MODE OVERLAY (TAP TO READ) --- */}
      {isStoryMode && slides.length > 0 && (
        <div className="fixed inset-0 z-[9999] bg-[#050908] flex flex-col animate-in fade-in zoom-in-95 duration-300 overflow-hidden min-h-screen min-w-screen">

          {/* Top Progress Bar & Header */}
          <div className="absolute top-0 w-full p-4 z-50 flex flex-col gap-4 bg-gradient-to-b from-black/80 to-transparent">
            {/* Tick Progress Indicators */}
            <div className="flex gap-1 w-full max-w-2xl mx-auto h-1.5">
              {slides.map((_, idx) => (
                <div
                  key={idx}
                  className={`flex-1 rounded-full transition-colors duration-300 ${idx === currentSlideIndex
                    ? "bg-emerald-400"
                    : idx < currentSlideIndex
                      ? "bg-gray-600/60"
                      : "bg-gray-800"
                    }`}
                />
              ))}
            </div>

            <div className="flex justify-between items-center max-w-2xl mx-auto w-full px-2">

              {/* TITLE & PROGRESS TEXT CONTAINER */}
              <div className="flex items-center gap-3 overflow-hidden pr-4">
                <span className="text-[10px] font-bold tracking-[0.2em] text-emerald-500 uppercase truncate">
                  {story.title}
                </span>

                {/* --- NEW PROGRESS TEXT HERE --- */}
                <span className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase whitespace-nowrap">
                  | &nbsp; {currentSlideIndex + 1} / {slides.length}
                </span>
              </div>

              <button
                onClick={closeStoryMode}
                className="text-gray-400 hover:text-white transition p-2 bg-black/40 rounded-full backdrop-blur-md border border-gray-700/50 hover:bg-black/60 z-50 shrink-0"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Invisible Tap Zones for Navigation */}
          <div
            className="absolute inset-y-0 left-0 w-1/3 z-40 cursor-w-resize"
            onClick={prevSlide}
          />
          <div
            className="absolute inset-y-0 right-0 w-2/3 z-40 cursor-e-resize"
            onClick={nextSlide}
          />

          {/* Slide Content Rendering */}
          <div className="flex-1 flex items-center justify-center p-8 sm:p-12 max-w-2xl mx-auto w-full relative z-30 pointer-events-none">
            {slides[currentSlideIndex]?.type === "chapter" ? (
              // CHAPTER SLIDE
              <div key={`chapter-${currentSlideIndex}`} className="text-center animate-in slide-in-from-bottom-4 fade-in duration-500">
                <p className="text-emerald-500/80 text-sm tracking-[0.4em] uppercase mb-4 font-bold">
                  Chapter {String(slides[currentSlideIndex].number).padStart(2, '0')}
                </p>
                <h2 className="text-4xl sm:text-5xl text-gray-100 font-serif leading-tight">
                  {slides[currentSlideIndex].title}
                </h2>
              </div>
            ) : (
              // TEXT SLIDE
              <div key={`text-${currentSlideIndex}`} className="w-full animate-in fade-in duration-300">
                <p className="text-2xl sm:text-3xl text-gray-200 font-serif leading-[1.7] text-center sm:text-left drop-shadow-lg">
                  {slides[currentSlideIndex]?.content}
                </p>
              </div>
            )}
          </div>

          {/* Bottom Hint */}
          <div className="absolute bottom-8 w-full text-center z-30 pointer-events-none opacity-40">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
              Tap edges to navigate
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default ViewShortStory;