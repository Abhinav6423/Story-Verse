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
        <section className="relative min-h-screen overflow-hidden bg-transparent font-sans pt-10">

            {/* AMBIENT GLOW */}
            <div
                className="
            pointer-events-none
            absolute
            -top-32 sm:-top-40 md:-top-52
            left-1/2 -translate-x-1/2
            w-[500px] h-[500px]
            sm:w-[700px] sm:h-[700px]
            md:w-[1000px] md:h-[800px]
            rounded-full
            bg-emerald-900/20 blur-[120px]
            -z-10
        "
            />

            <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-6 sm:py-10 lg:py-12">

                {/* ================= HEADER ================= */}
                <div className="mb-8 sm:mb-10 lg:mb-12 flex items-center gap-3 sm:gap-4">

                    {/* Badge */}
                    <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500/20 to-[#050505] border border-emerald-500/30 shadow-[0_0_20px_rgba(52,211,153,0.15)] backdrop-blur-md shrink-0">
                        <Bookmark
                            size={22}
                            className="text-emerald-400 fill-emerald-400/20 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                        />
                    </div>

                    {/* Title */}
                    <div className="flex flex-col justify-center">
                        <span className="text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-emerald-500">
                            Your Library
                        </span>

                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                            Good{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                                Reads
                            </span>
                        </h1>
                    </div>
                </div>

                {/* ================= CONTENT ================= */}
                {stories.length === 0 ? (

                    <div className="relative flex flex-col items-center justify-center text-center py-20 sm:py-24 px-6 rounded-2xl sm:rounded-3xl bg-[#0A0A0A]/60 border border-white/5 shadow-2xl backdrop-blur-md overflow-hidden">

                        <div className="p-5 sm:p-6 bg-emerald-500/10 rounded-full mb-5 border border-emerald-500/20 shadow-[0_0_30px_rgba(52,211,153,0.1)]">
                            <Bookmark size={36} className="text-emerald-400" />
                        </div>

                        <h3 className="text-white text-xl sm:text-2xl font-bold mb-2">
                            Your library is empty
                        </h3>

                        <p className="text-zinc-400 text-sm sm:text-base max-w-sm mb-6">
                            Start exploring and save stories you love.
                        </p>

                        <Link
                            to="/home"
                            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-full font-semibold transition-all"
                        >
                            Explore Stories
                        </Link>
                    </div>

                ) : (

                    <div
                        className="
                    grid
                    gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8
                    grid-cols-2
                    sm:grid-cols-3
                    md:grid-cols-4
                    lg:grid-cols-5
                    xl:grid-cols-6
                    2xl:grid-cols-7
                "
                    >
                        {stories.map((story) => (
                            <Link
                                to={`/story/${story._id}`}
                                key={story._id}
                                className="group relative block transition-all duration-300 hover:-translate-y-2"
                            >
                                {/* Glow */}
                                <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/20 rounded-xl blur-xl transition-all duration-300 -z-10" />

                                {/* Card */}
                                <div className="relative w-full h-full rounded-xl overflow-hidden ring-1 ring-white/5 group-hover:ring-emerald-500/30 bg-[#0A0A0A] shadow-lg group-hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.8)] transition-all duration-300">
                                    <GoodReadShortStoryCard story={story} />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default memo(GoodReadsShortStoryGrid);