import React, { memo, useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { User, ArrowRight } from "lucide-react";
import { listTopGoodReadsShortStory } from "../../Api-calls/TopGoodreadsShortStory.js";
import fallbackImage from "../../Assets/fallback.png";


// ─────────────────────────────────────────────────────────────────────────────
// Skeleton — shown while API is loading
// ─────────────────────────────────────────────────────────────────────────────
const Skeleton = () => (
    <section className="relative w-full h-[100dvh] min-h-[600px] overflow-hidden bg-[#050505]">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-zinc-900 to-black opacity-80" />
        <div className="absolute inset-0 animate-pulse bg-zinc-800/40" />
        <div className="relative z-10 flex flex-col justify-end h-full px-6 md:px-12 pb-24 lg:pb-32">
            <div className="max-w-2xl space-y-4">
                <div className="h-4 w-32 bg-zinc-700 rounded-full animate-pulse" />
                <div className="h-10 w-[80%] bg-zinc-700 rounded-md animate-pulse" />
                <div className="h-10 w-[60%] bg-zinc-700 rounded-md animate-pulse" />
                <div className="h-4 w-48 bg-zinc-700 rounded-full animate-pulse" />
                <div className="h-10 w-36 bg-zinc-600 rounded-full animate-pulse" />
            </div>
        </div>
    </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
const HomeGoodReadGrid = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    // ── Data ────────────────────────────────────────────────────────────────
    const { data, isLoading, isError } = useQuery({
        queryKey: ["topGoodReadsShortStory"],
        queryFn: listTopGoodReadsShortStory,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
    });

    const slides = data?.goodreads || [];

    // ── Control Slideshow ────────────────────────────────────────────────────
    const handleNext = useCallback(() => {
        if (!slides.length) return;

        setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, [slides.length]);

    const handlePrev = useCallback(() => {
        setActiveIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    }, [slides.length]);

    useEffect(() => {
        if (!slides.length) return;

        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [slides.length]);


    // ── Early returns ───────────────────────────────────────────────────────
    if (isError) return null;
    if (isLoading && !slides.length) return <Skeleton />;

    const activeSlide = slides[activeIndex];




    // ─────────────────────────────────────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────────────────────────────────────
    return (
        <section className="relative w-full h-[100dvh] bg-black overflow-hidden">



            {/* MAIN FLEX CONTAINER - Left Image + Right Content */}
            <div className="relative z-10 flex flex-col md:flex-row w-full h-full">

                {/* LEFT SIDE - IMAGE (60% width on desktop) */}
                <div className="relative w-full md:w-3/5 h-1/2 md:h-full overflow-hidden">
                    {slides.map((slide, index) => (
                        <img
                            key={slide._id}
                            src={slide.coverImage}
                            alt={slide.title}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${index === activeIndex ? "opacity-100" : "opacity-0"
                                }`}
                        />
                    ))}

                    {/* Gradient overlay for better text visibility on mobile */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />
                </div>

                {/* RIGHT SIDE - TEXT & BLUR EFFECT (40% width on desktop) */}
                <div className="relative w-full md:w-2/5 h-1/2 md:h-full flex items-center justify-center px-6 sm:px-8 md:px-10 lg:px-12 py-8 md:py-0">

                    {/* CINEMATIC FROSTED GLASS EFFECT */}

                    <div className="absolute inset-0 bg-black/30 backdrop-blur-2xl md:backdrop-blur-[40px] border-l border-white/5 shadow-[-20px_0_30px_rgba(0,0,0,0.5)]" />

                    {/* CONTENT BOX */}
                    <div className="relative z-10 w-full max-w-md mx-auto md:mx-0">

                        {/* GENRE BADGE */}
                        <div className="mb-3 md:mb-4 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div>
                            <span className="text-xs sm:text-sm font-semibold text-white/70 uppercase tracking-widest">
                                {activeSlide?.category || "MOVIE"} • {activeSlide?.year || "2025"}
                            </span>
                        </div>

                        {/* TITLE */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 leading-tight text-white drop-shadow-md">
                            {activeSlide?.title}
                        </h1>

                        {/* GENRE TAGS */}
                        <div className="flex flex-wrap gap-1 md:gap-2 mb-4 md:mb-5">
                            {activeSlide?.genres?.map((genre, i) => (
                                <span key={i} className="text-xs sm:text-sm px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white/80">
                                    {genre}
                                </span>
                            ))}
                        </div>

                        {/* DESCRIPTION */}
                        <p className="text-sm sm:text-base text-white/80 mb-6 md:mb-8 line-clamp-3 md:line-clamp-4 leading-relaxed font-light">
                            {activeSlide?.description || activeSlide?.synopsis}
                        </p>

                        {/* CTA BUTTONS */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-5">
                            <Link
                                to={`/story/${activeSlide?._id}`}
                                className="px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-black font-semibold rounded-xl text-sm sm:text-base hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(255,255,255,0.15)]"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                Start Reading
                            </Link>

                            <Link to={`/reels`}>
                                <button className="px-6 sm:px-8 py-3 sm:py-3.5 bg-black/20 backdrop-blur-md text-white font-medium rounded-xl text-sm sm:text-base hover:bg-black/40 transition-colors duration-300 flex items-center justify-center gap-2 border border-white/20 w-full">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Watch Trailers
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* LARGER NAVIGATION BUTTONS - Better for mobile touch */}
            <div className="absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between px-3 sm:px-4 md:px-6 pointer-events-none">

                {/* PREV BUTTON - Larger on mobile */}
                <button
                    onClick={handlePrev}
                    className="pointer-events-auto w-12 h-12 sm:w-14 sm:h-14 md:w-12 md:h-12 lg:w-14 lg:h-14 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl border border-white/10"
                >
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* NEXT BUTTON - Larger on mobile */}
                <button
                    onClick={handleNext}
                    className="pointer-events-auto w-12 h-12 sm:w-14 sm:h-14 md:w-12 md:h-12 lg:w-14 lg:h-14 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl border border-white/10"
                >
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* LARGER DOTS PAGINATION - Easy to tap on mobile */}
            <div className="absolute bottom-5 sm:bottom-6 md:bottom-6 left-0 right-0 z-20 flex justify-center gap-3 sm:gap-4 md:gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`transition-all duration-300 rounded-full ${index === activeIndex
                            ? "w-10 sm:w-12 md:w-8 h-1.5 sm:h-2 bg-white"
                            : "w-6 sm:w-8 md:w-5 h-1.5 sm:h-2 bg-white/30 hover:bg-white/50"
                            }`}
                    />
                ))}
            </div>

            {/* SLIDE COUNTER - Clean design */}
            <div className="absolute bottom-5 sm:bottom-6 right-4 sm:right-6 md:right-6 z-20 hidden md:flex items-center gap-1.5 text-white/50 text-sm font-mono bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <span className="text-white font-semibold">{String(activeIndex + 1).padStart(2, '0')}</span>
                <span className="text-white/40">/</span>
                <span>{String(slides.length).padStart(2, '0')}</span>
            </div>
        </section>
    )
};

export default memo(HomeGoodReadGrid);