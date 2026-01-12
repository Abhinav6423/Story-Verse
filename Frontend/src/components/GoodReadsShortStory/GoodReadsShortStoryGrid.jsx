import React from "react";
import GoodReadShortStoryCard from "./GoodReadShortStoryCard.jsx";
import { Bookmark } from "lucide-react";
import Navbar from "../Home/Navbar.jsx";
import { userGoodReadsCollection } from "../../Api-calls/userGoodReadsCollection.js";
import Loader from "../Loader.jsx";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom"

const GoodReadsShortStoryGrid = () => {


    const { isLoading, isError, data } = useQuery({
        queryKey: ['userGoodReads'],
        queryFn: () => userGoodReadsCollection()
    });

    const stories = data?.shortStories || [];

    if (isLoading) return <Loader />
    if (isError) return <div className="p-6 text-red-500">{isError}</div>

    return (
        <section className="relative min-h-screen overflow-hidden bg-transperant">


            {/* SOFT GREEN GLOW (responsive) */}
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
        
      "
            />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

                {/* ================= HEADER ================= */}
                <div className="mb-6 sm:mb-10">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-white">
                        Your Good Reads
                    </h1>
                    <p className="text-sm text-white mt-1">
                        Stories you’ve saved to read again
                    </p>
                </div>

                {/* ================= EMPTY STATE ================= */}
                {stories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-16 sm:py-20 px-4">
                        <Bookmark size={36} className="text-white mb-4" />
                        <h3 className="text-gray-900 text-base sm:text-lg font-medium">
                            No saved stories yet
                        </h3>
                        <p className="text-white text-sm mt-2 max-w-sm">
                            Start exploring and save stories you love. They’ll appear here.
                        </p>
                    </div>
                ) : (
                    /* ================= GRID ================= */
                    <div
                        className="
            grid gap-4 sm:gap-6
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
          "
                    >
                        {stories.map((story) => (
                            <Link
                                to={`/story/${story._id}`}
                                key={story._id}
                                className="block"
                            >
                                <GoodReadShortStoryCard story={story} />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );


};

export default GoodReadsShortStoryGrid;
