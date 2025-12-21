import { useState } from "react";
const StoryCard = ({ cardClass, story }) => {
    return (
        <div
            className={`
    relative flex-shrink-0
    w-full sm:w-72 md:w-80
    h-[360px]
    rounded-3xl overflow-hidden
    shadow-[0_12px_40px_rgba(0,0,0,0.2)]
    bg-gray-200 cursor-pointer group
    transition-all duration-300
    ${cardClass}
  `}
        >
            {/* Background Image */}
            <img
                src={story?.coverImage}
                alt="story"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* SOFT GRADIENT (BOTTOM ONLY) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

            {/* TOP BADGE (like NEWS) */}
            <span
                className="
      absolute top-4 left-4
      px-3 py-1
      bg-white/90 text-slate-800
      text-[11px] font-semibold tracking-wide
      rounded-full shadow-sm
      backdrop-blur
    "
            >
                {story?.category}
            </span>

            {/* BOTTOM CONTENT */}
            <div className="absolute bottom-10 left-4 right-4 text-white space-y-2">

                {/* META */}
                <div className="text-[11px] text-white/80 flex items-center gap-2">
                    <span className="font-medium">John Doe</span>
                    <span className="w-1 h-1 rounded-full bg-white/60"></span>
                    <span>
                        {new Date(story?.createdAt).toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}
                    </span>
                </div>

                {/* TITLE */}
                <h3 className="text-2xl font-bold  leading-tight tracking-tight">
                    {story?.title}
                </h3>
            </div>
        </div>

    );
};

export default StoryCard;
