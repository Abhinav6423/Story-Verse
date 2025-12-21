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
        shadow-[0_10px_35px_rgba(0,0,0,0.18)]
        bg-gray-200
        cursor-pointer
        group
        transition-all
        duration-300
        ${cardClass}
    `}
        >
            {/* Background Image */}
            <img
                src={image}
                alt="story"
                className="w-full h-full object-cover transition duration-700"
            />

            {/* Fade Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

            {/* CATEGORY BADGE */}
            <span
                className="
            absolute top-4 left-4
            px-3 py-1
            bg-white text-black text-xs font-medium
            rounded-full shadow-md
            backdrop-blur-md
        "
            >
                {category}
            </span>

            {/* ACTION BUTTONS */}
            <div
                className="
        absolute top-3 right-3
        flex items-center gap-1
        bg-white/60 backdrop-blur-md
        rounded-full
        p-1
        shadow-sm
    "
            >
                {/* Edit */}
                <button
                    className="
            p-1.5
            rounded-full
            hover:bg-gray-100
            transition
        "
                    title="Edit"
                >
                    <Pencil size={14} className="text-gray-700" />
                </button>

                {/* Delete */}
                <button
                    className="
            p-1.5
            rounded-full
            hover:bg-red-50
            transition
        "
                    title="Delete"
                >
                    <Trash2 size={14} className="text-red-600" />
                </button>
            </div>



            {/* Bottom Content */}
            <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">

                <h3 className="text-sm font-semibold leading-tight">
                    {title}
                </h3>
            </div>
        </div>

    );
};

export default MyStoryCard;
