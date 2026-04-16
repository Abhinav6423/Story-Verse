import React, { memo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Compass, AlertCircle, FlameIcon, X, ArrowRight } from "lucide-react";
import ShortStoryCard from "./ShortStoryCard.jsx";
import { listFeedShortStory } from "../../Api-calls/homeFeedShortStoryList.js";
import { Link } from "react-router-dom";
import StoryDetsPopup from "../../utils/StoryDetsPopup.jsx";
// 1. Skeleton Component to Prevent CLS
const SkeletonGrid = () => (
    <div className="mt-0 sm:mt-15 bg-transparent animate-pulse">
        {/* Header Skeleton */}
        <div className="mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-900/30" />
            <div className="h-8 w-48 bg-emerald-900/30 rounded" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {/* Show 12 skeleton cards */}
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-gray-800 rounded-xl" />
            ))}
        </div>
    </div>
);

const ShortStoryGrid = () => {
    // === STATE FOR QUICK VIEW MODAL ===
    const [quickViewStory, setQuickViewStory] = useState(null);

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
        // Added standard max-width and padding to match your trending section
        <div className="relative bg-transparent text-white w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 mt-8 mb-16">

            {/* ================= SECTION HEADER ================= */}
            <div className="mb-6 md:mb-8 flex items-center justify-between w-full">
                <div className="flex items-center gap-3 md:gap-4">

                    {/* Premium Glassmorphic Compass Badge - Shrunk slightly for better alignment */}
                    <div className="relative flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-black border border-emerald-500/30 shadow-[0_0_15px_rgba(52,211,153,0.15)] backdrop-blur-md shrink-0">
                        <Compass
                            size={20}
                            className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse"
                        />
                        {/* Ambient background glow behind the compass */}
                        <div className="absolute inset-0 bg-emerald-400/20 blur-md rounded-xl z-[-1]"></div>
                    </div>

                    {/* Personalized Typography Stack */}
                    <div className="flex flex-col justify-center mt-1">
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
                gap-4 sm:gap-6 lg:gap-8
                grid-cols-2
                sm:grid-cols-3
                lg:grid-cols-4
                xl:grid-cols-5
            ">
                {stories?.map((story) => (
                    <div key={story?._id} className="flex flex-col h-full gap-3 group/wrapper">

                        {/* 1. The Main Clickable Card (Navigates to story) */}
                        <Link
                            to={`/story/${story?._id}`}
                            className="block outline-none transition-transform duration-300 hover:-translate-y-1.5 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl flex-1"
                        >
                            {/* StoryCard handles its own hover states and glassmorphism */}
                            <ShortStoryCard story={story} />
                        </Link>

                        {/* 2. The Quick View Button (Opens Modal) */}
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

        </div >
    );
};

export default memo(ShortStoryGrid);