import { Home, PlusCircle, Grid, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CategoryPopup from "./CategoryPopup.jsx";

const MobileBottomNav = ({ showBrowse, setShowBrowse, onAnyNavClick }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { label: "Home", icon: Home, path: "/home" },
        { label: "Write", icon: PlusCircle, path: "/create" },
        { label: "Browse", icon: Grid, action: "browse" },
        { label: "Profile", icon: User, path: "/profile" },
    ];

    const handleBrowseClick = () => {
        setShowBrowse((prev) => !prev);
    };

    const handleNavClick = (path) => {
        setShowBrowse(false);
        navigate(path);
    };

    return (
        <>
            {/* MOBILE BOTTOM NAV */}
            <nav
                className="
          fixed bottom-0 left-0 right-0
          z-50 bg-white
          border-t border-gray-200
          md:hidden
        "
            >
                <div className="flex justify-around items-center h-16">
                    {navItems.map(({ label, icon: Icon, path, action }) => {
                        const isActive = path && location.pathname === path;

                        // BROWSE BUTTON
                        if (action === "browse") {
                            return (
                                <button
                                    key={label}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleBrowseClick();
                                    }}
                                    className="flex flex-col items-center gap-1 text-xs"
                                >
                                    <Icon
                                        size={22}
                                        strokeWidth={2}
                                        className={
                                            showBrowse ? "text-emerald-600" : "text-gray-400"
                                        }
                                    />
                                    <span
                                        className={
                                            showBrowse ? "text-emerald-600" : "text-gray-400"
                                        }
                                    >
                                        {label}
                                    </span>
                                </button>
                            );
                        }

                        // NORMAL NAV BUTTON
                        return (
                            <button
                                key={label}
                                onClick={() => handleNavClick(path)}
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
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* CATEGORY POPUP */}
            <CategoryPopup
                open={showBrowse}
                onClose={() => setShowBrowse(false)}
                onSelect={(category) => {
                    setShowBrowse(false);
                    navigate(`/home?category=${category}`);
                }}
            />
        </>
    );
};

export default MobileBottomNav;
