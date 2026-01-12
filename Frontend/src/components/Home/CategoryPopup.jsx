import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { categories } from "../../utils/Categories.jsx";

const CategoryPopup = ({ open, onClose, onSelect }) => {
  const popupRef = useRef(null);

  /* BODY SCROLL LOCK */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  if (!open) return null;

  
  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* POPUP */}
      <div
        ref={popupRef}
        className="
        fixed z-50
        bottom-16 sm:bottom-auto
        left-0 sm:left-auto
        right-0 sm:right-6
        sm:top-20
        w-full sm:w-[420px]
        bg-[#0b1412]
        rounded-t-3xl sm:rounded-2xl
        p-4
        border border-[#1f3d36]
        shadow-[0_0_40px_rgba(16,185,129,0.15)]
        animate-popup
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
                gap-1
                p-4
                rounded-xl
                bg-[#0f2a24]
                border border-[#1f3d36]
                hover:bg-[#143b33]
                hover:border-emerald-400/40
                hover:shadow-[0_0_20px_rgba(52,211,153,0.25)]
                transition-all duration-200
              "
              >
                <Icon
                  size={22}
                  className="
                  text-emerald-400
                  group-hover:text-emerald-300
                  transition
                "
                />

                <span
                  className="
                  text-sm font-medium
                  text-emerald-100
                  group-hover:text-emerald-50
                "
                >
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );

};


export default CategoryPopup;
