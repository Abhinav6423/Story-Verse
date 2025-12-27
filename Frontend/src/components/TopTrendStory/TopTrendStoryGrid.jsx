import React from "react";
import { useQuery } from "@tanstack/react-query";
import TopTrendStoryCard from "./TopTrendStoryCard.jsx";
import { listTrendingShortStory } from "../../Api-calls/trendingShortStory.js";
import Loader from "../Loader.jsx";
import {FlameIcon} from "lucide-react";
import { Link } from "react-router-dom";

function TopTrendStoryGrid() {
    /* ================= QUERY ================= */
    const { data, isLoading } = useQuery({
        queryKey: ["trendingShortStory"],
        queryFn: listTrendingShortStory,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const stories = data?.shortStories || [];

    /* ================= CONDITIONAL ================= */
    if (isLoading) return <Loader />;
    if (!stories.length) return null;

    return (
        <div className="mt-6 px-4 md:px-6">
            {/* ================= TRENDING SECTION ================= */}
            <section>
                {/* HEADER */}
                <div className="mb-5 flex items-center gap-1">
                    <FlameIcon fill="green" size={20} strokeWidth={2}  className="text-green-800"/>
                    <h2 className="text-xl font-semibold text-gray-900">
                        Trending
                    </h2>
                </div>

                {/* GRID */}
                <div
                    className="
        grid
        grid-cols-2
        sm:grid-cols-3
        md:grid-cols-4
        lg:grid-cols-5
        xl:grid-cols-6
        gap-5
      "
                >
                    {stories.map((story) => (
                       <Link to={`/story/${story?._id}`}><TopTrendStoryCard key={story._id} story={story} /></Link>
                    ))}
                </div>
            </section>
        </div>

    );
}

export default TopTrendStoryGrid;
