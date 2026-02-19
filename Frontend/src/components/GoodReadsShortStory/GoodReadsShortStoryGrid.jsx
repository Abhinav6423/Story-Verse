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
        <section className="relative min-h-screen overflow-hidden bg-transparent font-sans">

            {/* PREMIUM AMBIENT GLOW */}
            <div
                className="
                pointer-events-none
                absolute
                -top-40 md:-top-52
                left-1/2
                -translate-x-1/2
                w-[600px] h-[600px]
                md:w-[1000px] md:h-[800px]
                rounded-[100%]
                bg-emerald-900/20 blur-[120px]
                -z-10
            "
            />

            <div className="relative z-10 max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12">

                {/* ================= HEADER ================= */}
                <div className="mb-10 sm:mb-14 flex items-center gap-3 md:gap-4">
                    {/* Premium Glassmorphic Bookmark Badge */}
                    <div className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-[#050505] border border-emerald-500/30 shadow-[0_0_20px_rgba(52,211,153,0.15)] backdrop-blur-md shrink-0">
                        <Bookmark
                            size={26}
                            className="text-emerald-400 fill-emerald-400/20 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                        />
                        <div className="absolute inset-0 bg-emerald-400/10 blur-md rounded-2xl z-[-1]"></div>
                    </div>

                    {/* Personalized Typography Stack */}
                    <div className="flex flex-col justify-center">
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-emerald-500 mb-0.5 drop-shadow-sm">
                            Your Library
                        </span>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-md leading-none">
                            Good <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Reads</span>
                        </h1>
                    </div>
                </div>

                {/* ================= CONTENT ================= */}
                {stories.length === 0 ? (

                    /* --- PREMIUM EMPTY STATE --- */
                    <div className="relative flex flex-col items-center justify-center text-center py-24 px-6 rounded-3xl bg-[#0A0A0A]/60 border border-white/5 shadow-2xl backdrop-blur-md overflow-hidden group">
                        {/* Subtle internal gradient */}
                        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-50 pointer-events-none"></div>

                        {/* Floating Icon */}
                        <div className="relative p-6 bg-emerald-500/10 rounded-full mb-6 border border-emerald-500/20 shadow-[0_0_30px_rgba(52,211,153,0.1)] transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-translate-y-2">
                            <Bookmark size={40} className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.6)]" />
                        </div>

                        <h3 className="text-white text-2xl font-bold tracking-tight mb-2">
                            Your library is empty
                        </h3>
                        <p className="text-zinc-400 text-base max-w-sm mb-8 leading-relaxed">
                            Every great journey begins with a single page. Start exploring and save the stories that captivate you.
                        </p>

                        <Link
                            to="/home"
                            className="relative px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-full font-bold text-base transition-all duration-300 shadow-[0_0_20px_rgba(52,211,153,0.2)] hover:shadow-[0_0_30px_rgba(52,211,153,0.4)] hover:-translate-y-1"
                        >
                            Explore Stories
                        </Link>
                    </div>

                ) : (

                    /* --- STORY GRID --- */
                    <div className="
                    grid 
                    gap-5 sm:gap-6 lg:gap-8
                    grid-cols-2
                    sm:grid-cols-3
                    md:grid-cols-4
                    lg:grid-cols-5
                    xl:grid-cols-6
                ">
                        {stories.map((story) => (
                            <Link
                                to={`/story/${story._id}`}
                                key={story._id}
                                className="group relative block transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 rounded-xl"
                            >
                                {/* Ambient Glow behind the card on hover */}
                                <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/20 rounded-xl blur-xl transition-all duration-500 ease-out -z-10" />

                                {/* Card Container */}
                                <div className="relative z-10 w-full h-full shadow-lg group-hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.8)] transition-all duration-500 rounded-xl overflow-hidden ring-1 ring-white/5 group-hover:ring-emerald-500/30 bg-[#0A0A0A]">
                                    {/* Ensure GoodReadShortStoryCard has width/height on images! */}
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