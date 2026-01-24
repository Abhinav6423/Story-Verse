import React, { memo } from "react";
import { ThumbsUp, Bookmark } from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
// 1. Import your optimization helper
import { getOptimizedUrl, getBlurPlaceholder } from "../../utils/cloudinaryHelper";

const TopTrendStoryCard = ({ story, idx }) => {
    return (
        <div className="relative w-full group">
            {/* RANK — RESPONSIVE BACKGROUND NUMBER */}
            <div className="absolute hidden sm:block bottom-0 sm:-left-10 text-[4.5rem] sm:text-[7rem] font-extrabold text-white/25 leading-none select-none pointer-events-none z-0">
                {idx + 1}
            </div>

            {/* CARD */}
            <div className="relative z-10 w-full bg-[#212121] rounded-xl p-2 sm:p-3 border border-white/5 hover:border-white/10 transition-colors">

                {/* POSTER IMAGE */}
                <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-gray-800 shadow-lg">
                    {/* Good Read Badge */}
                    {story?.isGoodRead && (
                        <div className="absolute top-2 right-2 z-20 bg-emerald-600 p-1.5 rounded-md shadow-md">
                            <Bookmark size={14} fill="currentColor" className="text-white" />
                        </div>
                    )}

                    {story?.coverImage ? (
                        <LazyLoadImage
                            // 2. Optimize Main Image (400px width is plenty for cards)
                            src={getOptimizedUrl(story.coverImage, 400)}
                            alt={story.title}
                            effect="blur"
                            // 3. Add Blur Placeholder
                            placeholderSrc={getBlurPlaceholder(story.coverImage)}
                            wrapperClassName="w-full h-full !block"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-500 px-3 text-center">
                            <h3 className="text-sm font-semibold line-clamp-3">
                                {story?.title}
                            </h3>
                        </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* INFO SECTION */}
                <div className="mt-2 sm:mt-3 space-y-1.5">
                    {/* Title & Likes */}
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm sm:text-base font-semibold text-white truncate" title={story?.title}>
                            {story?.title}
                        </h3>
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-emerald-400 shrink-0 font-medium">
                            <ThumbsUp fill="currentColor" size={14} />
                            <span>{story?.likes || 0}</span>
                        </div>
                    </div>

                    {/* Author Info */}
                    <div className="flex items-center gap-2">
                        <img
                            // 4. Optimize Avatar (Resize to 50px)
                            src={getOptimizedUrl(story?.author?.profilePic, 50) || "default-avatar.png"}
                            alt={story?.author?.username || "Author"}
                            width="16"
                            height="16"
                            loading="lazy"
                            className="w-4 h-4 rounded-full object-cover bg-gray-700"
                        />
                        <p className="text-xs sm:text-sm text-gray-400 truncate">
                            {story?.author?.username || "Unknown Author"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(TopTrendStoryCard);