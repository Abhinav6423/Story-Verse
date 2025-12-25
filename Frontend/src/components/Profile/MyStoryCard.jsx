import { Pencil, Trash2 } from "lucide-react";

const MyStoryCard = ({ title, image, cardClass, status, category, time }) => {
    const date = time
        ? new Date(time).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        })
        : "";


    return (
        <div
            className={`
    relative flex-shrink-0
    w-full
    aspect-square
    rounded-3xl
    overflow-hidden
    bg-[#1a1a1a]
    cursor-pointer
    group
    transition-all duration-300
    shadow-[0_10px_40px_rgba(0,0,0,0.45)]
    hover:scale-[1.015]
    ${cardClass}
  `}
        >
            {/* Background Image */}
            <img
                src={image}
                alt="story"
                className="
      w-full h-full object-cover
      transition-transform duration-700
      group-hover:scale-110
    "
            />

            {/* Dark Fade Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

            {/* CATEGORY BADGE */}
            <span
                className="
      absolute top-4 left-4
      px-3 py-1
      bg-black/70
      text-white text-[11px]
      font-semibold tracking-wide
      rounded-full
      backdrop-blur-md
      border border-white/10
    "
            >
                {category}
            </span>

            {/* ACTION BUTTONS */}
            <div
                className="
      absolute top-3 right-3
      flex items-center gap-1
      bg-black/70 backdrop-blur-md
      rounded-full
      p-1.5
      border border-white/10
      opacity-0
      group-hover:opacity-100
      transition
    "
            >
                {/* Edit */}
                <button
                    className="
        p-2
        rounded-full
        hover:bg-white/10
        transition
      "
                    title="Edit"
                >
                    <Pencil size={14} className="text-white" />
                </button>

                {/* Delete */}
                <button
                    className="
        p-2
        rounded-full
        hover:bg-red-500/20
        transition
      "
                    title="Delete"
                >
                    <Trash2 size={14} className="text-red-500" />
                </button>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-sm sm:text-base font-semibold leading-snug line-clamp-2">
                    {title}
                </h3>
            </div>
        </div>


    );
};

export default MyStoryCard;
