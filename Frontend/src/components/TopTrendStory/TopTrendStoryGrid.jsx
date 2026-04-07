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
      <div className="relative mt-0 pt-4 pb-8 md:pt-6 md:pb-12 lg:pt-8 lg:pb-2 bg-transparent text-white min-h-[200px] w-full">

            {/* FIX 3: Removed Left Glow, Right Glow, and Gradient divs from here. */}

            {/* ================= TRENDING SECTION ================= */}
            {/* FIX 4: Changed py-8 to pb-8 and added pt-0 to kill the dead top space */}
           <section className="relative z-10 pb-8 md:pb-12 pt-0 w-full">

                {/* HEADER */}
                <div className="mb-8 md:mb-10 flex items-center justify-between w-full">

                    <div className="flex items-center gap-4 md:gap-5">

                        {/* Flame Badge */}
                        <div className="relative flex items-center justify-center 
                            w-10 h-10 
                            md:w-12 md:h-12 
                            rounded-xl 
                            bg-[#0F1714]/80 
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
                                text-emerald-500/80 
                                mb-1
                            ">
                                Curated For You
                            </span>

                            <h2 className="
                                text-xl 
                                sm:text-2xl 
                                md:text-3xl 
                                font-medium 
                                tracking-tight 
                                text-white 
                                leading-none
                            ">
                                Your Next{" "}
                                <span className="text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.25)]">
                                    Obsession
                                </span>
                            </h2>
                        </div>
                    </div>
                </div>

                {/* GRID */}
                {/* FIX 5: Ensure 'justify-center' is NOT here. The grid should naturally align left inside its container. */}
                <div className="
                    grid
                    grid-cols-2
                    sm:grid-cols-3
                    md:grid-cols-3
                    lg:grid-cols-4
                    xl:grid-cols-5
                    gap-5
                    md:gap-8
                    lg:gap-10
                    pl-0
                    sm:pl-8
                    md:pl-12
                    lg:pl-10
                ">
                    {stories.map((story, idx) => (
                        <Link
                            key={story._id}
                            to={`/story/${story._id}`}
                            className="block transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]"
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