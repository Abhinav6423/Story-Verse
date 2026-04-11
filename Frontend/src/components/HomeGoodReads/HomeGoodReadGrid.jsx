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

            {/* MAIN FLEX CONTAINER */}
            <div className="relative z-10 flex w-full h-full lg:flex-row">

                {/* BACKGROUND IMAGE 
                    On Mobile/Tablet: Absolute positioning to cover 100% of the screen.
                    On Desktop (lg): Switches to relative, taking up the left 60%.
                */}
                <div className="absolute inset-0 lg:relative w-full lg:w-3/5 h-full overflow-hidden z-0">
                    {slides.map((slide, index) => (
                        <img
                            key={slide._id}
                            src={slide.coverImage}
                            alt={slide.title}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${index === activeIndex ? "opacity-100" : "opacity-0"
                                }`}
                        />
                    ))}

                    {/* Mobile/Tablet Gradient (Bottom to Top) - Crucial for readable text! */}
                    {/* Made it slightly taller (via-black/90) so text never touches the bright parts of the image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent/10 lg:hidden z-10" />

                    {/* Desktop Gradient (Right to Left) */}
                    <div className="hidden lg:block absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-black via-black/80 to-transparent z-10" />
                </div>

                {/* TEXT CONTENT
                    On Mobile/Tablet: Flex-col, pushed to the bottom (justify-end) with padding.
                    On Desktop (lg): Centered vertically, taking the right 40%.
                */}
                <div className="relative z-20 w-full lg:w-2/5 h-full flex flex-col justify-end lg:justify-center px-6 sm:px-10 lg:px-12 pb-28 sm:pb-36 lg:pb-0 lg:bg-black/40 xl:bg-black pointer-events-none">

                    {/* Desktop only glass effect */}
                    <div className="hidden lg:block absolute inset-0 bg-black/50 backdrop-blur-2xl border-none shadow-[-30px_0_50px_rgba(0,0,0,0.8)] z-0" />

                    {/* CONTENT BOX - Add pointer-events-auto so buttons still work! */}
                    <div className="relative z-10 w-full max-w-lg lg:max-w-md mx-auto lg:mx-0 pointer-events-auto">

                        {/* IMMERSIVE GENRE BADGE */}
                        <div className="mb-3 lg:mb-4 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                            <span className="text-xs sm:text-sm font-semibold text-emerald-400/90 uppercase tracking-widest">
                                {activeSlide?.category || "ARCHIVE SELECTION"} • {activeSlide?.year || "IMMERSIVE READ"}
                            </span>
                        </div>

                        {/* TITLE */}
                        <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold mb-3 lg:mb-4 leading-tight text-white drop-shadow-lg">
                            {activeSlide?.title}
                        </h1>

                        {/* DESCRIPTION */}
                        <p className="text-sm sm:text-base text-gray-300 mb-6 lg:mb-8 line-clamp-3 lg:line-clamp-4 leading-relaxed font-light drop-shadow-md">
                            {activeSlide?.description || activeSlide?.synopsis}
                        </p>

                        {/* CTA BUTTONS */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-2 lg:mb-5">
                            <Link
                                to={`/story/${activeSlide?._id}`}
                                className="px-6 sm:px-8 py-3.5 bg-white text-black font-bold rounded-xl text-sm sm:text-base hover:bg-gray-200 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                Start Reading
                            </Link>

                            <Link to={`/reels`} className="w-full sm:w-auto">
                                <button className="w-full px-6 sm:px-8 py-3.5 bg-black/40 lg:bg-transparent backdrop-blur-md text-white font-medium rounded-xl text-sm sm:text-base hover:bg-white/10 transition-colors duration-300 flex items-center justify-center gap-2 border border-white/20">
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

            {/* LARGER NAVIGATION BUTTONS */}
            <div className="absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between px-2 sm:px-4 lg:px-6 pointer-events-none">
                <button
                    onClick={handlePrev}
                    className="pointer-events-auto w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 border border-white/10"
                >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button
                    onClick={handleNext}
                    className="pointer-events-auto w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 border border-white/10"
                >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* LARGER DOTS PAGINATION */}
            <div className="absolute bottom-20 sm:bottom-28 lg:bottom-6 left-0 right-0 z-20 flex justify-center gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`transition-all duration-300 rounded-full ${index === activeIndex
                            ? "w-10 h-1.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                            : "w-6 h-1.5 bg-white/30 hover:bg-white/50"
                            }`}
                    />
                ))}
            </div>
        </section>
    )
};

export default memo(HomeGoodReadGrid);