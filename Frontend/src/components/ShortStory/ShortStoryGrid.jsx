import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Compass } from "lucide-react";
import ShortStoryCard from "./ShortStoryCard.jsx";
import { listFeedShortStory } from "../../Api-calls/homeFeedShortStoryList.js";
import Loader from "../Loader.jsx";
import { Link } from "react-router-dom";

const ShortStoryGrid = () => {
    /* ================= DATA FETCH ================= */
    const { isLoading, data, error } = useQuery({
        queryKey: ["shortStories"],
        queryFn: listFeedShortStory,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        staleTime: 5000,
    });

    console.log(data?.shortStory)

    const stories = data?.shortStory || [];

    if (isLoading) return <Loader />;

    if (error) {
        return (
            <div className="text-center text-red-500 py-10">
                {error.message}
            </div>
        );
    }

    return (
        <div className="mt-0 sm:mt-15 bg-transparent">
            {/* ================= SECTION HEADER ================= */}
            <div className="mb-8 flex items-center gap-3">
                <span
                    className="
      w-10 h-10
      rounded-full
      bg-emerald-500/15
      flex items-center justify-center
    "
                >
                    <Compass size={22} className="text-emerald-400" />
                </span>

                <h2
                    className="
      text-2xl font-medium text-white tracking-tight
    "
                >
                    Fresh Reads
                </h2>
            </div>


            {/* ================= STORY GRID ================= */}
            <div
                className="
          grid
          gap-2 
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-5
          xl:grid-cols-6
        "
            >
                {stories.map((story) => (
                    <Link to={`/story/${story?._id}`} key={story?.id}><ShortStoryCard story={story} /></Link>
                ))}
            </div>
        </div>
    );
};

export default ShortStoryGrid;
