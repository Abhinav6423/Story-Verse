import React, { useState } from "react";
import { ThumbsUp } from "lucide-react";
import { Link } from "react-router-dom";
import { likeShortStory } from "../../Api-calls/likeShortStory.js";

const ShortStoryCard = ({ story }) => {
    const [isLiked, setIsLiked] = useState(story?.isLiked || false);
    const [likes, setLikes] = useState(story?.likes || 0);
    const [loading, setLoading] = useState(false);

    const likeStory = async (e) => {
        e.stopPropagation();
        if (loading || isLiked) return;

        try {
            setLoading(true);
            const result = await likeShortStory({ storyId: story._id });

            if (result?.success) {
                setIsLiked(true);
                setLikes((prev) => prev + 1);
            }
        } catch (error) {
            console.error("Error liking story:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="w-[140px] sm:w-[160px]">
                {/* POSTER */}
                <div
                    className="
        relative
        aspect-[2/3]
        rounded-lg
        overflow-hidden
        bg-gray-100
        shadow-sm
        hover:shadow-lg
        transition
      "
                >
                    <img
                        src={story.coverImage}
                        alt={story.title}
                        className="
          w-full h-full
          object-cover
          hover:scale-105
          transition-transform
          duration-300
        "
                    />
                </div>

                {/* INFO */}
                <div className="mt-2 space-y-1">
                    {/* TITLE + LIKES */}
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm sm:text-xs font-semibold text-gray-900 leading-tight">
                            {story.title?.length > 12
                                ? story.title.slice(0, 12) + "…"
                                : story.title}
                        </h3>

                        <div className="flex items-center gap-1 text-xs sm:text-[11px] font-medium text-emerald-600 shrink-0">
                            <ThumbsUp size={14} className="sm:hidden" />
                            <ThumbsUp size={12} className="hidden sm:block" />
                            <span>{story.likes || "10k"}</span>
                        </div>
                    </div>

                    {/* AUTHOR */}
                    <div className="flex items-center gap-2 sm:gap-1.5">
                        <img
                            src={story.author?.profilePic || "/avatar.png"}
                            alt={story.author?.username}
                            className="w-5 h-5 sm:w-4 sm:h-4 rounded-full object-cover"
                        />
                        <p className="text-xs sm:text-[11px] text-gray-500 truncate">
                            {story.author?.username || "Aleen Kizoff"}
                        </p>
                    </div>
                </div>
            </div>
        </>


    )




};

export default ShortStoryCard;
