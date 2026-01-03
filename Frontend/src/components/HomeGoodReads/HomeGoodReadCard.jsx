import { ThumbsUp } from "lucide-react";

function HomeGoodReadCard({ story, rank }) {
  return (
    <div
      className="
        relative
        min-w-[280px]
        bg-white
        rounded-xl
        px-4 py-3
        flex gap-4
        shadow-sm
        hover:shadow-md
        transition
      "
    >
      {/* RANK BADGE */}
      <span
        className="
          absolute
          -top-2 -left-2
          w-7 h-7
          rounded-full
          bg-yellow-400
          text-xs
          font-bold
          flex items-center justify-center
        "
      >
        #{rank}
      </span>

      {/* COVER */}
      <div className="w-[80px] h-[100px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
        {story?.coverImage ? (
          <img
            src={story.coverImage}
            alt={story.title}
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
          <div
            className="
        w-full
        h-full
        flex
        items-center
        justify-center
        bg-sky-100
        text-sky-900
        px-4
        text-center
      "
          >
            <h3 className="text-lg font-semibold leading-snug line-clamp-4">
              {story.title}
            </h3>
          </div>
        )}
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex flex-col justify-between flex-1 py-1">
        {/* TOP: TITLE + AUTHOR */}
        <div className="space-y-1.5">
          <h3 className="text-sm font-semibold text-gray-900 leading-[1.25]">
            {story.title?.length > 20
              ? `${story.title.slice(0, 20)}...`
              : story.title}
          </h3>

          {/* AUTHOR */}
          <div className="flex items-center gap-2">
            <img
              src={story.author?.profilePic}
              alt={story.author?.username}
              className="w-5 h-5 rounded-full object-cover"
            />
            <p className="text-xs text-gray-500 font-semibold truncate">
              {story?.author?.username}
            </p>
          </div>
        </div>

        {/* BOTTOM: GOOD READS */}
        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
          <ThumbsUp size={14} strokeWidth={2} />
          <span>{story?.totalGoodReads} Good reads</span>
        </div>
      </div>
    </div>
  );
}

export default HomeGoodReadCard;
