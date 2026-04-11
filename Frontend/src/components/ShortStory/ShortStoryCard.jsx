import React, { useState, memo } from "react";
import { Heart, Bookmark } from "lucide-react";
import { likeShortStory } from "../../Api-calls/likeShortStory.js";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
// 1. IMPORT THE HELPER
import { getOptimizedUrl, getBlurPlaceholder } from "../../utils/cloudinaryHelper";

const ShortStoryCard = ({ story }) => {
    const [isLiked, setIsLiked] = useState(story?.isLiked || false);
    const [likes, setLikes] = useState(story?.likes || 0);
    const [loading, setLoading] = useState(false);

    const likeStory = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (loading || isLiked) return;

        setIsLiked(true);
        setLikes((prev) => prev + 1);
        setLoading(true);

        try {
            const result = await likeShortStory({ storyId: story._id });
            if (!result?.success) {
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
        <div className="group w-full p-2.5 bg-black/40 backdrop-blur-md rounded-xl border border-white/5 hover:border-emerald-500/30 hover:bg-black/60 transition-all duration-300 shadow-lg">
            <div className="w-full">

                {/* === POSTER IMAGE === */}
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-900 shadow-inner group-hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.5)] transition-all duration-300">

                    {/* Premium Glassmorphic Good Read Badge */}
                    {story?.isGoodRead && (
                        <div className="absolute top-2 right-2 z-20 bg-emerald-500/80 backdrop-blur-sm p-1.5 rounded-lg shadow-[0_4px_12px_rgba(16,185,129,0.4)] transition-transform duration-300 group-hover:scale-105">
                            <Bookmark size={14} className="text-white fill-white drop-shadow-sm" />
                        </div>
                    )}

                    {/* Hover Glass Highlight Overlay (Adds that premium diagonal shine) */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-tr from-emerald-500/0 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out pointer-events-none" />

                    {story?.coverImage ? (
                        <LazyLoadImage
                            // 2. OPTIMIZE MAIN IMAGE
                            src={getOptimizedUrl(story.coverImage, 400)}
                            alt={story.title}
                            effect="blur"
                            // 3. OPTIMIZE PLACEHOLDER
                            placeholderSrc={getBlurPlaceholder(story.coverImage)}
                            wrapperClassName="w-full h-full !block"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#121212] text-gray-600 px-4 text-center">
                            <h3 className="text-sm font-semibold leading-snug line-clamp-3">
                                {story?.title}
                            </h3>
                        </div>
                    )}

                    {/* Refined Gradient Overlay for bottom text contrast */}
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
                </div>

                {/* === INFO SECTION === */}
                <div className="mt-3 px-1 pb-1 space-y-2 relative z-10">

                    {/* TITLE + LIKES */}
                    <div className="flex items-start justify-between gap-3">
                        <h3
                            className="text-[14px] sm:text-[15px] font-bold text-white group-hover:text-emerald-400 transition-colors duration-300 leading-snug line-clamp-2 tracking-wide flex-1"
                            title={story?.title}
                        >
                            {story?.title}
                        </h3>

                        {/* Upgraded Like Button to the Premium Pill Style */}
                        <button
                            onClick={(e) => {
                                e.preventDefault(); // CRITICAL: Prevents the parent <Link> from firing
                                e.stopPropagation();
                                if (!loading && !isLiked) {
                                    likeStory();
                                }
                            }}
                            disabled={loading || isLiked}
                            className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-lg border shrink-0 pt-0.5 transition-all duration-300 ${isLiked
                                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                                    : "text-gray-400 bg-white/5 border-white/5 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:scale-105"
                                }`}
                        >
                            <Heart size={13} className={isLiked ? "fill-emerald-400 stroke-emerald-400" : "stroke-[2px]"} />
                            <span>{likes}</span>
                        </button>
                    </div>

                    {/* AUTHOR - Uncommented and Polished */}
                    {/* <div className="flex items-center gap-2">
                        <img
                            // 4. OPTIMIZE AVATAR
                            src={getOptimizedUrl(story?.author?.profilePic, 50) || "default-avatar.png"}
                            alt={story?.author?.username || "Author"}
                            width="20"
                            height="20"
                            loading="lazy"
                            className="w-5 h-5 rounded-full object-cover bg-gray-800 border border-white/10 group-hover:border-emerald-400/50 transition-all duration-300"
                        />
                        <p className="text-xs font-medium text-gray-400 group-hover:text-gray-300 truncate max-w-[120px] tracking-wide transition-colors">
                            {story?.author?.username || "Unknown Author"}
                        </p>
                    </div> */}

                </div>
            </div>
        </div>
    );
};

export default memo(ShortStoryCard);