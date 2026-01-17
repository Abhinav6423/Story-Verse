import React from "react";
import { useQuery } from "@tanstack/react-query";
import TopTrendStoryCard from "./TopTrendStoryCard.jsx";
import { listTrendingShortStory } from "../../Api-calls/trendingShortStory.js";
import Loader from "../Loader.jsx";
import { FlameIcon } from "lucide-react";
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
        <div className="mt-0 px-4 md:px-6 bg-transparent text-white ">
            {/* ================= TRENDING SECTION ================= */}
            <section className="py-6 ">
                {/* HEADER */}
                <div className="mb-4 flex items-center gap-2">
                    <FlameIcon
                        size={25}
                        className="text-emerald-400 fill-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.6)]"
                    />
                    <h2 className="text-2xl font-medium tracking-tight">
                        The Hottest Reads
                    </h2>
                </div>

                {/* GRID */}
                <div
                    className=" p-5
          grid
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-5
          gap-2 sm:gap-12
        "
                >
                    {stories.map((story, idx) => (
                        <Link key={story._id} to={`/story/${story._id}`}>
                            <TopTrendStoryCard story={story} idx={idx} />
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );

}

export default TopTrendStoryGrid;
