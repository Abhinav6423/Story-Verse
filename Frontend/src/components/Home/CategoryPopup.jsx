import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { categories } from "../../utils/Categories.jsx";

const CategoryPopup = ({ open, onClose, onSelect }) => {

  /* LOCK BODY SCROLL */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* POPUP CONTAINER */}
      <div
        className="
          fixed z-[70]
          bottom-20 sm:bottom-auto
          left-4 sm:left-auto
          right-4 sm:right-6
          sm:top-20
          w-auto sm:w-[420px]
          bg-[#0b1412]
          rounded-2xl
          p-4
          border border-[#1f3d36]
          shadow-[0_0_40px_rgba(16,185,129,0.15)]
          
          /* USE THE CUSTOM CSS CLASS HERE */
          popup-animation
        "
      >
        <div className="grid grid-cols-3 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;

            return (
              <Link
                key={cat.name}
                to={`/category/${cat.name}`}
                onClick={() => {
                  onSelect(cat.name);
                  onClose();
                }}
                className="
                  group
                  flex flex-col items-center justify-center
                  gap-2
                  p-4
                  rounded-xl
                  bg-[#0f2a24]
                  border border-[#1f3d36]
                  
                  /* HOVER EFFECTS */
                  hover:bg-[#143b33]
                  hover:border-emerald-400/40
                  hover:shadow-[0_0_15px_rgba(52,211,153,0.15)]
                  active:scale-95
                  transition-all duration-200
                "
              >
                <Icon
                  size={24}
                  strokeWidth={2}
                  className="
                    text-emerald-400
                    group-hover:text-emerald-300
                    group-hover:scale-110
                    transition-transform duration-200
                  "
                />

                <span
                  className="
                    text-xs sm:text-sm font-medium
                    text-emerald-100
                    group-hover:text-white
                    text-center
                  "
                >
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>,
    document.body
  );
};

export default CategoryPopup;