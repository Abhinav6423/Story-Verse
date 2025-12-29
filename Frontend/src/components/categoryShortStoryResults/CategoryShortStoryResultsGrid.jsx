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
      {/* NAVBAR */}
      <Navbar />

      {/* PAGE WRAPPER */}
      <div className="min-h-screen bg-gradient-to-b from-[#e9f7f1] to-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">

          {/* HEADER */}
          <div className="flex flex-col gap-4 mb-8">
            <span className="text-sm text-gray-500">Category</span>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {category?.toUpperCase()}
              </h1>


            </div>
          </div>

          {/* STORIES GRID */}
          {stories.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
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
                <Link to={`/story/${story._id}`}>
                  <StoryCard key={story._id} story={story} />
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
