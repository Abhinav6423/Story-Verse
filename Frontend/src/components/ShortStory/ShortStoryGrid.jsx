import React, { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Compass, AlertCircle } from "lucide-react";
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
        <div className="mt-0 sm:mt-15 bg-transparent">
            {/* ================= SECTION HEADER ================= */}
            <div className="mb-8 flex items-center gap-3">
                <span className="
                    w-10 h-10
                    rounded-full
                    bg-emerald-500/15
                    flex items-center justify-center
                ">
                    <Compass size={22} className="text-emerald-400" />
                </span>

                <h2 className="text-2xl font-medium text-white tracking-tight">
                    Fresh Reads
                </h2>
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
                {stories.map((story) => (
                    <Link
                        to={`/story/${story?._id}`}
                        /* KEY FIX: Ensure this is unique. Use _id from Mongo */
                        key={story?._id}
                        className="block" // specific fix for Link layout issues
                    >
                        {/* Ensure ShortStoryCard has optimized images 
                           (width/height attributes) 
                        */}
                        <ShortStoryCard story={story} />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default memo(ShortStoryGrid);