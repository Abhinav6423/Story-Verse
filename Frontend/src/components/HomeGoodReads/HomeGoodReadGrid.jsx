import React from "react";
import HomeGoodReadCard from "./HomeGoodReadCard";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listTopGoodReadsShortStory } from "../../Api-calls/TopGoodreadsShortStory.js"
import Loader from "../Loader.jsx";

function HomeGoodReadGrid() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["topGoodReadsShortStory"],
        queryFn: listTopGoodReadsShortStory,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const shortStories = data?.goodreads?.map(gr => gr.story) || [];

    if (isLoading) return <Loader />;
    if (isError) return alert("Something went wrong");

    return (
        <section className="relative text-white overflow-hidden py-8 md:py-12">
            {/* Optional: Background gradient or color here if needed */}

            {/* ===== CONTENT CONTAINER ===== */}
            {/* Uses max-w-7xl and mx-auto to center content and align with other sections */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 lg:items-center">

                    {/* LEFT INFO */}
                    <div className="max-w-md space-y-4 lg:flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <BookOpen
                                size={24}
                                strokeWidth={3}
                                className="text-emerald-400" // Added color to match reference
                            />
                            <h2 className="text-2xl md:text-3xl font-bold leading-none">
                                Good reads
                            </h2>
                        </div>

                        <p className="text-zinc-300 text-base md:text-sm leading-relaxed">
                            Stories that stood out to readers and <br className="hidden md:block" />
                            earned their place through <br className="hidden md:block" /> votes and appreciation.
                        </p>
                    </div>

                    {/* RIGHT CARDS - SCROLLABLE */}
                    <div
                        className="
                            flex
                            gap-4
                            w-full
                            overflow-x-auto
                            scrollbar-hide
                            snap-x snap-mandatory
                            pb-4 // Add padding-bottom for scrollbar space if needed
                        "
                    >
                        {shortStories.map((story, index) => (
                            <Link
                                key={story._id}
                                to={`/story/${story._id}`}
                                className="flex-shrink-0 snap-start"
                            >
                                <HomeGoodReadCard
                                    story={story}
                                    rank={index + 1}
                                />
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
        </section>
    );
}

export default HomeGoodReadGrid;