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
        <div className="w-full cursor-pointer">

            {/* BOOK COVER */}
            <div
                className="
                aspect-[3/4]
                w-full
                rounded-xl
                overflow-hidden
                bg-gray-100
                transition
                hover:shadow-lg
            "
            >
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* TITLE */}
            <h3 className="mt-2 text-sm font-medium text-gray-900 leading-snug">
                {title}
            </h3>
        </div>
    );

};

export default MyStoryCard;
