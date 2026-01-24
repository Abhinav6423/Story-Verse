import React, { useState, memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/Authcontext.js";
import { getUserCreatedShortStories } from "../../Api-calls/getUserCreatedShortStories.js";
import MyStoryCard from "./MyStoryCard.jsx";
import { AlertCircle, FileText } from "lucide-react";

// 1. Skeleton Component prevents Layout Shift (CLS)
const SkeletonGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10 animate-pulse">
        {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
                <div className="aspect-[2/3] bg-gray-800 rounded-xl w-full" />
                <div className="h-4 w-3/4 bg-gray-800 rounded" />
                <div className="h-3 w-1/2 bg-gray-800 rounded" />
            </div>
        ))}
    </div>
);

const MyStories = () => {
    const [status, setStatus] = useState("published");
    const { userData, loading: authLoading } = useAuth();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["userCreatedShortStories", status],
        queryFn: () => getUserCreatedShortStories(status),
        enabled: !authLoading && !!userData,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 2, // 2 minutes cache
        keepPreviousData: true,   // Prevents flickering when switching tabs
    });

    // 2. Error State
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-red-400 gap-2">
                <AlertCircle size={24} />
                <p>{error?.message || "Failed to load stories"}</p>
            </div>
        );
    }

    const stories = data?.data || [];

    return (
        <div className="bg-transparent min-h-screen">
            <div className="max-w-7xl mx-auto py-7 sm:py-3 px-4">

                {/* ===== HEADER ===== */}
                <div className="flex flex-col sm:flex-row gap-5 items-center justify-between mb-8">
                    <h2 className="text-2xl font-semibold text-white">
                        Your Stories
                    </h2>

                    {/* ===== FILTERS (Optimized Layout) ===== */}
                    <div className="flex items-center bg-[#059E70]/20 border border-[#059E70] rounded-full p-1">
                        {["published", "draft"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setStatus(tab)}
                                className={`
                                    relative px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 capitalize
                                    ${status === tab
                                        ? "bg-white text-black shadow-lg translate-y-0"
                                        : "text-gray-300 hover:text-white hover:bg-white/10"
                                    }
                                `}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ===== CONTENT AREA ===== */}
                {isLoading ? (
                    <SkeletonGrid />
                ) : stories.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
                        <div className="p-4 bg-emerald-500/10 rounded-full mb-4">
                            <FileText size={32} className="text-emerald-500/50" />
                        </div>
                        <h3 className="text-white text-lg font-medium">No {status} stories</h3>
                        <p className="text-gray-400 text-sm mt-1 max-w-sm">
                            {status === 'published'
                                ? "You haven't published any stories yet."
                                : "You don't have any drafts in progress."}
                        </p>
                    </div>
                ) : (
                    /* Stories Grid */
                    <div className="
                        grid
                        grid-cols-2
                        sm:grid-cols-3
                        md:grid-cols-4
                        lg:grid-cols-5
                        gap-x-6
                        gap-y-10
                    ">
                        {stories.map((story) => (
                            <MyStoryCard
                                key={story._id}
                                id={story._id}
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

export default memo(MyStories);