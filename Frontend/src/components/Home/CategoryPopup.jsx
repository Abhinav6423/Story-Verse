import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { categories } from "../../utils/Categories.jsx";

const CategoryPopup = ({ open, onClose, onSelect }) => {
  const popupRef = useRef(null);

  /* ================= BODY SCROLL LOCK ================= */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* BACKDROP */}
      <div className="fixed inset-0 bg-black/30 z-40" />

      {/* POPUP */}
      <div
        ref={popupRef}
        className="
                    fixed z-50
                    bottom-[var(--mobile-bottom-nav-height)]
                    sm:bottom-auto
                    left-0 sm:left-auto
                    right-0 sm:right-6
                    sm:top-20
                    w-full sm:w-[420px]
                    bg-white
                    rounded-t-3xl sm:rounded-2xl
                    p-4
                    shadow-xl
                    animate-popup
                "
      >
        {/* CATEGORY GRID */}
        <div className="grid grid-cols-3 gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;

            return (
              <Link
                key={cat.name}
                to={`/category/${cat.name.toLowerCase()}`}
                onClick={() => {
                  onSelect(cat.name);
                  onClose();
                }}
                className="flex items-center justify-center"
              >
                <div
                  className="
                                        w-full
                                        flex flex-col items-center justify-center
                                        gap-1
                                        p-4
                                        rounded-xl
                                        border
                                        border-emerald-200
                                        bg-emerald-50/40
                                        hover:bg-emerald-100/60
                                        transition
                                    "
                >
                  <Icon size={22} className="text-emerald-800" />
                  <span className="text-sm font-medium text-emerald-900 text-center">
                    {cat.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CategoryPopup;
