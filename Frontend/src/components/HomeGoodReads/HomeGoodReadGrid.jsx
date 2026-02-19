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
        <section className="relative w-full h-[90vh] md:h-[85vh] min-h-[600px] max-h-[900px] bg-[#050505] overflow-hidden text-white group font-sans">

            {/* =========================================================
               1. BACKGROUND LAYERS
            ========================================================= */}
            <div className="absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out">
                {/* Layer A: Atmosphere */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <img
                        src={activeStory.coverImage || activeStory.image}
                        alt="Atmosphere"
                        className="w-full h-full object-cover blur-[60px] scale-125 opacity-40 transition-opacity duration-700"
                    />
                </div>

                {/* Layer B: Sharp Subject */}
                <div className="absolute inset-0 w-full h-full">
                    <img
                        src={activeStory.coverImage || activeStory.image}
                        alt="Background"
                        key={activeStory._id}
                        className={`
                            absolute left-0 top-0 h-full w-[85%] md:w-[75%] lg:w-[65%] 
                            object-cover object-top
                            transition-all duration-700 ease-out
                            ${isAnimating ? 'opacity-0 scale-[1.02]' : 'opacity-90 scale-100'}
                        `}
                        style={{
                            // maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 30%, rgba(0,0,0,0.8) 50%, transparent 100%)',
                            // WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 30%, rgba(0,0,0,0.8) 50%, transparent 100%)'
                        }}
                    />
                </div>

                {/* Layer C: Premium Gradients */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 lg:via-[#050505]/60 to-transparent" />
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#050505]/80 to-transparent" />

                {/* --- SEAMLESS GREEN BLEND AT BOTTOM --- 
                    Uses a dark green/teal hex that matches the section below 
                */}
                <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#061510] via-[#061510]/80 to-transparent z-10" />
            </div>

            {/* =========================================================
               2. MAIN CONTENT GRID
            ========================================================= */}
            <div className="relative z-20 w-full h-full max-w-[1920px] mx-auto flex flex-col lg:flex-row">

                {/* --- LEFT COL: HERO TEXT --- */}
                <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-20 pt-24 lg:pt-0 relative">
                    <div className={`space-y-6 md:space-y-8 max-w-3xl transition-all duration-700 ease-out ${isAnimating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>

                        <div className="flex items-center gap-3">
                            <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2 shadow-lg">
                                <Sparkles size={14} className="text-amber-400 fill-amber-400" />
                                <span className="text-xs font-bold uppercase tracking-widest text-zinc-200">
                                    Editor's Choice #{activeIndex + 1}
                                </span>
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-white drop-shadow-2xl">
                            {activeStory.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm md:text-base font-medium text-zinc-400">
                            <span className="text-amber-400 flex items-center gap-1.5 font-bold bg-amber-400/10 px-2 py-0.5 rounded-md">
                                <Star size={16} fill="currentColor" /> 98% Match
                            </span>
                            <span className="w-1 h-1 rounded-full bg-zinc-600" />
                            <span className="text-zinc-200">{activeStory.genre || "Fiction"}</span>
                            <span className="w-1 h-1 rounded-full bg-zinc-600" />
                            <span className="text-zinc-200">5 min read</span>
                        </div>

                        <p className="text-lg md:text-xl text-zinc-300 leading-relaxed max-w-2xl line-clamp-3 md:line-clamp-4 drop-shadow-md font-light">
                            {activeStory.description || activeStory.synopsis}
                        </p>

                        <div className="flex items-center gap-4 pt-4">
                            <Link
                                to={`/story/${activeStory._id}`}
                                className="group flex items-center gap-3 px-8 py-3.5 bg-white hover:bg-zinc-100 text-black rounded-full font-bold text-base md:text-lg transition-all duration-300 shadow-[0_8px_30px_rgba(255,255,255,0.15)] hover:shadow-[0_8px_40px_rgba(255,255,255,0.25)] hover:-translate-y-0.5"
                            >
                                <BookOpen size={22} className="text-black group-hover:scale-110 transition-transform duration-300" />
                                <span>Start Reading</span>
                            </Link>

                            <button className="p-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                                <Bookmark size={22} className="text-zinc-200" />
                            </button>
                        </div>
                    </div>

                    {/* === MOBILE/TABLET ONLY: THUMBNAIL CAROUSEL === */}
                    <div className="lg:hidden mt-12 w-full pb-6 z-20">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">More Top Reads</p>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
                            {shortStories.map((story, index) => (
                                <button
                                    key={story._id}
                                    onClick={() => handleStoryChange(index)}
                                    className={`
                                        snap-start flex-shrink-0 relative w-28 h-40 rounded-xl overflow-hidden transition-all duration-500
                                        ${index === activeIndex
                                            ? 'ring-2 ring-emerald-400 scale-100 shadow-xl opacity-100'
                                            : 'ring-1 ring-white/10 opacity-50 hover:opacity-80 scale-95'}
                                    `}
                                >
                                    <img
                                        src={story.coverImage}
                                        alt={story.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {index !== activeIndex && <div className="absolute inset-0 bg-black/30 transition-colors" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- DESKTOP RIGHT COL: SIDEBAR LIST --- */}
                {/* Updated: Changed pt-24 to pt-8 so it sits cleanly at the top */}
                <div className="hidden lg:flex w-[420px] xl:w-[480px] h-full flex-col border-l border-white/5 bg-black/40 backdrop-blur-2xl pt-8 pb-12 px-8 overflow-y-auto scrollbar-hide relative z-20">

                    {/* Sticky Header fixed to the absolute top of the sidebar */}
                    <div className="flex items-center justify-between mb-4 sticky top-0 z-30 py-4 bg-gradient-to-b from-black/90 via-black/80 to-transparent">
                        <h3 className="text-base font-bold text-zinc-100 uppercase tracking-widest flex items-center gap-2 drop-shadow-md">
                            Top Trends
                        </h3>
                    </div>

                    <div className="flex flex-col gap-3">
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
                                {/* Active indicator line mapped to theme */}
                                {index === activeIndex && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-emerald-400 rounded-r-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                                )}
                                <div className={`transition-opacity duration-300 ${index === activeIndex ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                                    <HomeGoodReadCard story={story} rank={index + 1} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Fade Mask adapted to green theme */}
                    <div className="sticky bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#061510]/90 to-transparent pointer-events-none mt-auto" />
                </div>

            </div>
        </section>
    );
};

export default memo(HomeGoodReadGrid);