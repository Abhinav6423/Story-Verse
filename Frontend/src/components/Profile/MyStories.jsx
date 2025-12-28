import React, { useState } from "react";
import { getUserCreatedShortStories } from "../../Api-calls/getUserCreatedShortStories.js";
import Navbar from "../../components/Home/Navbar.jsx";
import MyStoryCard from "./MyStoryCard.jsx";
import { useQuery } from "@tanstack/react-query";
import Loader from "../Loader.jsx";
import { BookOpen } from "lucide-react";
const MyStories = () => {
    const [status, setStatus] = useState("published");

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["userCreatedShortStories", status],
        queryFn: () => getUserCreatedShortStories(status),
        refetchOnWindowFocus: false,
        staleTime: 5000,
    });

    if (isLoading) return <Loader />;
    if (isError) return <div className="p-6 text-red-500">{error.message}</div>;

    const stories = data?.data || [];

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto py-7 sm:py-3">

                {/* ===== HEADER ===== */}
                <div className="flex flex-col sm:flex-row gap-5 items-center justify-between mb-8 sm:mb-12 ">

                    <h2 className="text-xl font-semibold text-green-950">
                        Your Stories
                    </h2>

                    {/* FILTERS */}
                    <div className="flex items-center bg-gray-200 rounded-full p-2.5">
                        <button
                            onClick={() => setStatus("published")}
                            className={`
            cursor-pointer
            flex items-center gap-2.5
            px-5 py-2.5
            rounded-full
            text-sm font-semibold
            transition-all
            ${status === "published"
                                    ? "bg-green-950 text-white shadow-md"
                                    : "text-gray-600 hover:text-gray-900"}
        `}
                        >
                            <BookOpen className="w-5 h-5" />
                            Published
                        </button>

                        <button
                            onClick={() => setStatus("draft")}
                            className={`
            cursor-pointer
            flex items-center gap-2.5
            px-5 py-2.5
            rounded-full
            text-sm font-semibold
            transition-all
            ${status === "draft"
                                    ? "bg-green-950 text-white shadow-md"
                                    : "text-gray-600 hover:text-gray-900"}
        `}
                        >
                            <BookOpen className="w-5 h-5" />
                            Draft
                        </button>
                    </div>

                </div>

                {/* ===== STORIES GRID ===== */}
                {stories.length === 0 ? (
                    <p className="text-center text-gray-500 mt-20 text-sm">
                        No {status} stories found.
                    </p>
                ) : (
                    <div
                        className="
                        grid
                        grid-cols-2
                        sm:grid-cols-3
                        md:grid-cols-4
                        lg:grid-cols-5
                        gap-x-6
                        gap-y-10
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
