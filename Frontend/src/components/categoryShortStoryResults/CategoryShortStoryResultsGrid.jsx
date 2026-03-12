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
    <div className="min-h-screen relative overflow-hidden bg-transparent">

      {/* BACKGROUND GLOW */}
      {/* Optimized: Using a fixed div prevents it from moving during scroll causing repaints */}
      <div
        className="
          pointer-events-none
          fixed
          top-[-20%]
          left-1/2
          -translate-x-1/2
          w-[600px] h-[600px]
          md:w-[900px] md:h-[900px]
          rounded-full
          bg-emerald-600/10
          blur-[100px]
          z-0
        "
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 relative z-10">

        {/* HEADER */}
        <div className="flex flex-col gap-2 mt-10 sm:mt-20 md:mt-24  mb-10">
          <span className="text-xs font-bold tracking-wider text-center text-emerald-500 uppercase">
            Category
          </span>
          <h1 className="text-3xl md:text-4xl text-center font-bold text-white tracking-tight">
            {category?.toUpperCase()}
          </h1>
        </div>

        {/* STORIES GRID */}
        {stories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
            <FolderOpen size={48} className="text-emerald-500/50 mb-4" />
            <p className="text-gray-300 font-medium">No stories found in this category.</p>
            <Link to="/home" className="text-emerald-400 text-sm mt-2 hover:underline">
              Browse all categories
            </Link>
          </div>
        ) : (
          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-5
              gap-6
            "
          >
            {stories.map((story) => (
              <Link
                key={story._id}
                to={`/story/${story._id}`}
                className="block transition-transform hover:-translate-y-1 duration-300"
              >
                {/* Ensure StoryCard is the optimized version with explicit image dimensions! */}
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