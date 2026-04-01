import React, { memo, useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { User, ArrowRight } from "lucide-react";
import { listTopGoodReadsShortStory } from "../../Api-calls/TopGoodreadsShortStory.js";
import fallbackImage from "../../Assets/fallback.png";

// ─────────────────────────────────────────────────────────────────────────────
// Config — change these two numbers to tune the slideshow
// ─────────────────────────────────────────────────────────────────────────────
const SLIDE_DURATION_MS = 5000; // how long each slide stays
const FADE_DURATION_MS = 700;  // how long the crossfade takes

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
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Refs so the interval never needs to be torn down and recreated
    const activeIndexRef = useRef(0);
    const isTransitioningRef = useRef(false);

    // ── Data ────────────────────────────────────────────────────────────────
    const { data, isLoading, isError } = useQuery({
        queryKey: ["topGoodReadsShortStory"],
        queryFn: listTopGoodReadsShortStory,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
    });

    const slides = data?.goodreads || [];

    // ── Slide change ────────────────────────────────────────────────────────
    // Fades out → swaps index → fades in
    // Blocked while a transition is already running
    const goToSlide = useCallback((index) => {
        if (index === activeIndexRef.current) return;
        if (isTransitioningRef.current) return;

        isTransitioningRef.current = true;
        setIsTransitioning(true);

        setTimeout(() => {
            activeIndexRef.current = index;
            setActiveIndex(index);
            setIsTransitioning(false);
            isTransitioningRef.current = false;
        }, FADE_DURATION_MS);
    }, []);

    // ── Autoplay ────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!slides.length) return;
        const timer = setInterval(() => {
            const next = (activeIndexRef.current + 1) % slides.length;
            goToSlide(next);
        }, SLIDE_DURATION_MS);
        return () => clearInterval(timer);
    }, [slides.length, goToSlide]);

    // ── Early returns ───────────────────────────────────────────────────────
    if (isError) return null;
    if (isLoading && !slides.length) return <Skeleton />;

    const activeSlide = slides[activeIndex];

    // ─────────────────────────────────────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────────────────────────────────────
    return (
        <section className="relative w-full h-[100dvh] min-h-[600px] bg-[#050505] overflow-hidden text-white font-sans">

            {/* ── BACKGROUND IMAGES ─────────────────────────────────────────────
            All images in DOM, only active one visible.
            Netflix uses a strong bottom fade + subtle left fade for text area.
        ──────────────────────────────────────────────────────────────────── */}
            <div className="absolute inset-0">
                {slides.map((slide, index) => (
                    <React.Fragment key={slide._id}>

                        {/* Mobile — coverImage */}
                        <img
                            src={slide.coverImage || fallbackImage}
                            alt=""
                            className={`
                    absolute inset-0 w-full h-full object-cover object-top
                    transition-opacity ease-out block md:hidden
                    ${index === activeIndex ? "opacity-100" : "opacity-0"}
                `}
                            style={{ transitionDuration: `${FADE_DURATION_MS}ms`, willChange: "opacity" }}
                        />

                        {/* Desktop — posterImage */}
                        <img
                            src={slide.posterImage || fallbackImage}
                            alt=""
                            className={`
                    absolute inset-0 w-full h-full object-cover object-top
                    transition-opacity ease-out hidden md:block
                    ${index === activeIndex ? "opacity-100" : "opacity-0"}
                `}
                            style={{ transitionDuration: `${FADE_DURATION_MS}ms`, willChange: "opacity" }}
                        />

                    </React.Fragment>
                ))}

                {/* Netflix-style gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-[#050505]/20 to-transparent" />
                <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#050505]/60 to-transparent" />
            </div>

            {/* ── CONTENT ───────────────────────────────────────────────────────── */}
            <div className="relative z-10 h-full flex flex-col justify-end pb-16 lg:pb-24 px-8 md:px-14 lg:px-20">
                <div
                    className="max-w-lg"
                    style={{
                        opacity: isTransitioning ? 0 : 1,
                        transform: isTransitioning ? "translateY(20px)" : "translateY(0)",
                        transition: `opacity ${FADE_DURATION_MS}ms ease-out, transform ${FADE_DURATION_MS}ms ease-out`,
                    }}
                >
                    {/* Genre tags */}
                    <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold uppercase tracking-[0.3em] backdrop-blur-sm">
                            {activeSlide?.category || "Fiction"}
                        </span>
                        <span className="text-white/20 text-xs">|</span>
                        <span className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-medium">
                            Preface Choice
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05] text-white mb-3 drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]">
                        {activeSlide?.title}
                    </h1>

                    {/* Description — 2 lines max, not 3 */}
                    <p className="hidden sm:block text-sm md:text-[15px] text-white/60 leading-relaxed max-w-sm mb-8 line-clamp-2">
                        {(activeSlide?.description || activeSlide?.synopsis || "").slice(0, 300)}
                    </p>

                    {/* CTAs — auto width, not full width */}
                    <div className="flex items-center gap-3">
                        <Link
                            to={`/story/${activeSlide?._id}`}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-white/90 text-black rounded-md font-semibold text-sm transition-colors duration-200 whitespace-nowrap"
                        >
                            <ArrowRight size={16} />
                            Start Reading
                        </Link>

                    </div>
                </div>
            </div>

            {/* ── PAGINATION DOTS ───────────────────────────────────────────────── 
            Netflix puts these bottom-right, thin progress lines not dots
        ──────────────────────────────────────────────────────────────────── */}
            <div className="absolute bottom-8 right-8 md:right-14 lg:right-20 z-20 flex items-center gap-1.5">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        className="group p-1.5 flex items-center justify-center"
                    >
                        <div className={`
                        h-[3px] rounded-full transition-all duration-300
                        ${index === activeIndex
                                ? "w-8 bg-emerald-400"
                                : "w-3 bg-white/30 group-hover:bg-white/60"}
                    `} />
                    </button>
                ))}
            </div>

            {/* ── SLIDE COUNTER — Netflix style top-right ───────────────────────── */}
            <div className="absolute top-6 right-8 md:right-14 z-20 text-white/40 text-xs tracking-widest font-medium">
                {String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </div>

        </section>
    );
};

export default memo(HomeGoodReadGrid);