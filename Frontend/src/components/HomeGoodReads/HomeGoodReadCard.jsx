import React, { memo } from "react";
import { ThumbsUp, Play, BookOpen } from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
// 1. Import your optimization helper
import { getOptimizedUrl, getBlurPlaceholder } from "../../utils/cloudinaryHelper";

function HomeGoodReadCard({ story, rank }) {
  return (
    <div
      className="
        group
        relative
        min-w-[300px]
        rounded-xl
        p-3
        flex gap-4
        bg-zinc-900/40
        backdrop-blur-md
        border border-white/5
        transition-all duration-300
        hover:bg-zinc-800/60
        hover:border-emerald-500/40
        hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]
        cursor-pointer
      "
    >
      {/* === RANK BADGE (Netflix Style) === */}
      {rank && (
        <div className="absolute -top-2 -left-2 z-20 w-8 h-8 flex items-center justify-center bg-emerald-600 text-white text-xs font-black rounded-lg shadow-lg rotate-[-10deg] group-hover:rotate-0 transition-transform">
          #{rank}
        </div>
      )}

      {/* === COVER IMAGE CONTAINER === */}
      <div className="relative w-[90px] h-[120px] flex-shrink-0 rounded-lg overflow-hidden bg-zinc-800 shadow-lg">
        {story?.coverImage ? (
          <>
            <LazyLoadImage
              // 2. OPTIMIZE: Fetch slightly larger for crispness
              src={getOptimizedUrl(story.coverImage, 200)}
              alt={story.title}
              effect="blur"
              placeholderSrc={getBlurPlaceholder(story.coverImage)}
              wrapperClassName="w-full h-full !block"
              className="
                w-full
                h-full
                object-cover
                transition-transform
                duration-500
                group-hover:scale-110
              "
            />
            {/* HOOK: Hover Overlay with Play Button */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300">
                <BookOpen size={14} fill="currentColor" className="text-white ml-0.5" />
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 bg-zinc-800/50 p-2 text-center">
            <BookOpen size={20} className="mb-1 opacity-50" />
            <span className="text-[10px] font-medium leading-tight line-clamp-2">
              No Cover
            </span>
          </div>
        )}
      </div>

      {/* === RIGHT CONTENT === */}
      <div className="flex flex-col justify-center flex-1 min-w-0 py-1">

        {/* TOP: Title & Genre */}
        <div className="space-y-1 mb-2">
          {/* Genre Tag (Tiny Hook) */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
              {story?.genre || "Story"}
            </span>
            <span className="text-[10px] text-zinc-500">•</span>
            <span className="text-[10px] text-zinc-500">5 min read</span>
          </div>

          {/* TITLE */}
          <h3 className="text-base font-bold text-white leading-snug truncate group-hover:text-emerald-400 transition-colors">
            {story.title}
          </h3>
        </div>

        {/* MIDDLE: Author */}
        <div className="flex items-center gap-2 mb-3">
          <img
            src={getOptimizedUrl(story.author?.profilePic, 50) || "default-avatar.png"}
            alt={story.author?.username || "Author"}
            loading="lazy"
            className="w-5 h-5 rounded-full object-cover border border-white/10"
          />
          <p className="text-xs text-zinc-400 font-medium truncate group-hover:text-zinc-200 transition-colors">
            {story?.author?.username || "Unknown Author"}
          </p>
        </div>

        {/* BOTTOM: Social Proof (The Addiction Factor) */}
        <div className="flex items-center gap-3 mt-auto">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
            <ThumbsUp size={12} className="text-emerald-400 fill-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-400">
              {story?.totalGoodReads || 0}
            </span>
          </div>

          {/* Visual indicator of "Hot" content */}
          {(story?.totalGoodReads > 100) && (
            <span className="text-[10px] text-orange-400 font-bold flex items-center gap-1">
              🔥 Hot
            </span>
          )}
        </div>

      </div>
    </div>
  );
}

// 5. Use memo to prevent re-renders
export default memo(HomeGoodReadCard);