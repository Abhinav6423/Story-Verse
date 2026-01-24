import React from "react";
import { ThumbsUp } from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

function HomeGoodReadCard({ story, rank }) {
  return (
    <div
      className="
        relative
        min-w-[280px]
        rounded-xl
        px-4 py-3
        flex gap-4
        shadow-sm
        hover:shadow-md
        transition
        bg-[#212121]
        border border-white/5
      "
    >
      {/* COVER IMAGE CONTAINER */}
      {/* Fixed width/height ensures no layout shift (CLS) */}
      <div className="w-[80px] h-[100px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-800">
        {story?.coverImage ? (
          <LazyLoadImage
            src={story.coverImage}
            alt={story.title}
            effect="blur"
            /* IMPORTANT: This library creates a wrapper <span>. 
               We must force that wrapper to fill the parent div. */
            wrapperClassName="w-full h-full !block"
            className="
              w-full
              h-full
              object-cover
              hover:scale-105
              transition-transform
              duration-300
            "
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400 px-2 text-center bg-zinc-800">
            <h3 className="text-xs font-semibold leading-snug line-clamp-3">
              {story.title}
            </h3>
          </div>
        )}
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex flex-col justify-between flex-1 py-1 min-w-0">

        {/* TOP section */}
        <div className="space-y-1.5">
          {/* TITLE: Use CSS truncate instead of JS slice for better performance */}
          <h3 className="text-sm font-semibold text-white leading-[1.25] truncate">
            {story.title}
          </h3>

          {/* AUTHOR */}
          <div className="flex items-center gap-2">
            <img
              src={story.author?.profilePic}
              alt={story.author?.username || "Author"}
              /* PERFORMANCE: Explicit width/height prevents layout shift */
              width="20"
              height="20"
              loading="lazy"
              className="w-5 h-5 rounded-full object-cover bg-gray-700"
            />
            <p className="text-xs text-zinc-300 font-medium truncate">
              {story?.author?.username || "Unknown"}
            </p>
          </div>
        </div>

        {/* BOTTOM: GOOD READS */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
          <ThumbsUp size={14} className="fill-emerald-400/20 stroke-emerald-400" />
          <span>{story?.totalGoodReads || 0} Good reads</span>
        </div>
      </div>
    </div>
  );
}

export default HomeGoodReadCard;