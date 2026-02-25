import React, { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import TopTrendStoryCard from "./TopTrendStoryCard.jsx";
import { listTrendingShortStory } from "../../Api-calls/trendingShortStory.js";
import { FlameIcon } from "lucide-react";
import { Link } from "react-router-dom";

// 1. Skeleton Component prevents Layout Shift
const SkeletonGrid = () => (
    <div className="mt-0 px-4 md:px-6 bg-transparent text-white animate-pulse">
        <section className="py-6">
            {/* Header Skeleton */}
            <div className="mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-900/30" />
                <div className="h-6 w-48 bg-emerald-900/30 rounded" />
            </div>
            {/* Grid Skeleton */}
            <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-12">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="aspect-[2/3] bg-gray-800 rounded-xl" />
                ))}
            </div>
        </section>
    </div>
);

function TopTrendStoryGrid() {
    /* ================= QUERY ================= */
    const { data, isLoading } = useQuery({
        queryKey: ["trendingShortStory"],
        queryFn: listTrendingShortStory,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const stories = data?.shortStories || [];

    /* ================= CONDITIONAL ================= */
    if (isLoading) return <SkeletonGrid />;

    // Return nothing (but maintain layout flow) if no stories
    if (!stories.length) return null;

    return (
        <div className="relative mt-0 px-4 md:px-8 bg-transparent text-white min-h-[200px]">

            {/* === PREMIUM AMBIENT BACKGROUND SYSTEM === */}

            {/* 1. Subtle overall wash: Fades smoothly from a dark emerald hint into your base background */}
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/90 via-transparent to-transparent pointer-events-none z-0" />

            {/* 2. Primary soft glow: Wide, extremely blurred, and low opacity so it feels like calm light */}
            <div className="absolute top-[-20%] left-[5%] w-[70vw] h-[600px] bg-emerald-900/15 blur-[150px] rounded-[100%] pointer-events-none z-0" />

            {/* 3. Secondary balancing glow: Placed on the bottom right to carry the theme subtly across the section */}
            <div className="absolute bottom-[-20%] right-[-5%] w-[50vw] h-[500px] bg-teal-950/30 blur-[130px] rounded-[100%] pointer-events-none z-0" />

            {/* ================= TRENDING SECTION ================= */}
            <section className="relative z-10 py-6">

                {/* HEADER */}
                <div className="mb-8 flex items-end justify-between w-full">
                    <div className="flex items-center gap-3 md:gap-4">

                        {/* Premium Flame Badge */}
                        <div className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#0F1714]/80 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)] backdrop-blur-md shrink-0">
                            <FlameIcon
                                size={22}
                                className="text-emerald-400 fill-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse md:w-6 md:h-6"
                            />
                        </div>

                        {/* Typography Stack */}
                        <div className="flex flex-col justify-center">
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-emerald-600/80 mb-0.5 md:mb-1">
                                Curated For You
                            </span>
                            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-none">
                                Your Next <span className="text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.2)]">Obsession</span>
                            </h2>
                        </div>
                    </div>
                </div>

                {/* GRID */}
                <div className="
                p-2 sm:p-5
                grid
                grid-cols-2
                sm:grid-cols-3
                md:grid-cols-4
                lg:grid-cols-5
                gap-3 sm:gap-8 md:gap-12
            ">
                    {stories.map((story, idx) => (
                        <Link
                            key={story._id}
                            to={`/story/${story._id}`}
                            className="block transition-transform hover:-translate-y-1 duration-300"
                        >
                            <TopTrendStoryCard story={story} idx={idx} />
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default memo(TopTrendStoryGrid);