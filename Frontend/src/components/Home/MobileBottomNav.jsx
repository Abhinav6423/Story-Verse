import { Home, PlusCircle, Grid, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import CategoryPopup from "./CategoryPopup.jsx";
function MobileBottomNav() {
    const location = useLocation();
    const navigate = useNavigate();
    const [showBrowse, setShowBrowse] = useState(false);

    const navItems = [
        { label: "Home", icon: Home, path: "/home" },
        { label: "Write", icon: PlusCircle, path: "/create" },
        { label: "Browse", icon: Grid, action: "browse" }, // 👈 special
        { label: "Profile", icon: User, path: "/profile" },
    ];

    return (
        <>
            {/* ================= MOBILE NAV ================= */}
            <nav
                className="
          fixed bottom-0 left-0 right-0
          z-50
          bg-white
          border-t border-gray-200
          md:hidden
        "
            >
                <div className="flex justify-around items-center h-16">
                    {navItems.map(({ label, icon: Icon, path, action }) => {
                        const isActive = path && location.pathname === path;

                        // 👉 BROWSE BUTTON (NO ROUTE CHANGE)
                        if (action === "browse") {
                            return (
                                <button
                                    key={label}
                                    onClick={() => setShowBrowse(true)}
                                    className="flex flex-col items-center gap-1 text-xs"
                                >
                                    <Icon
                                        size={22}
                                        strokeWidth={2}
                                        className={
                                            showBrowse
                                                ? "text-emerald-600"
                                                : "text-gray-400"
                                        }
                                    />
                                    <span
                                        className={
                                            showBrowse
                                                ? "text-emerald-600"
                                                : "text-gray-400"
                                        }
                                    >
                                        {label}
                                    </span>
                                </button>
                            );
                        }

                        // 👉 NORMAL NAV LINKS
                        return (
                            <Link
                                key={label}
                                to={path}
                                className="flex flex-col items-center gap-1 text-xs"
                            >
                                <Icon
                                    size={22}
                                    strokeWidth={2}
                                    className={
                                        isActive ? "text-emerald-600" : "text-gray-400"
                                    }
                                />
                                <span
                                    className={
                                        isActive ? "text-emerald-600" : "text-gray-400"
                                    }
                                >
                                    {label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* ================= BROWSE POPUP ================= */}
            <CategoryPopup
                open={showBrowse}
                onClose={() => setShowBrowse(false)}
                onSelect={(category) => {
                    navigate(`/home?category=${category}`);
                    setShowBrowse(false);
                }}
            />
        </>
    );
}

export default MobileBottomNav;
