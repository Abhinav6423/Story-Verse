import React, { memo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PlayCircle, Bookmark, Star, ChevronRight, Sparkles, BookOpen, Search, Menu, User, ArrowRight } from "lucide-react";
import { listTopGoodReadsShortStory } from "../../Api-calls/TopGoodreadsShortStory.js";
import HomeGoodReadCard from "./HomeGoodReadCard";

const SkeletonHero = () => (
    <section className="relative w-full h-[80vh] min-h-[600px] bg-zinc-900 animate-pulse flex">
        <div className="w-full lg:w-2/3 h-full bg-zinc-800/50" />
        {/* <div className="hidden lg:block w-1/3 h-full border-l border-white/5 bg-zinc-900" /> */}
    </section>
);

const HomeGoodReadGrid = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["topGoodReadsShortStory"],
        queryFn: listTopGoodReadsShortStory,
        staleTime: 1000 * 60 * 5,
    });

    const shortStories = data?.goodreads || [];

    console.log("HomeGoodReads are ", shortStories)



    const handleStoryChange = (index) => {
        if (index === activeIndex) return;
        setIsAnimating(true);
        setTimeout(() => {
            setActiveIndex(index);
            setIsAnimating(false);
        }, 300);
    };

    useEffect(() => {
        // Safety check: ensure stories exist
        if (!shortStories || shortStories.length === 0) return;

        const timer = setInterval(() => {
            // Calculate the next index. 
            // The '%' (modulo) operator ensures that when it reaches the end (e.g., 5), 
            // it wraps around back to 0.
            const nextIndex = (activeIndex + 1) % shortStories.length;
            handleStoryChange(nextIndex);
        }, 3000); // 3000 milliseconds = 3 seconds

        // Cleanup: Clear the timer when the component unmounts or the index changes.
        // This prevents multiple timers from running at once and resets the clock 
        // if the user manually clicks a dot.
        return () => clearInterval(timer);

    }, [activeIndex, shortStories.length, handleStoryChange]);

    if (isLoading) return <SkeletonHero />;
    if (isError || !shortStories.length) return null;

    const activeStory = shortStories[activeIndex];

    return (
        <section className="relative w-full h-[100dvh] min-h-[600px] bg-[#050505] overflow-hidden text-white font-sans flex flex-col">

            {/* =========================================================
               1. BACKGROUND LAYERS
            ========================================================= */}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">

                {/* Mobile */}
                <img
                    src={activeStory.coverImage || activeStory.posterImage}
                    alt="Background"
                    className={`
      absolute inset-0 w-full h-full 
      object-cover object-center
      transition-all duration-700 ease-out
      ${isAnimating ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}
      block md:hidden
      filter contrast-110 brightness-100 saturate-110
    `}
                />

                {/* Desktop */}
                <img
                    src={activeStory.posterImage || activeStory.coverImage}
                    alt="Background"
                    className={`
      absolute inset-0 w-full h-full 
      object-cover object-[65%_center]
      transition-all duration-700 ease-out
      ${isAnimating ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}
      hidden md:block
      filter contrast-110 brightness-100 saturate-110
    `}
                />

                {/* 🎯 LEFT TEXT SUPPORT (soft, not heavy) */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/45 to-transparent" />

                {/* 🎯 BOTTOM DEPTH */}
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" /> */}

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
                    <p className="text-sm font-medium md:text-base text-white/70 leading-relaxed max-w-lg mb-8 line-clamp-3 md:line-clamp-4">
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