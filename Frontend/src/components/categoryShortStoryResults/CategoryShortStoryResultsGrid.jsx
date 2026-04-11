import React, { memo } from "react";
import StoryCard from "../ShortStory/ShortStoryCard";
import { Link, useParams } from "react-router-dom";
import { listFeedShortStory } from "../../Api-calls/homeFeedShortStoryList.js";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, FolderOpen } from "lucide-react";

// 1. Skeleton Component to match the exact layout (prevents CLS)
const SkeletonCategoryGrid = () => (
  <div className="min-h-screen relative overflow-hidden animate-pulse">
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 relative z-10">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="h-4 w-20 bg-gray-800 rounded" />
        <div className="h-10 w-64 bg-gray-800 rounded" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="aspect-[2/3] bg-gray-800 rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

const CategoryShortStoryResultsGrid = () => {
  const { category } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["shortStory", category],
    queryFn: () => listFeedShortStory({ category }),
    staleTime: 1000 * 60 * 5, // 5 minutes cache (Prevents loading spinner on 'Back' button)
    keepPreviousData: true,
  });

  const stories = data?.shortStory || [];

  if (isLoading) return <SkeletonCategoryGrid />;

  if (isError) return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-red-400 gap-2">
      <AlertCircle size={24} />
      <p>Error loading stories.</p>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent pb-24">

      {/* BACKGROUND GLOW */}
      {/* Optimized: Using a fixed div prevents it from moving during scroll causing repaints */}
      <div
        className="
          pointer-events-none
          fixed
          top-[-10%] md:top-[-20%]
          left-1/2
          -translate-x-1/2
          w-[500px] h-[500px]
          md:w-[900px] md:h-[900px]
          rounded-full
          bg-emerald-600/15
          blur-[100px] md:blur-[120px]
          z-0
        "
      />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-8 relative z-10">

        {/* HEADER - Left Aligned for stronger visual structure */}
        <div className="flex flex-col items-start gap-1 mt-6 sm:mt-12 md:mt-20 mb-8 sm:mb-10">
          {/* <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-emerald-500 uppercase">
            Category
          </span> */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-white tracking-tight drop-shadow-md">
            {category?.toUpperCase() || "UNKNOWN"}
          </h1>
        </div>

        {/* STORIES GRID */}
        {stories.length === 0 ? (
          /* PREMIUM EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center border border-white/5 rounded-2xl bg-black/40 backdrop-blur-md shadow-2xl">
            <div className="p-4 bg-emerald-500/10 rounded-full mb-4 border border-emerald-500/20">
              <FolderOpen size={40} className="text-emerald-400" />
            </div>
            <h3 className="text-white text-xl font-bold mb-2">No stories found</h3>
            <p className="text-gray-400 font-medium mb-6">There are currently no stories published in this category.</p>
            <Link
              to="/home"
              className="px-6 py-2.5 bg-white text-black hover:bg-emerald-400 font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              Browse all categories
            </Link>
          </div>
        ) : (
          <div
            className="
              grid
              gap-4 sm:gap-6 lg:gap-8
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
                key={story._id}
                to={`/story/${story._id}`}
                className="block outline-none transition-transform duration-300 hover:-translate-y-1.5 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl"
              >
                {/* The StoryCard handles its own background, borders, and hover effects */}
                <StoryCard story={story} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(CategoryShortStoryResultsGrid);