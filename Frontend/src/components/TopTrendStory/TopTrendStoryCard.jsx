import React, { memo } from "react";
import { ThumbsUp, Bookmark, Flame } from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
// 1. Import your optimization helper
import { getOptimizedUrl, getBlurPlaceholder } from "../../utils/cloudinaryHelper";

const TopTrendStoryCard = ({ story, idx }) => {
    return (
        <div className="relative w-full group perspective-1000">

            {/* RANK — RESPONSIVE BACKGROUND NUMBER (Desktop) */}
            <div className="absolute hidden sm:block -bottom-4 -left-6 lg:-left-10 text-[7rem] lg:text-[9rem] font-black text-[#050505] [-webkit-text-stroke:3px_#047857] lg:[-webkit-text-stroke:4px_#047857] drop-shadow-[0_10px_15px_rgba(4,120,87,0.4)] group-hover:[-webkit-text-stroke:4px_#34d399] group-hover:drop-shadow-[0_0_25px_rgba(52,211,153,0.6)] transition-all duration-500 ease-out select-none pointer-events-none z-0 tracking-tighter group-hover:-translate-y-2 group-hover:scale-105">
                {idx + 1}
            </div>

            {/* CARD CONTAINER */}
            <div className="relative z-10 w-full bg-gradient-to-b from-[#1E1E1E] to-[#0A0A0A] rounded-2xl p-2 sm:p-3 
            border border-emerald-500/30 sm:border-emerald-500/10 
            shadow-[0_0_20px_rgba(16,185,129,0.15)] sm:shadow-xl 
            group-hover:border-emerald-400/50 transition-all duration-500 ease-out 
            group-hover:shadow-[0_15px_40px_-10px_rgba(52,211,153,0.35)] group-hover:bg-gradient-to-b group-hover:from-[#222724] group-hover:to-[#0A0A0A]">

                {/* POSTER IMAGE */}
                <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-zinc-900 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] ring-1 ring-white/10 group-hover:ring-emerald-400/40 transition-all duration-500">

                    {/* TRENDING BADGE (New) */}
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20 flex items-center gap-1.5 px-2.5 py-1.5 
    bg-black/20 backdrop-blur-xl rounded-lg
    border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.5)]
    ring-1 ring-inset ring-white/10 
    transition-all duration-300 ease-out group-hover:scale-105 group-hover:bg-black/30 group-hover:border-emerald-400/30">

                        <Flame
                            size={14}
                            className="text-emerald-400 fill-emerald-400/30 drop-shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse"
                        />

                        <span className="text-[10px] sm:text-xs font-extrabold tracking-[0.15em] uppercase 
        bg-gradient-to-br from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent drop-shadow-md mt-[1px]">
                            #{idx + 1} Trending
                        </span>
                    </div>

                    {/* Premium Glassmorphic Good Read Badge */}
                    {story?.isGoodRead && (
                        <div className="absolute top-2 right-2 z-20 bg-zinc-900/60 backdrop-blur-md border border-emerald-400/30 p-1.5 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105">
                            <Bookmark size={14} className="text-emerald-400 fill-emerald-400/20 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]" />
                        </div>
                    )}

                    {/* Hover Glass Highlight Overlay (New) */}
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
                        <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-500 px-4 text-center">
                            <h3 className="text-sm font-semibold line-clamp-3 leading-snug">
                                {story?.title}
                            </h3>
                        </div>
                    )}

                    {/* Refined Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/95 via-[#050505]/20 to-transparent pointer-events-none opacity-90 group-hover:opacity-60 transition-opacity duration-500 ease-out z-0" />
                </div>

                {/* INFO SECTION */}
                <div className="mt-3 sm:mt-4 space-y-2.5 px-1 relative z-10">

                    {/* Title & Likes */}
                    <div className="flex items-start justify-between gap-3">
                        <h3 className="text-sm sm:text-base font-bold text-zinc-100 group-hover:text-emerald-300 transition-colors duration-300 truncate leading-tight" title={story?.title}>
                            {story?.title}
                        </h3>

                        {/* Likes Badge */}
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-emerald-400 bg-emerald-500/10 group-hover:bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/20 group-hover:border-emerald-400/50 shrink-0 font-bold shadow-[0_0_10px_rgba(52,211,153,0.1)] group-hover:shadow-[0_0_15px_rgba(52,211,153,0.3)] transition-all duration-300">
                            <ThumbsUp fill="currentColor" size={12} className="sm:w-3.5 sm:h-3.5 group-hover:scale-110 transition-transform duration-300" />
                            <span>{story?.likes || 0}</span>
                        </div>
                    </div>

                    {/* Author Info */}
                    <div className="flex items-center gap-2.5">
                        <img
                            src={getOptimizedUrl(story?.author?.profilePic, 50) || "default-avatar.png"}
                            alt={story?.author?.username || "Author"}
                            width="20"
                            height="20"
                            loading="lazy"
                            className="w-5 h-5 rounded-full object-cover bg-zinc-800 ring-2 ring-transparent group-hover:ring-emerald-400/50 transform-gpu group-hover:scale-110 transition-all duration-300 ease-out"
                        />
                        <p className="text-xs sm:text-sm font-medium text-zinc-400 group-hover:text-zinc-100 transition-colors duration-300 truncate">
                            {story?.author?.username || "Unknown Author"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(TopTrendStoryCard);