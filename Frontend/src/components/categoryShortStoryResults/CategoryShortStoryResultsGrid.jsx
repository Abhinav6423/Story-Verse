import React from "react";
import Navbar from "../Home/Navbar";
import StoryCard from "../ShortStory/ShortStoryCard";
import { Link, useParams } from "react-router-dom";
import { listFeedShortStory } from "../../Api-calls/homeFeedShortStoryList.js"
import { useQuery } from "@tanstack/react-query"
import Loader from "../Loader.jsx";


const CategoryShortStoryResultsGrid = () => {
  const { category } = useParams();
  console.log(category)
  const { data, isLoading, isError } = useQuery({
    queryKey: ["shortStory", category],
    queryFn: () => listFeedShortStory({ category }),
  })

  console.log(data?.shortStory)
  const stories = data?.shortStory || []

  if (isLoading) return <Loader />

  if (isError) return <div className="p-6 text-red-500">{isError}</div>
  return (
    <>
      {/* PAGE WRAPPER */}
      <div className="min-h-screen relative overflow-hidden ">

        {/* GREEN LIGHT GLOW */}
        <div
          className="
          pointer-events-none
          absolute
          top-[-250px]
          left-1/2
          -translate-x-1/2
          w-[900px]
          h-[900px]
          rounded-full
          bg-transparent
          blur-3xl
        "
        />

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 relative z-10">

          {/* HEADER */}
          <div className="flex flex-col gap-4 mb-8">
            <span className="text-sm text-emerald-400/80">
              Category
            </span>

            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">
                {category?.toUpperCase()}
              </h1>
            </div>
          </div>

          {/* STORIES GRID */}
          {stories.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">
              No stories found in this category.
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
                <Link key={story._id} to={`/story/${story._id}`}>
                  <StoryCard story={story} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );

};

export default CategoryShortStoryResultsGrid;
