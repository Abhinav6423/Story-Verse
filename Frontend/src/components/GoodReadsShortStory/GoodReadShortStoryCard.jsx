import React, { memo } from "react";
import { ThumbsUp } from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const GoodReadShortStoryCard = ({ story }) => {
    return (
        <div className="w-full bg-[#212121] p-2 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            <div className="w-full">
                {/* POSTER IMAGE */}
                <div
                    className="
                        relative
                        aspect-[2/3]
                        rounded-xl
                        overflow-hidden
                        bg-gray-800
                        shadow-sm
                        hover:shadow-lg
                        transition-shadow
                    "
                >
                    {story?.coverImage ? (
                        <LazyLoadImage
                            src={story.coverImage}
                            alt={story.title}
                            effect="blur"
                            /* CRITICAL FIX: Forces wrapper to fill the aspect ratio container */
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
                        /* Fallback for missing image - Themed for Dark Mode */
                        <div
                            className="
                                w-full
                                h-full
                                flex
                                items-center
                                justify-center
                                bg-zinc-800
                                text-zinc-500
                                px-4
                                text-center
                            "
                        >
                            <h3 className="text-sm font-semibold leading-snug line-clamp-4 text-zinc-300">
                                {story?.title}
                            </h3>
                        </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* INFO SECTION */}
                <div className="mt-2 space-y-1.5">

                    {/* TITLE + LIKES */}
                    <div className="flex items-start justify-between gap-2">
                        <h3
                            className="text-sm font-semibold text-white leading-tight truncate"
                            title={story?.title}
                        >
                            {story?.title}
                        </h3>

                        <div className="flex items-center gap-1 text-xs font-medium text-emerald-400 shrink-0">
                            <ThumbsUp fill="currentColor" size={14} />
                            <span>{story?.likes || 0}</span>
                        </div>
                    </div>

                    {/* AUTHOR */}
                    <div className="flex items-center gap-2">
                        <img
                            src={story?.author?.profilePic}
                            alt={story?.author?.username || "Author"}
                            /* Performance: Explicit dimensions */
                            width="20"
                            height="20"
                            loading="lazy"
                            className="w-5 h-5 rounded-full object-cover bg-gray-700"
                        />
                        <p className="text-xs text-zinc-400 truncate">
                            {story?.author?.username || "Unknown"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(GoodReadShortStoryCard);