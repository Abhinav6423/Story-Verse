import React, { memo } from "react";
import { ThumbsUp, Bookmark, Flame , Heart } from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
// 1. Import your optimization helper
import { getOptimizedUrl, getBlurPlaceholder } from "../../utils/cloudinaryHelper";

const TopTrendStoryCard = ({ story, idx }) => {
    return (
        <div className="relative w-full group perspective-1000">

            {/* RANK — RESPONSIVE BACKGROUND NUMBER (Desktop) */}
            <div
                className="
                    absolute hidden sm:block 
                    -bottom-4 -left-6 lg:-left-10 
                    text-[7rem] lg:text-[9rem] font-black 
                    text-transparent /* Make the fill transparent */
                    [-webkit-text-stroke:2px_rgba(255,255,255,0.7)] /* Add a subtle white outline */
                    group-hover:[-webkit-text-stroke:2px_rgba(16,185,129,0.3)] /* Glows emerald on hover */
                    transition-all duration-500 ease-out 
                    select-none pointer-events-none z-0 
                    tracking-tighter 
                    group-hover:-translate-y-2 group-hover:scale-105
                "
            >
                {idx + 1}
            </div>

            {/* CARD CONTAINER - Updated to Glassmorphism */}
            <div className="relative z-10 w-full bg-black/40 backdrop-blur-md rounded-2xl p-2 sm:p-2.5 
            border border-white/5 
            shadow-[0_10px_30px_rgba(0,0,0,0.5)] 
            group-hover:border-emerald-500/30 transition-all duration-500 ease-out 
            group-hover:shadow-[0_15px_40px_-10px_rgba(52,211,153,0.35)] group-hover:bg-black/60">

                {/* POSTER IMAGE */}
                <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-gray-900 shadow-inner ring-1 ring-transparent group-hover:ring-emerald-400/20 transition-all duration-500">

                    {/* Premium Glassmorphic Good Read Badge */}
                    {story?.isGoodRead && (
                        <div className="absolute top-2 right-2 z-20 bg-emerald-500/90 backdrop-blur-sm p-1.5 rounded-lg shadow-[0_4px_12px_rgba(16,185,129,0.4)] transition-transform duration-300 group-hover:scale-105">
                            <Bookmark size={14} className="text-white fill-white" />
                        </div>
                    )}

                    {/* Hover Glass Highlight Overlay */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-tr from-emerald-500/0 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out pointer-events-none" />

                    {story?.coverImage ? (
                        <LazyLoadImage
                            src={getOptimizedUrl(story.coverImage, 400)}
                            alt={story.title}
                            effect="blur"
                            placeholderSrc={getBlurPlaceholder(story.coverImage)}
                            wrapperClassName="w-full h-full !block"
                            className="w-full h-full object-cover transform-gpu origin-center transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#121212] text-gray-600 px-4 text-center">
                            <h3 className="text-sm font-semibold line-clamp-3 leading-snug">
                                {story?.title}
                            </h3>
                        </div>
                    )}

                    {/* Refined Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none opacity-100 group-hover:opacity-70 transition-opacity duration-500 ease-out z-0" />
                </div>

                {/* INFO SECTION */}
                <div className="mt-3 px-1 space-y-2 relative z-10">

                    {/* Title & Likes */}
                    <div className="flex items-start justify-between gap-3">
                        <h3 className="text-[15px] font-bold text-white group-hover:text-emerald-400 transition-colors duration-300 line-clamp-2 leading-snug flex-1" title={story?.title}>
                            {story?.title}
                        </h3>

                        {/* Likes Badge */}
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 group-hover:bg-emerald-500/20 px-2 py-1 rounded-lg border border-emerald-500/20 group-hover:border-emerald-400/50 shrink-0 pt-0.5 transition-all duration-300">
                            <Heart fill="currentColor" size={12} className="group-hover:scale-110 transition-transform duration-300" />
                            <span>{story?.likes || 0}</span>
                        </div>
                    </div>

                    {/* Author Info */}
                    <div className="flex items-center gap-2">
                        <img
                            src={getOptimizedUrl(story?.author?.profilePic, 50) || "default-avatar.png"}
                            alt={story?.author?.username || "Author"}
                            width="20"
                            height="20"
                            loading="lazy"
                            className="w-5 h-5 rounded-full object-cover bg-gray-800 border border-white/10 group-hover:border-emerald-400/50 transition-all duration-300"
                        />
                        <p className="text-xs font-medium text-gray-400 truncate max-w-[120px] tracking-wide">
                            {story?.author?.username || "Unknown Author"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(TopTrendStoryCard);