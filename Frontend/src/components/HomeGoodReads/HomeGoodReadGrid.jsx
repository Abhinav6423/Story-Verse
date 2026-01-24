import React, { memo } from "react";
import HomeGoodReadCard from "./HomeGoodReadCard";
import { BookOpen, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listTopGoodReadsShortStory } from "../../Api-calls/TopGoodreadsShortStory.js";

// 1. Skeleton Component to prevent Layout Shift (CLS)
const SkeletonGrid = () => (
    <section className="relative text-white overflow-hidden py-8 md:py-12 animate-pulse">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16 lg:items-center justify-center">
                {/* Left Skeleton */}
                <div className="max-w-md space-y-4 lg:flex-shrink-0 text-left">
                    <div className="h-8 w-48 bg-gray-700 rounded" />
                    <div className="h-4 w-64 bg-gray-700 rounded" />
                    <div className="h-4 w-52 bg-gray-700 rounded" />
                </div>
                {/* Right Skeleton (Cards) */}
                <div className="flex gap-4 w-full lg:w-auto overflow-hidden">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex-shrink-0 w-64 h-80 bg-gray-800 rounded-lg" />
                    ))}
                </div>
            </div>
        </div>
    </section>
);

const HomeGoodReadGrid = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["topGoodReadsShortStory"],
        queryFn: listTopGoodReadsShortStory,
        staleTime: 1000 * 60 * 5,
    });

    const shortStories = data?.goodreads?.map(gr => gr.story) || [];

    // 2. Use Skeleton instead of Loader to fix CLS
    if (isLoading) return <SkeletonGrid />;

    // 3. UI Error handling instead of alert()
    if (isError) return (
        <div className="text-center py-10 text-red-400 flex flex-col items-center gap-2">
            <AlertCircle size={24} />
            <p>Could not load Top Reads.</p>
        </div>
    );

    return (
        <section className="relative text-white overflow-hidden py-8 md:py-12">
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
                <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16 lg:items-center justify-center">

                    {/* LEFT INFO */}
                    <div className="max-w-md space-y-4 lg:flex-shrink-0 text-left">
                        <div className="flex items-center gap-3">
                            <BookOpen size={24} strokeWidth={3} className="text-emerald-400" />
                            <h2 className="text-2xl md:text-3xl font-bold leading-none">
                                Good reads
                            </h2>
                        </div>
                        <p className="text-zinc-300 text-base md:text-sm leading-relaxed">
                            Stories that stood out to readers and <br className="hidden md:block" />
                            earned their place through <br className="hidden md:block" /> votes and appreciation.
                        </p>
                    </div>

                    {/* RIGHT CARDS */}
                    <div className="
                            flex gap-4 w-full lg:w-auto
                            overflow-x-auto scrollbar-hide
                            snap-x snap-mandatory pb-4
                        ">
                        {shortStories.map((story, index) => (
                            <Link
                                key={story._id}
                                to={`/story/${story._id}`}
                                className="flex-shrink-0 snap-start"
                            >
                                {/* IMPORTANT: Ensure HomeGoodReadCard has optimized images! */}
                                <HomeGoodReadCard
                                    story={story}
                                    rank={index + 1}
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Border - kept purely decorative */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
        </section>
    );
};

export default memo(HomeGoodReadGrid);