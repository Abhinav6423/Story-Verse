import { Link } from "react-router-dom";

const StoryCard = ({ story }) => {
    return (
        <>

            <div className="relative h-[380px] sm:h-[420px] md:h-[480px] lg:h-[520px] w-full overflow-hidden rounded-xl group">

                {/* Background Image */}
                <img
                    src={story.coverImage}
                    alt={story.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                {/* CONTENT (BOTTOM ALIGNED) */}
                <div className="relative z-10 h-full flex flex-col justify-end px-4 sm:px-6 md:px-8 pb-6 sm:pb-8 space-y-3">

                    {/* META */}
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-300">
                        <span className="font-semibold text-green-400">Trending</span>
                        <span className="opacity-70">•</span>
                        <span>{story.category || "Drama"}</span>
                    </div>

                    {/* TITLE */}
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-white leading-snug">
                        {story.title}
                    </h2>

                    {/* DESCRIPTION */}
                    <p className="text-xs sm:text-sm md:text-base text-gray-300 line-clamp-2 max-w-2xl">
                        {story.description}
                    </p>

                    {/* ACTION */}
                    <div className="pt-2">
                        <Link
                            to={`/story/${story._id}`}
                            className="
              inline-block
              bg-red-600 hover:bg-red-700
              text-white font-semibold
              text-sm sm:text-base
              px-5 py-2.5 sm:px-6 sm:py-3
              rounded-md
              transition-all duration-300
            "
                        >
                            Read Now
                        </Link>
                    </div>
                </div>
            </div>
        </>

    );
};

export default StoryCard;
