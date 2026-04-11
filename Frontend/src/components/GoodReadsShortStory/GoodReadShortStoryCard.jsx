import React, { memo } from "react";
import { ThumbsUp , Heart } from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
// 1. Import your optimization helper
import { getOptimizedUrl, getBlurPlaceholder } from "../../utils/cloudinaryHelper";

const GoodReadShortStoryCard = ({ story }) => {
    return (
        <div className="
            group 
            w-full 
            bg-black/40 backdrop-blur-md 
            p-2.5 
            rounded-xl 
            border border-white/5 
            hover:border-emerald-500/30 hover:bg-black/60
            transition-all duration-300
            shadow-lg
        ">
            <div className="w-full">
                {/* POSTER IMAGE */}
                <div
                    className="
                        relative
                        aspect-[2/3]
                        rounded-lg
                        overflow-hidden
                        bg-gray-900
                        shadow-inner
                    "
                >
                    {story?.coverImage ? (
                        <LazyLoadImage
                            // 2. OPTIMIZE: Resize to 400px (standard card width)
                            src={getOptimizedUrl(story.coverImage, 400)}
                            alt={story.title}
                            effect="blur"
                            // 3. OPTIMIZE: Tiny 30px blur placeholder
                            placeholderSrc={getBlurPlaceholder(story.coverImage)}
                            /* CRITICAL FIX: Forces wrapper to fill the aspect ratio container */
                            wrapperClassName="w-full h-full !block"
                            className="
                                w-full
                                h-full
                                object-cover
                                group-hover:scale-105
                                transition-transform
                                duration-500
                            "
                        />
                    ) : (
                        /* Fallback for missing image - Themed for Dark Mode */
                        <div
                            className="
                                w-full
                                h-full
                                flex
                                items-center
                                justify-center
                                bg-[#121212]
                                text-gray-600
                                px-4
                                text-center
                            "
                        >
                            <h3 className="text-sm font-semibold leading-snug line-clamp-4 text-gray-500">
                                {story?.title}
                            </h3>
                        </div>
                    )}

                    {/* Gradient Overlay - Slightly stronger at the bottom for text contrast if needed later */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>

                {/* INFO SECTION */}
                <div className="mt-3 px-1 space-y-2">

                    {/* TITLE + LIKES */}
                    <div className="flex items-start justify-between gap-3">
                        <h3
                            className="text-[15px] font-bold text-white leading-snug line-clamp-2 tracking-wide"
                            title={story?.title}
                        >
                            {story?.title}
                        </h3>

                        {/* Updated to a sleek Heart icon */}
                        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400/80 group-hover:text-emerald-400 transition-colors shrink-0 pt-0.5">
                            <Heart size={14} className="stroke-2" />
                            <span>{story?.likes || 0}</span>
                        </div>
                    </div>

                    {/* AUTHOR */}
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <img
                                // 4. OPTIMIZE: Resize avatar to 50px
                                src={getOptimizedUrl(story?.author?.profilePic, 50) || "default-avatar.png"}
                                alt={story?.author?.username || "Author"}
                                /* Performance: Explicit dimensions */
                                width="20"
                                height="20"
                                loading="lazy"
                                className="w-5 h-5 rounded-full object-cover bg-gray-800 border border-white/10"
                            />
                        </div>
                        <p className="text-xs font-medium text-gray-400 truncate tracking-wide">
                            {story?.author?.username || "Unknown"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(GoodReadShortStoryCard);