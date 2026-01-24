import React, { useState, memo } from "react";
import { ThumbsUp, Bookmark } from "lucide-react";
import { likeShortStory } from "../../Api-calls/likeShortStory.js";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const ShortStoryCard = ({ story }) => {
    const [isLiked, setIsLiked] = useState(story?.isLiked || false);
    const [likes, setLikes] = useState(story?.likes || 0);
    const [loading, setLoading] = useState(false);

    const likeStory = async (e) => {
        e.preventDefault(); // Changed from stopPropagation to prevent Link navigation if wrapped
        e.stopPropagation();

        if (loading || isLiked) return;

        // Optimistic UI update (update state immediately before API returns)
        setIsLiked(true);
        setLikes((prev) => prev + 1);
        setLoading(true);

        try {
            const result = await likeShortStory({ storyId: story._id });
            if (!result?.success) {
                // Revert if API fails
                setIsLiked(false);
                setLikes((prev) => prev - 1);
            }
        } catch (error) {
            console.error("Error liking story:", error);
            setIsLiked(false);
            setLikes((prev) => prev - 1);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full p-2 bg-[#212121] rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            <div className="w-full">

                {/* === POSTER IMAGE === */}
                <div className="
                    relative
                    aspect-[2/3]
                    rounded-xl
                    overflow-hidden
                    bg-gray-800
                    shadow-sm
                    hover:shadow-lg
                    transition-shadow
                ">
                    {/* GOOD READ BADGE */}
                    {story?.isGoodRead && (
                        <div className="absolute top-2 right-2 z-10 bg-emerald-600 text-white p-1.5 rounded-md shadow-md">
                            <Bookmark size={14} fill="currentColor" />
                        </div>
                    )}

                    {story?.coverImage ? (
                        <LazyLoadImage
                            src={story.coverImage}
                            alt={story.title}
                            effect="blur"
                            /* CRITICAL FIX: Forces the wrapper span to fill the container */
                            wrapperClassName="w-full h-full !block"
                            className="
                                w-full
                                h-full
                                object-cover
                                hover:scale-105
                                transition-transform
                                duration-500
                            "
                        />
                    ) : (
                        /* Fallback for missing image */
                        <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-500 px-4 text-center">
                            <h3 className="text-sm font-semibold leading-snug line-clamp-3">
                                {story?.title}
                            </h3>
                        </div>
                    )}
                </div>

                {/* === INFO SECTION === */}
                <div className="mt-2 space-y-1.5">

                    {/* Title & Like Button */}
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-white leading-tight truncate flex-1" title={story?.title}>
                            {story?.title}
                        </h3>

                        <button
                            onClick={likeStory}
                            disabled={loading || isLiked}
                            className={`
                                flex items-center gap-1 text-xs font-medium shrink-0 transition-colors
                                ${isLiked ? "text-emerald-400" : "text-gray-400 hover:text-emerald-400"}
                            `}
                            aria-label={`Like story, current likes: ${likes}`}
                        >
                            <ThumbsUp
                                size={14}
                                className={isLiked ? "fill-emerald-400 stroke-emerald-400" : "stroke-current"}
                            />
                            <span>{likes}</span>
                        </button>
                    </div>

                    {/* Author Info */}
                    <div className="flex items-center gap-2">
                        <img
                            src={story?.author?.profilePic}
                            alt={story?.author?.username || "Author"}
                            /* CLS FIX: Explicit width/height prevents layout jumps */
                            width="20"
                            height="20"
                            loading="lazy"
                            className="w-5 h-5 rounded-full object-cover bg-gray-700"
                        />
                        <p className="text-xs text-zinc-400 truncate max-w-[120px]">
                            {story?.author?.username || "Unknown Author"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(ShortStoryCard);