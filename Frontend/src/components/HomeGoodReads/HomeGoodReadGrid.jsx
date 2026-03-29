import React, { memo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PlayCircle, Bookmark, Star, ChevronRight, Sparkles, BookOpen, Search, Menu, User, ArrowRight } from "lucide-react";
import { listTopGoodReadsShortStory } from "../../Api-calls/TopGoodreadsShortStory.js";
import HomeGoodReadCard from "./HomeGoodReadCard";

const SkeletonHero = () => (
    <section className="relative w-full h-[80vh] min-h-[600px] bg-zinc-900 animate-pulse flex">
        <div className="w-full lg:w-2/3 h-full bg-zinc-800/50" />
        <div className="hidden lg:block w-1/3 h-full border-l border-white/5 bg-zinc-900" />
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
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {/* Mobile (coverImage) */}
                <img
                    src={activeStory.coverImage || activeStory.posterImage}
                    alt="Background"
                    className={`
    absolute inset-0 w-full h-full object-cover object-center
    transition-all duration-700 ease-out
    ${isAnimating ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}
    block md:hidden
  `}
                />

                {/* Desktop (posterImage) */}
                <img
                    src={activeStory.posterImage || activeStory.coverImage}
                    alt="Background"
                    className={`
    absolute inset-0 w-full h-full object-cover object-center
    transition-all duration-700 ease-out
    ${isAnimating ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}
    hidden md:block
  `}
                />

                {/* NEW GRADIENTS: Clear at the top/right, dark at the bottom/left for text */}
                {/* 1. Strong bottom-to-top gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent h-[70%] top-auto bottom-0" />

                {/* 2. Left-to-right gradient to protect text legibility, fading out smoothly */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-[#050505]/10 to-transparent w-full md:w-3/4" />

                {/* 3. Very subtle top gradient just for the navbar area */}
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/10 to-transparent" />
            </div>

            {/* =========================================================
               2. MAIN CONTENT
            ========================================================= */}

            <div className="relative z-10 flex-1 flex flex-col justify-end pb-24 lg:pb-32 px-6 md:px-12 lg:px-12 w-full mx-auto pt-32">
                <div className={`max-w-3xl transition-all duration-700 ease-out ${isAnimating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0  sm:mt-29' }`}>

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-lg">
                        <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                            <Sparkles size={10} className="text-[#050505]" />
                        </div>
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-zinc-200">
                            Editor's Choice #{activeIndex + 1}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-white drop-shadow-2xl mb-4">
                        {activeStory.title}
                    </h1>

                    {/* Metadata */}
                    <div className="flex items-center gap-3 text-xs md:text-sm font-medium text-zinc-300 mb-6 drop-shadow-md">
                        <span className="flex items-center gap-1.5 text-zinc-100">
                            <User size={14} className="text-zinc-400" /> Must Try
                        </span>
                        <span className="text-zinc-500">•</span>
                        <span>{activeStory.genre || "Fiction"}</span>
                        <span className="text-zinc-500">•</span>
                        <span>Enjoy Reading</span>
                    </div>

                    {/* Description */}
                    <p className="text-sm md:text-base text-zinc-300 leading-relaxed max-w-2xl drop-shadow-lg mb-8 line-clamp-3 md:line-clamp-4 font-semibold">
                        {activeStory.description || activeStory.synopsis}
                    </p>



                    {/* Primary CTA */}
                    <Link
                        to={`/story/${activeStory._id}`}
                        className="group inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-full font-bold text-sm md:text-base transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 w-full sm:w-auto"
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