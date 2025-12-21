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
        <div className="mt-4 px-4 md:px-6 bg-white py-6 rounded-2xl border border-slate-100 shadow-sm">

            {/* ================= SECTION HEADER ================= */}
            <div className="mb-4">
                <h2 className="text-lg md:text-xl font-semibold text-slate-900">
                    Short Stories
                </h2>
                <p className="text-sm text-slate-500">
                    Choose a category or search to explore
                </p>
            </div>

            {/* ================= CATEGORY TABS (GAME-LIKE) ================= */}
            <div className="mb-5 flex gap-2 overflow-x-auto scrollbar-hide">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`
          whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition
          ${activeCategory === cat
                                ? "bg-red-500 text-white shadow"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"}
        `}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* ================= SEARCH BAR (TOOL-LIKE) ================= */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    setSearchQuery(searchInput.trim());
                }}
                className="mb-6"
            >
                <div className="
      flex items-center gap-3
      bg-slate-900 text-white
      rounded-xl px-4 h-12
      shadow-inner
    ">
                    <Search size={18} className="text-slate-300" />
                    <input
                        type="text"
                        placeholder="Search stories..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="
          w-full bg-transparent outline-none
          text-sm text-white
          placeholder:text-slate-400
        "
                    />
                </div>
            </form>

            <div
                className="
    grid
    grid-cols-2          /* 👈 2 cards per row (default) */
    gap-5
    sm:grid-cols-2       /* tablet */
    md:grid-cols-3       /* small desktop */
    lg:grid-cols-4       /* desktop */
    xl:grid-cols-5       /* large screens */
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
