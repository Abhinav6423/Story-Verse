import React, { useState, useEffect } from "react";
import StoryCard from "./ShortStoryCard.jsx";
import { useQuery } from "@tanstack/react-query";
import { listFeedShortStory } from "../../Api-calls/homeFeedShortStoryList.js";
import Loader from "../Loader.jsx";
import { Search } from "lucide-react";

const categories = [
    "All",
    "thriller",
    "horror",
    "crime",
    "motivation",
    "romance",
    "fantasy",
    "adventure",
];

const ShortStoryGrid = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");



    /* ================= DATA FETCH ================= */
    const { isLoading, data, error } = useQuery({
        queryKey: ["shortStories", activeCategory, searchQuery],
        queryFn: () =>
            listFeedShortStory({
                category: activeCategory === "All" ? "" : activeCategory,
                title: searchQuery,
            }),
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        staleTime: 5000,
    });

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
        <div className="px-4 md:px-6 py-10 bg-[#141414]">

            {/* ================= SECTION HEADER ================= */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-white">
                    Browse by Category
                </h2>
                <p className="text-sm text-gray-400">
                    Explore stories you’ll love
                </p>
            </div>

            {/* ================= CATEGORY TABS ================= */}
            <div className="mb-6 flex gap-3 overflow-x-auto scrollbar-hide">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`
          whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition
          ${activeCategory === cat
                                ? "bg-white text-black"
                                : "bg-white/10 text-gray-300 hover:bg-white/20"
                            }
        `}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* ================= SEARCH BAR ================= */}
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    setSearchQuery(searchInput.trim())
                }}
                className="mb-8 max-w-md"
            >
                <div
                    className="
        flex items-center gap-3
        bg-white/10
        rounded-md px-4 h-11
        focus-within:bg-white/20
        transition
      "
                >
                    <Search size={18} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search titles, genres..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="
          w-full bg-transparent outline-none
          text-sm text-white
          placeholder:text-gray-400
        "
                    />
                </div>
            </form>

            {/* ================= STORY GRID ================= */}
            <div
                className="
      grid gap-6
      grid-cols-1
      sm:grid-cols-3
      md:grid-cols-4
      lg:grid-cols-3
    "
            >
                {stories.map((story) => (
                    <StoryCard key={story._id} story={story} />
                ))}
            </div>

        </div>


    );
};

export default ShortStoryGrid;
