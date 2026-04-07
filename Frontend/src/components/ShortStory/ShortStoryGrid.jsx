import React, { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Compass, AlertCircle, FlameIcon } from "lucide-react";
import ShortStoryCard from "./ShortStoryCard.jsx";
import { listFeedShortStory } from "../../Api-calls/homeFeedShortStoryList.js";
import { Link } from "react-router-dom";

// 1. Skeleton Component to Prevent CLS
const SkeletonGrid = () => (
    <div className="mt-0 sm:mt-15 bg-transparent animate-pulse">
        {/* Header Skeleton */}
        <div className="mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-900/30" />
            <div className="h-8 w-48 bg-emerald-900/30 rounded" />
        </div>

        {/* Grid Skeleton */}
        <div className="
      grid gap-4 
      grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6
    ">
            {/* Show 12 skeleton cards */}
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-gray-800 rounded-xl" />
            ))}
        </div>
    </div>
);

const ShortStoryGrid = () => {
    /* ================= DATA FETCH ================= */
    const { isLoading, data, error } = useQuery({
        queryKey: ["shortStories"],
        queryFn: listFeedShortStory,
        /* 'placeholderData: (prev) => prev' is the modern replacement 
           for 'keepPreviousData: true' in TanStack Query v5.
           If you are on v4, keep 'keepPreviousData: true'.
        */
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutes (increased from 5s to reduce fetch frequency)
    });

    const stories = data?.shortStory || [];

    // 2. Use Skeleton instead of Spinner
    if (isLoading) return <SkeletonGrid />;

    if (error) {
        return (
            <div className="text-center text-red-400 py-10 flex flex-col items-center gap-2">
                <AlertCircle size={24} />
                <p>Unable to load stories.</p>
            </div>
        );
    }

    return (
        // Note: NO overflow-hidden, NO glows here. Just clean, transparent content.
        <div className="relative  bg-transparent text-white ">

            {/* ================= SECTION HEADER ================= */}
            <div className="mb-8 flex items-center justify-between w-full ">
                <div className="flex items-center gap-3 md:gap-4">

                    {/* Premium Glassmorphic Flame Badge */}
                    <div className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-[#050505] border border-emerald-500/30 shadow-[0_0_15px_rgba(52,211,153,0.15)] backdrop-blur-md shrink-0">
                        <Compass
                            size={22}
                            className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse md:w-6 md:h-6"
                        />
                        {/* Ambient background glow behind the flame */}
                        <div className="absolute inset-0 bg-emerald-400/20 blur-md rounded-xl z-[-1]"></div>
                    </div>

                    {/* Personalized Typography Stack */}
                    <div className="flex flex-col justify-center">
                        {/* Premium Gradient Title */}
                        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow-md leading-none">
                            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Stories</span>
                        </h2>
                    </div>
                </div>
            </div>

            {/* ================= STORY GRID ================= */}
            <div className="
                grid
                gap-4 
                grid-cols-2
                sm:grid-cols-3
                md:grid-cols-4
                lg:grid-cols-5
                xl:grid-cols-6
            ">
                {stories?.map((story) => (
                    <Link
                        to={`/story/${story?._id}`}
                        key={story?._id}
                        className="block transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02]"
                    >
                        <ShortStoryCard story={story} />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default memo(ShortStoryGrid);