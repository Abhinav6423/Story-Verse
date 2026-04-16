import React, { memo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TopTrendStoryCard from "./TopTrendStoryCard.jsx";
import { listTrendingShortStory } from "../../Api-calls/trendingShortStory.js";
import { FlameIcon } from "lucide-react";
import { Link } from "react-router-dom";
import StoryDetsPopup from "../../utils/StoryDetsPopup.jsx";
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

    const [quickViewStory, setQuickViewStory] = useState(null);

    /* ================= CONDITIONAL ================= */
    if (isLoading) return <SkeletonGrid />;

    // Return nothing (but maintain layout flow) if no stories
    if (!stories.length) return null;

    return (
        // Standardized the container width and padding so everything inside aligns flawlessly
        <div className="relative mt-0 pt-4 md:pt-6 bg-transparent text-white min-h-[200px] w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">

            {/* ================= TRENDING SECTION ================= */}
            {/* Added massive bottom padding (pb-32/pb-40) to clear the floating "Last Visited" player */}
            <section className="relative z-10 pb-32 md:pb-40 pt-0 w-full">

                {/* HEADER */}
                <div className="mb-8 md:mb-10 flex items-center w-full">
                    <div className="flex items-center gap-4 md:gap-5">

                        {/* Flame Badge */}
                        <div className="relative flex items-center justify-center 
                            w-10 h-10 
                            md:w-12 md:h-12 
                            rounded-xl 
                            bg-black/40 
                            border border-emerald-500/20 
                            shadow-[0_0_20px_rgba(16,185,129,0.2)] 
                            backdrop-blur-md 
                            shrink-0"
                        >
                            <FlameIcon
                                size={22}
                                className="text-emerald-400 fill-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse md:w-6 md:h-6"
                            />
                        </div>

                        {/* Typography */}
                        <div className="flex flex-col justify-center text-left">
                            <span className="
                                text-[10px] 
                                md:text-xs 
                                font-bold 
                                uppercase 
                                tracking-[0.25em] 
                                text-emerald-500
                                mb-1
                            ">
                                Trending Now
                            </span>

                            <h2 className="
                                text-2xl 
                                sm:text-3xl 
                                md:text-4xl 
                                font-extrabold 
                                tracking-tight 
                                text-white 
                                leading-none
                            ">
                                Your Next{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 drop-shadow-[0_0_12px_rgba(52,211,153,0.25)]">
                                    Obsession
                                </span>
                            </h2>
                        </div>
                    </div>
                </div>

                {/* GRID */}
                {/* Removed the misaligned padding classes. Relies on the parent container for perfect edges. */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
                    {stories.map((story, idx) => (
                        <div key={story?._id} className="flex flex-col h-full gap-3 group/wrapper">

                            {/* 1. The Main Clickable Card - FIX APPLIED HERE */}
                            <Link
                                to={`/story/${story?._id}`}
                                className="relative block outline-none transition-transform duration-300 hover:-translate-y-1.5 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl flex-1"
                            >
                                {/* If your TopTrendStoryCard relies on the index for the number, 
                    make sure you are passing it down! (e.g., index={idx}) 
                */}
                                <TopTrendStoryCard story={story} idx={idx} />
                            </Link>

                            {/* 2. The Quick View Button */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setQuickViewStory(story);
                                }}
                                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-xl text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.05)] hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            >
                                <span>Quick View</span>
                            </button>

                        </div>
                    ))}
                </div>

                {/* ================= QUICK VIEW MODAL ================= */}
                {quickViewStory && (

                    <StoryDetsPopup quickViewStory={quickViewStory} setQuickViewStory={setQuickViewStory} />
                )
                }

            </section>
        </div>
    );
}

export default memo(TopTrendStoryGrid);