import React, { memo, useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { User, ArrowRight } from "lucide-react";
import { listTopGoodReadsShortStory } from "../../Api-calls/TopGoodreadsShortStory.js";
import fallbackImage from "../../Assets/fallback.png";

// ---------------------------------------------------------------------------
// Skeleton shown while data is loading
// ---------------------------------------------------------------------------
const SkeletonHero = () => (
    <section className="relative w-full h-[100dvh] min-h-[600px] overflow-hidden bg-[#050505]">
        <div className="absolute inset-0">
            <div className="w-full h-full bg-gradient-to-r from-black via-zinc-900 to-black opacity-80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.05),transparent_60%)]" />
        </div>
        <div className="absolute inset-0 animate-pulse">
            <div className="w-full h-full bg-zinc-800/40" />
        </div>
        <div className="relative z-10 flex flex-col justify-end h-full px-6 md:px-12 pb-24 lg:pb-32">
            <div className="max-w-2xl space-y-4">
                <div className="h-4 w-32 bg-zinc-700 rounded-full animate-pulse" />
                <div className="space-y-3">
                    <div className="h-10 w-[90%] bg-zinc-700 rounded-md animate-pulse" />
                    <div className="h-10 w-[70%] bg-zinc-700 rounded-md animate-pulse" />
                </div>
                <div className="h-4 w-48 bg-zinc-700 rounded-full animate-pulse" />
                <div className="space-y-2">
                    <div className="h-3 w-full bg-zinc-700 rounded animate-pulse" />
                    <div className="h-3 w-[90%] bg-zinc-700 rounded animate-pulse" />
                    <div className="h-3 w-[75%] bg-zinc-700 rounded animate-pulse" />
                </div>
                <div className="h-10 w-40 bg-zinc-600 rounded-full animate-pulse mt-4" />
            </div>
        </div>
    </section>
);

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const AUTOPLAY_INTERVAL_MS = 5000; // time each slide stays visible

const TRANSITION_DURATION_MS = typeof window !== "undefined" && window.innerWidth < 768 ? 500 : 700;

const FALLBACK_STORY = {
    title: "Loading...",
    description: "Please wait while we fetch the best short stories for you.",
    posterImage: fallbackImage,
    coverImage: fallbackImage,
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
const HomeGoodReadGrid = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Refs decouple interval logic from React re-renders
    const activeIndexRef = useRef(0);
    const isAnimatingRef = useRef(false);

    // ---------------------------------------------------------------------------
    // Data fetching
    // ---------------------------------------------------------------------------
    const { data, isLoading, isError } = useQuery({
        queryKey: ["topGoodReadsShortStory"],
        queryFn: listTopGoodReadsShortStory,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
    });

    const shortStories = data?.goodreads || [];

    // ---------------------------------------------------------------------------
    // Slide change handler
    // Blocks new changes while a transition is already running (prevents overlap)
    // ---------------------------------------------------------------------------
    const handleStoryChange = useCallback((index) => {
        if (index === activeIndexRef.current) return;
        if (isAnimatingRef.current) return;

        isAnimatingRef.current = true;
        setIsAnimating(true);

        setTimeout(() => {
            activeIndexRef.current = index;
            setActiveIndex(index);
            setIsAnimating(false);
            isAnimatingRef.current = false;
        }, TRANSITION_DURATION_MS);
    }, []);

    // ---------------------------------------------------------------------------
    // Autoplay — uses refs so interval never needs to be recreated
    // ---------------------------------------------------------------------------
    useEffect(() => {
        if (!shortStories.length) return;

        const timer = setInterval(() => {
            const nextIndex = (activeIndexRef.current + 1) % shortStories.length;
            handleStoryChange(nextIndex);
        }, AUTOPLAY_INTERVAL_MS);

        return () => clearInterval(timer);
    }, [shortStories.length, handleStoryChange]);

    // ---------------------------------------------------------------------------
    // Preload the next image so it's ready before the transition fires
    // ---------------------------------------------------------------------------
    useEffect(() => {
        if (!shortStories.length) return;

        const nextIndex = (activeIndex + 1) % shortStories.length;
        const nextStory = shortStories[nextIndex];
        const img = new Image();
        img.src = nextStory?.posterImage || nextStory?.coverImage;
    }, [activeIndex, shortStories]);

    // ---------------------------------------------------------------------------
    // Early returns
    // ---------------------------------------------------------------------------
    if (isError) return null;
    if (isLoading && !shortStories.length) return <SkeletonHero />;

    const activeStory = shortStories[activeIndex] || FALLBACK_STORY;

    // ---------------------------------------------------------------------------
    // Shared image class builder — avoids duplicating className strings
    // transition-opacity only (no blur, no transition-all) = smooth on mobile
    // ---------------------------------------------------------------------------
    const bgImageClass = `
    absolute inset-0 w-full h-full object-cover
    transition-opacity duration-500 md:duration-700 ease-out
    ${isAnimating ? "opacity-0" : "opacity-100"}
`;


    // ---------------------------------------------------------------------------
    // Render
    // ---------------------------------------------------------------------------
    return (
        <section className="relative w-full h-[100dvh] min-h-[600px] bg-[#050505] overflow-hidden text-white font-sans flex flex-col">

            {/* ── 1. BACKGROUND ─────────────────────────────────────────────── */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">

                {/* Mobile image (coverImage) */}
                <img
                    loading="lazy"
                    fetchPriority="low"
                    style={{ willChange: "opacity" }}
                    src={activeStory?.coverImage || activeStory?.posterImage || fallbackImage}
                    alt=""
                    className={`${bgImageClass} object-center block md:hidden`}
                />

                {/* Desktop image (posterImage) */}
                <img
                    loading="eager"
                    fetchPriority="high"
                    style={{ willChange: "opacity" }}
                    src={activeStory?.posterImage || activeStory?.coverImage || fallbackImage}
                    alt=""
                    className={`${bgImageClass} object-center hidden md:block`}
                />

                {/* Gradient overlays for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-transparent" />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            {/* ── 2. CONTENT ────────────────────────────────────────────────── */}
            <div className="relative z-10 flex-1 flex flex-col justify-end pb-24 lg:pb-32 px-6 md:px-12 w-full pt-32">
                <div
                    className={`
                        max-w-2xl
                        transition-opacity transition-transform duration-700 ease-out
                        ${isAnimating ? "opacity-0 translate-y-6" : "opacity-100 translate-y-0 sm:mt-28"}
                    `}
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm mb-6">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/70">
                            Editor's Choice #{activeIndex + 1}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-wide leading-[1.1] text-white mb-5 drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]">
                        {activeStory.title}
                    </h1>

                    {/* Metadata */}
                    <div className="flex items-center gap-3 text-xs md:text-sm text-white/60 mb-6">
                        <span className="flex items-center gap-1.5 text-white/80">
                            <User size={14} className="text-white/40" /> Must Try
                        </span>
                        <span className="opacity-40">•</span>
                        <span>{activeStory.genre || "Fiction"}</span>
                        <span className="opacity-40">•</span>
                        <span>Enjoy Reading</span>
                    </div>

                    {/* Description — hidden on mobile to keep layout tight */}
                    <p className="hidden sm:block text-sm md:text-base text-white/70 leading-relaxed max-w-lg mb-8 line-clamp-3 md:line-clamp-4">
                        {activeStory.description || activeStory.synopsis}
                    </p>

                    {/* CTA */}
                    <Link
                        to={`/story/${activeStory._id}`}
                        className="group inline-flex items-center justify-center gap-3 px-7 py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-full font-medium text-sm md:text-base transition-colors duration-300 shadow-[0_10px_30px_rgba(16,185,129,0.25)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.4)] w-full sm:w-auto"
                    >
                        <span>Start Reading</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                </div>
            </div>

            {/* ── 3. PAGINATION DOTS ────────────────────────────────────────── */}
            <div className="absolute bottom-8 right-6 md:right-12 lg:bottom-12 lg:right-24 z-20 flex items-center gap-1">
                {shortStories.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleStoryChange(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        className="group p-2 flex items-center justify-center cursor-pointer"
                    >
                        <div
                            className={`
                                h-2 sm:h-2.5 rounded-full transition-all duration-300 ease-out
                                ${index === activeIndex
                                    ? "w-8 sm:w-10 bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]"
                                    : "w-2 sm:w-2.5 bg-white/40 group-hover:bg-white/80"}
                            `}
                        />
                    </button>
                ))}
            </div>

        </section>
    );
};

export default memo(HomeGoodReadGrid);