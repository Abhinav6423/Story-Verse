import React, { useState } from "react";
import { getUserCreatedShortStories } from "../../Api-calls/getUserCreatedShortStories.js";
import Navbar from "../../components/Home/Navbar.jsx";
import MyStoryCard from "./MyStoryCard.jsx";
import { useQuery } from "@tanstack/react-query";

const MyStories = () => {
    const [status, setStatus] = useState("published");

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["userCreatedShortStories", status],
        queryFn: () => getUserCreatedShortStories(status),
        refetchOnWindowFocus: false,
        staleTime: 5000,
    });

    if (isLoading) return <div className="p-6 text-gray-600">Loading...</div>;
    if (isError) return <div className="p-6 text-red-500">{error.message}</div>;

    const stories = data?.data || [];

    return (
        <div className="min-h-screen bg-[#0f0f0f]">
            <div className="max-w-6xl mx-auto px-4 py-10">

                {/* ===== HEADER ===== */}
                <div className="flex flex-col items-center text-center">
                    <p className="text-sm text-gray-400 mt-1 tracking-wide">
                        Stories you have written
                    </p>

                    {/* FILTERS */}
                    <div
                        className="
          mt-5
          flex items-center gap-2
          bg-[#1a1a1a]
          p-1.5
          rounded-full
          border border-white/10
          shadow-md
        "
                    >
                        <button
                            onClick={() => setStatus("published")}
                            className={`
            px-4 py-1.5
            rounded-full
            text-sm font-semibold
            transition-all
            ${status === "published"
                                    ? "bg-white text-black shadow"
                                    : "text-gray-400 hover:bg-white/10 hover:text-white"}
          `}
                        >
                            Published
                        </button>

                        <button
                            onClick={() => setStatus("draft")}
                            className={`
            px-4 py-1.5
            rounded-full
            text-sm font-semibold
            transition-all
            ${status === "draft"
                                    ? "bg-white text-black shadow"
                                    : "text-gray-400 hover:bg-white/10 hover:text-white"}
          `}
                        >
                            Draft
                        </button>
                    </div>
                </div>

                {/* ===== STORIES ===== */}
                {stories.length === 0 ? (
                    <p className="text-center text-gray-500 mt-24 text-sm">
                        No {status} stories found.
                    </p>
                ) : (
                    <div
                        className="
          mt-10
          grid
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-5
          gap-6
        "
                    >
                        {stories.map((story) => (
                            <MyStoryCard
                                key={story._id}
                                title={story.title}
                                image={story.coverImage}
                                status={story.status}
                                category={story.category}
                                time={story.createdAt}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>


    );
};

export default MyStories;
