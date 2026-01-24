import React, { memo } from "react";
import GoodReadShortStoryCard from "./GoodReadShortStoryCard.jsx";
import { Bookmark, AlertCircle } from "lucide-react";
import { userGoodReadsCollection } from "../../Api-calls/userGoodReadsCollection.js";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

// 1. Skeleton Component prevents Layout Shift
const SkeletonGrid = () => (
    <section className="relative min-h-screen overflow-hidden bg-transparent animate-pulse">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
            {/* Header Skeleton */}
            <div className="mb-6 sm:mb-10 space-y-2">
                <div className="h-8 w-48 bg-emerald-900/30 rounded" />
                <div className="h-4 w-64 bg-emerald-900/20 rounded" />
            </div>
            {/* Grid Skeleton */}
            <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="aspect-[2/3] bg-gray-800 rounded-xl" />
                ))}
            </div>
        </div>
    </section>
);

const GoodReadsShortStoryGrid = () => {
    const { isLoading, isError, data } = useQuery({
        queryKey: ['userGoodReads'],
        queryFn: userGoodReadsCollection,
        staleTime: 1000 * 60 * 5, // 5 minutes cache
    });

    const stories = data?.shortStories || [];

    if (isLoading) return <SkeletonGrid />;

    if (isError) return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-red-400 gap-2">
            <AlertCircle size={24} />
            <p>Failed to load your collection.</p>
        </div>
    );

    return (
        <section className="relative min-h-screen overflow-hidden bg-transparent">
            {/* SOFT GREEN GLOW BACKGROUND */}
            <div
                className="
                    pointer-events-none
                    absolute
                    -top-40 md:-top-52
                    left-1/2
                    -translate-x-1/2
                    w-[600px] h-[600px]
                    md:w-[900px] md:h-[900px]
                    rounded-full
                    bg-emerald-600/10 blur-[100px]
                "
            />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

                {/* ================= HEADER ================= */}
                <div className="mb-6 sm:mb-10">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-white">
                        Your Good Reads
                    </h1>
                    <p className="text-sm text-gray-300 mt-1">
                        Stories you’ve saved to read again
                    </p>
                </div>

                {/* ================= EMPTY STATE ================= */}
                {stories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-20 px-4 border border-dashed border-white/10 rounded-2xl bg-white/5">
                        <div className="p-4 bg-emerald-500/10 rounded-full mb-4">
                            <Bookmark size={32} className="text-emerald-400" />
                        </div>
                        <h3 className="text-white text-lg font-medium">
                            No saved stories yet
                        </h3>
                        <p className="text-gray-400 text-sm mt-2 max-w-sm">
                            Start exploring and save stories you love. They’ll appear here.
                        </p>
                        <Link
                            to="/home"
                            className="mt-6 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-sm font-medium transition-colors"
                        >
                            Explore Stories
                        </Link>
                    </div>
                ) : (
                    /* ================= GRID ================= */
                    <div className="
                        grid gap-4 sm:gap-6
                        grid-cols-2
                        sm:grid-cols-3
                        md:grid-cols-4
                        lg:grid-cols-5
                    ">
                        {stories.map((story) => (
                            <Link
                                to={`/story/${story._id}`}
                                key={story._id}
                                className="block transition-transform hover:-translate-y-1 duration-300"
                            >
                                {/* Ensure GoodReadShortStoryCard has width/height on images! */}
                                <GoodReadShortStoryCard story={story} />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default memo(GoodReadsShortStoryGrid);