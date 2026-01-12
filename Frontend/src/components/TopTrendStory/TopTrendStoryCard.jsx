import { ThumbsUp, Bookmark } from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const StoryCard = ({ story, idx }) => {
    return (
        <>
            {/* OUTER WRAPPER */}
            <div className="relative w-full">
                {/* RANK — RESPONSIVE BACKGROUND */}
                <div
                    className="
        absolute
        hidden sm:block
        bottom-0
        sm:-left-9
        text-[4.5rem]
        sm:text-[7rem]
        font-extrabold
        text-white/70
        leading-none
        select-none
        pointer-events-none
        z-0
      "
                >
                    {idx + 1}
                </div>

                {/* CARD */}
                <div className="relative z-10 w-full bg-[#212121] rounded-xl p-2 sm:p-3">
                    {/* POSTER */}
                    <div
                        className="
          relative
          aspect-[2/3]
          w-full
          rounded-xl
          overflow-hidden
          bg-black
          shadow-lg
          group
        "
                    >
                        {story?.isGoodRead && (
                            <div className="absolute top-2 right-2 z-20 bg-emerald-600 p-1.5 rounded-md">
                                <Bookmark size={14} fill="currentColor" className="text-white" />
                            </div>
                        )}

                        {story?.coverImage ? (
                            <LazyLoadImage
                                src={story.coverImage}
                                alt={story.title}
                                effect="blur"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-white px-3 text-center">
                                <h3 className="text-base sm:text-lg font-semibold line-clamp-4">
                                    {story?.title}
                                </h3>
                            </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    </div>

                    {/* INFO */}
                    <div className="mt-2 sm:mt-3 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm sm:text-base font-semibold text-white truncate">
                                {story?.title}
                            </h3>

                            <div className="flex items-center gap-1 text-xs sm:text-sm text-emerald-400 shrink-0">
                                <ThumbsUp fill="green" size={14} />
                                <span>{story?.likes}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <img
                                src={story?.author?.profilePic}
                                className="w-4 h-4 rounded-full object-cover"
                            />
                            <p className="text-xs sm:text-sm text-gray-400 truncate">
                                {story?.author?.username || "Aleen Kizoff"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>


    );







};

export default StoryCard;
