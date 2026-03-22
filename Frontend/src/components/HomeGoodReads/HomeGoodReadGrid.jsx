import React, { memo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PlayCircle, Bookmark, Star, ChevronRight, Sparkles, BookOpen } from "lucide-react";
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

    const shortStories = data?.goodreads?.map(gr => gr.story) || [];

    const handleStoryChange = (index) => {
        if (index === activeIndex) return;
        setIsAnimating(true);
        setTimeout(() => {
            setActiveIndex(index);
            setIsAnimating(false);
        }, 300);
    };

    if (isLoading) return <SkeletonHero />;
    if (isError || !shortStories.length) return null;

    const activeStory = shortStories[activeIndex];

    return (
        <section className="relative w-full min-h-[100dvh] lg:h-[85vh] lg:min-h-[600px] lg:max-h-[900px] bg-[#050505] overflow-hidden text-white group font-sans flex flex-col">

            {/* =========================================================
           1. BACKGROUND LAYERS
        ========================================================= */}
            <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">

                {/* --- Layer B: Sharp Subject Image --- */}
                <div className="absolute inset-0 w-full h-full">
                    <img
                        src={activeStory.coverImage || activeStory.image}
                        alt="Background"
                        className={`
                absolute left-0 top-0 h-full w-full lg:w-[65%]
                object-cover object-top
                transition-all duration-700 ease-out
                ${isAnimating
                                ? 'opacity-0 translate-y-2 scale-[1.01]'
                                : 'opacity-100 translate-y-0 scale-100'
                            }
            `}
                    />
                </div>

                {/* --- Seamless Right Blend (fix harsh cut) --- */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-black pointer-events-none" />

                {/* --- Dark Tint Overlay (lighter for clarity) --- */}
                <div
                    className={`
            absolute inset-0 bg-black/10
            transition-opacity duration-700
            ${isAnimating ? 'opacity-0' : 'opacity-100'}
        `}
                />

                {/* --- Premium Main Gradient --- */}
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#050505] via-[#050505]/30 lg:via-[#050505]/20 to-transparent" />

                {/* --- Top Fade --- */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#050505]/80 to-transparent" />

                {/* --- Bottom Green Blend --- */}
                <div className="absolute bottom-0 left-0 w-full h-32 md:h-48 bg-gradient-to-t from-[#061510] via-[#061510]/90 to-transparent z-10" />

                {/* --- Subtle Film Grain (Depth) --- */}
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('/noise.png')]" />

            </div>

            {/* =========================================================
           2. MAIN CONTENT GRID
        ========================================================= */}
            <div className="relative z-20 w-full h-full flex-1 max-w-[1920px] mx-auto flex flex-col lg:flex-row">

                {/* --- LEFT COL: HERO TEXT --- */}
                <div className="flex-1 flex flex-col justify-end lg:justify-center px-6 md:px-12 lg:px-20 pt-32 pb-8 lg:pt-0 lg:pb-0 relative z-30">
                    {/* Tighter space-y to keep elements connected but breathing */}
                    <div className={`space-y-5 md:space-y-6 max-w-2xl transition-all duration-700 ease-out ${isAnimating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>

                        <div className="flex items-center gap-3">
                            <div className="px-3 md:px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2 shadow-lg">
                                <Sparkles size={12} className="text-amber-400 fill-amber-400" />
                                {/* Refined badge sizing and wider tracking */}
                                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-200">
                                    Editor's Choice #{activeIndex + 1}
                                </span>
                            </div>
                        </div>

                        {/* Premium Title: Scaled down from 7xl/6xl to 5xl/4xl, tighter line-height, sophisticated weight */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.1] text-white drop-shadow-xl">
                            {activeStory.title}
                        </h1>

                        {/* Refined Metadata: Scaled down slightly, softer colors */}
                        <div className="flex flex-wrap items-center gap-2.5 md:gap-3 text-xs md:text-sm font-medium text-zinc-400">
                            <span className="text-amber-400 flex items-center gap-1.5 font-bold bg-amber-400/10 px-2 py-0.5 rounded-md">
                                <Star size={12} fill="currentColor" /> 98% Match
                            </span>
                            <span className="w-1 h-1 rounded-full bg-zinc-600" />
                            <span className="text-zinc-200">{activeStory.genre || "Fiction"}</span>
                            <span className="w-1 h-1 rounded-full bg-zinc-600" />
                            <span className="text-zinc-200">5 min read</span>
                        </div>

                        {/* Highly Visible Hook Line: Border accent, brighter text, elegant line-height */}
                        <div className="pl-4 md:pl-5 border-l-2 border-emerald-500/60 py-1 mt-2">
                            <p className="text-sm sm:text-base md:text-[1.1rem] text-zinc-100 leading-[1.7] md:leading-[1.8] line-clamp-3 md:line-clamp-4 drop-shadow-md overflow-hidden tracking-wide">
                                {activeStory.description || activeStory.synopsis}
                            </p>
                        </div>

                        {/* Refined Buttons: Scaled down text (text-sm), elegant padding */}
                        <div className="flex items-center gap-3 pt-3 md:pt-4">
                            <Link
                                to={`/story/${activeStory._id}`}
                                className="group flex items-center justify-center gap-2 px-6 md:px-8 py-2.5 md:py-3 bg-white hover:bg-zinc-100 text-black rounded-full font-semibold text-sm md:text-base transition-all duration-300 shadow-[0_8px_30px_rgba(255,255,255,0.15)] hover:shadow-[0_8px_40px_rgba(255,255,255,0.25)] hover:-translate-y-0.5 w-full sm:w-auto"
                            >
                                <BookOpen size={18} className="text-black group-hover:scale-110 transition-transform duration-300" />
                                <span>Start Reading</span>
                            </Link>

                            
                        </div>
                    </div>

                    {/* === MOBILE/TABLET ONLY: THUMBNAIL CAROUSEL === */}
                    <div className="lg:hidden mt-8 md:mt-10 w-full pb-2 z-40">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] drop-shadow-md">More Top Reads</p>
                        </div>
                        <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x relative z-50">
                            {shortStories.map((story, index) => (
                                <button
                                    key={story._id}
                                    onClick={() => handleStoryChange(index)}
                                    className={`
                                    snap-start flex-shrink-0 relative w-24 h-36 md:w-28 md:h-40 rounded-xl overflow-hidden transition-all duration-500
                                    ${index === activeIndex
                                            ? 'ring-2 ring-emerald-400 scale-100 shadow-[0_8px_20px_rgba(16,185,129,0.3)] opacity-100'
                                            : 'ring-1 ring-white/10 opacity-50 hover:opacity-100 scale-95'}
                                `}
                                >
                                    <img
                                        src={story.coverImage}
                                        alt={story.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {index !== activeIndex && <div className="absolute inset-0 bg-black/50 transition-colors hover:bg-black/20" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- DESKTOP RIGHT COL: SIDEBAR LIST --- */}
                <div className="hidden lg:flex w-[420px] xl:w-[480px] h-full flex-col border-l border-white/5 bg-black/40 backdrop-blur-2xl pt-8 pb-12 px-8 overflow-y-auto scrollbar-hide relative z-30">
                    <div className="flex items-center justify-between mb-4 sticky top-0 z-40 py-4 bg-gradient-to-b from-black via-black/90 to-transparent">
                        <h3 className="text-[11px] mt-15 md:text-[12px] font-bold text-zinc-300 uppercase tracking-[0.2em] flex items-center gap-2 drop-shadow-md">
                            Top Trends
                        </h3>
                    </div>

                    <div className="flex flex-col gap-3 relative z-30">
                        {shortStories.map((story, index) => (
                            <div
                                key={story._id}
                                onClick={() => handleStoryChange(index)}
                                className={`
                                group relative transition-all duration-300 cursor-pointer rounded-2xl p-2
                                ${index === activeIndex
                                        ? 'bg-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/10'
                                        : 'hover:bg-white/5 border border-transparent'}
                            `}
                            >
                                {index === activeIndex && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-emerald-400 rounded-r-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                                )}
                                <div className={`transition-opacity duration-300 ${index === activeIndex ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                                    <HomeGoodReadCard story={story} rank={index + 1} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="sticky bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#061510] to-transparent pointer-events-none mt-auto z-40" />
                </div>

            </div>
        </section>
    );
};

export default memo(HomeGoodReadGrid);