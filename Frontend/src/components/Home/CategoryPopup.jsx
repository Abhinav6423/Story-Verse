import {
    X,
    Skull,
    Search,
    Brain,
    Heart,
    Sparkles,
    Compass,
    Rocket,
    Sword
} from "lucide-react";

import { useEffect } from "react";



const CategoryPopup = ({ open, onClose, onSelect }) => {
    const categories = [
        { name: "Thriller", icon: Sword },
        { name: "Horror", icon: Skull },
        { name: "Crime", icon: Search },
        { name: "Motivation", icon: Brain },
        { name: "Romance", icon: Heart },
        { name: "Fantasy", icon: Sparkles },
        { name: "Adventure", icon: Compass },
        { name: "Sci-Fi", icon: Rocket },
        { name: "Action", icon: Sword },
    ];
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        // cleanup (important)
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);



    if (!open) return null;

    return (
        <>
            {/* BACKDROP */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-black/30 z-40"
            />

            {/* POPUP */}
            <div
                className="
          fixed z-50
          bottom-0 sm:bottom-auto
          left-0 sm:left-auto
          right-0 sm:right-6
          sm:top-20
          w-full sm:w-[450px]
          bg-white
          rounded-t-3xl sm:rounded-2xl
          p-3
          shadow-xl
          animate-slideUp sm:animate-fadeIn
        "
            >
                {/* HEADER */}


                {/* CATEGORY GRID */}
                <div className="grid grid-cols-3 gap-3">
                    {categories.map((cat) => {
                        const Icon = cat.icon; // 👈 THIS IS THE FIX

                        return (
                            <button
                                key={cat.name}
                                onClick={() => onSelect(cat.name)}
                                className="
          flex flex-col items-center justify-center
          p-4
          rounded-xl
          shadow-sm
          bg-gray-50
          hover:bg-emerald-50
          transition
        "
                            >
                                <Icon size={22} className="mb-1 text-gray-800" />
                                <span className="text-sm font-medium">
                                    {cat.name}
                                </span>
                            </button>
                        );
                    })}
                </div>

            </div>
        </>
    );
};

export default CategoryPopup;
