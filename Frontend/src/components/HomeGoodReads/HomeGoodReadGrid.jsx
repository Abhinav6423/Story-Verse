import React, { memo, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { User, ArrowRight } from "lucide-react";
import { listTopGoodReadsShortStory } from "../../Api-calls/TopGoodreadsShortStory.js";
import fallbackImage from "../../Assets/fallback.png";
// import HomeGoodReadCard from "./HomeGoodReadCard";

const SkeletonHero = () => (
    <section className="relative w-full h-[100dvh] min-h-[600px] overflow-hidden bg-[#050505]">

        {/* 🔥 FAKE BACKGROUND (blur + gradient instead of blank) */}
        <div className="absolute inset-0">
            <div className="w-full h-full bg-gradient-to-r from-black via-zinc-900 to-black opacity-80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.05),transparent_60%)]" />
        </div>

        {/* 🔥 SHIMMER EFFECT */}
        <div className="absolute inset-0 animate-pulse">
            <div className="w-full h-full bg-zinc-800/40" />
        </div>

        {/* 🔥 CONTENT PLACEHOLDER */}
        <div className="relative z-10 flex flex-col justify-end h-full px-6 md:px-12 lg:px-12 pb-24 lg:pb-32">

            <div className="max-w-2xl space-y-4">

                {/* Badge */}
                <div className="h-4 w-32 bg-zinc-700 rounded-full animate-pulse" />

                {/* Title lines */}
                <div className="space-y-3">
                    <div className="h-10 w-[90%] bg-zinc-700 rounded-md animate-pulse" />
                    <div className="h-10 w-[70%] bg-zinc-700 rounded-md animate-pulse" />
                </div>

                {/* Metadata */}
                <div className="h-4 w-48 bg-zinc-700 rounded-full animate-pulse" />

                {/* Description */}
                <div className="space-y-2">
                    <div className="h-3 w-full bg-zinc-700 rounded animate-pulse" />
                    <div className="h-3 w-[90%] bg-zinc-700 rounded animate-pulse" />
                    <div className="h-3 w-[75%] bg-zinc-700 rounded animate-pulse" />
                </div>

                {/* Button */}
                <div className="h-10 w-40 bg-zinc-600 rounded-full animate-pulse mt-4" />

            </div>
        </div>
    </section>
);

const HomeGoodReadGrid = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["topGoodReadsShortStory"],
        queryFn: listTopGoodReadsShortStory,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false, // ✅ avoid unnecessary refetch
    });



    const shortStories = data?.goodreads || [];

    // ✅ FIX 1: memoize function (important)
    const handleStoryChange = useCallback((index) => {
        if (index === activeIndex) return;
        setIsAnimating(true);
        setTimeout(() => {
            setActiveIndex(index);
            setIsAnimating(false);
        }, 300);
    }, [activeIndex]);

    // ✅ FIX 2: autoplay WITHOUT recreating interval
    useEffect(() => {
        if (!shortStories.length) return;

        const timer = setInterval(() => {
            const nextIndex = (activeIndex + 1) % shortStories.length;
            handleStoryChange(nextIndex);
        }, 2000);

        return () => clearInterval(timer);
    }, [activeIndex, shortStories.length, handleStoryChange]);


    // ✅ FIX 3: preload next image (GAME CHANGER)
    useEffect(() => {
        if (!shortStories.length) return;

        const nextIndex = (activeIndex + 1) % shortStories.length;
        const img = new Image();
        img.src =
            shortStories[nextIndex]?.posterImage ||
            shortStories[nextIndex]?.coverImage;
    }, [activeIndex, shortStories]);



    if (isError) return null;

    // ✅ FIX 5: don't block UI completely on loading
    const activeStory = shortStories[activeIndex] || {
        title: "Loading...",
        description: "Please wait while we fetch the best short stories for you.",
        posterImage: fallbackImage,
        coverImage: fallbackImage,
    };

    // if (isLoading && !shortStories.length) return <SkeletonHero />;


    return (
        <section className="relative w-full h-[100dvh] min-h-[600px] bg-[#050505] overflow-hidden text-white font-sans flex flex-col">

            {/* =========================================================
               1. BACKGROUND LAYERS
            ========================================================= */}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">

                {/* Mobile */}
                <img
                    loading="eager"
                    fetchPriority="high"

                    src={
                        activeStory?.coverImage ||
                        activeStory?.posterImage ||
                        fallbackImage
                    }
                    alt="Background"
                    className={`
      absolute inset-0 w-full h-full 
      object-cover object-center
      transition-all duration-700 ease-out
      ${isAnimating ? 'opacity-0 scale-105 blur-sm' : 'opacity-100 scale-100 blur-0'}
      block md:hidden
      filter contrast-110 brightness-100 saturate-110
    `}
                />

                {/* Desktop */}
                <img
                    loading="eager"
                    fetchPriority="high"
                    src={
                        activeStory?.posterImage ||
                        activeStory?.coverImage ||
                        fallbackImage
                    }
                    alt="Background"
                    className={`
      absolute inset-0 w-full h-full 
      object-cover object-[65%_center]
      transition-all duration-700 ease-out
      ${isAnimating ? 'opacity-0 scale-105 blur-sm' : 'opacity-100 scale-100 blur-0'}
      hidden md:block
      filter contrast-110 brightness-100 saturate-110
    `}
                />

                {/* 🎯 LEFT TEXT SUPPORT (soft, not heavy) */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/15 to-transparent" />

                {/* 🎯 BOTTOM DEPTH */}
                <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />

                {/* 🎯 TOP NAV FADE */}
                {/* <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/30 to-transparent" /> */}

                {/* 🎯 CINEMATIC VIGNETTE (KEY DIFFERENCE 🔥) */}
                {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,transparent_0%,rgba(0,0,0,0.65)_100%)]" /> */}

            </div>

            {/* =========================================================
               2. MAIN CONTENT
            ========================================================= */}

            <div className="relative z-10 flex-1 flex flex-col justify-end pb-24 lg:pb-32 px-6 md:px-12 lg:px-12 w-full mx-auto pt-32">
                <div className={`max-w-2xl transition-all duration-700 ease-out ${isAnimating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0 sm:mt-28'}`}>

                    {/* Badge (cleaned) */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm mb-6">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/70">
                            Editor’s Choice #{activeIndex + 1}
                        </span>
                    </div>

                    {/* Title (cinematic) */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-wide leading-[1.1] text-white mb-5 drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]">
                        {activeStory.title}
                    </h1>

                    {/* Metadata (lighter) */}
                    <div className="flex items-center gap-3 text-xs md:text-sm text-white/60 mb-6">
                        <span className="flex items-center gap-1.5 text-white/80">
                            <User size={14} className="text-white/40" /> Must Try
                        </span>
                        <span className="opacity-40">•</span>
                        <span>{activeStory.genre || "Fiction"}</span>
                        <span className="opacity-40">•</span>
                        <span>Enjoy Reading</span>
                    </div>

                    {/* Description (clean + readable) */}
                    <p className="hidden sm:block text-sm font-medium md:text-base text-white/70 leading-relaxed max-w-lg mb-8 line-clamp-3 md:line-clamp-4">
                        {activeStory.description || activeStory.synopsis}
                    </p>

                    {/* CTA (slightly refined) */}
                    <Link
                        to={`/story/${activeStory._id}`}
                        className="group inline-flex items-center justify-center gap-3 px-7 py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-full font-medium text-sm md:text-base transition-all duration-300 shadow-[0_10px_30px_rgba(16,185,129,0.25)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 w-full sm:w-auto"
                    >
                        <span>Start Reading</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                </div>
            </div>

            {/* =========================================================
               3. PAGINATION DOTS (Bottom Right)
            ========================================================= */}
            <div className="absolute bottom-8 right-6 md:right-12 lg:bottom-12 lg:right-24 z-20 flex items-center gap-1">
                {shortStories.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleStoryChange(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        // The button acts as a large, invisible clickable area (touch target)
                        className="group p-2 flex items-center justify-center cursor-pointer"
                    >
                        {/* The inner div is the actual visible dot/pill */}
                        <div
                            className={`
                    h-2 sm:h-2.5 rounded-full transition-all duration-300 ease-out drop-shadow-md
                    ${index === activeIndex
                                    ? 'w-8 sm:w-10 bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]'
                                    : 'w-2 sm:w-2.5 bg-white/40 group-hover:bg-white/100 group-hover:scale-125'}
                `}
                        />
                    </button>
                ))}
            </div>

        </section>
    );
};

export default memo(HomeGoodReadGrid);