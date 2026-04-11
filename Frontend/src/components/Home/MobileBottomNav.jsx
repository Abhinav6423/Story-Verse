import React, { useMemo } from "react";
import { Home, PlusCircle, Grid, User , Video } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const MobileBottomNav = ({ showBrowse, setShowBrowse, onCloseBrowse }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = useMemo(() => [
        { label: "Home", icon: Home, path: "/home", action: "navigate" },
        { label: "Write", icon: PlusCircle, path: "/create", action: "navigate" },
        { label: "Browse", icon: Grid, action: "browse" },
        { label: "Profile", icon: User, path: "/profile", action: "navigate" },
        { label : "Trailers", icon: Video, path: "/reels", action: "navigate" },
    ], []);

    const handleNavClick = (item) => {
        if (item.action === "browse") {
            // Toggle popup
            setShowBrowse();
        } else {
            // Force close popup for all other tabs
            onCloseBrowse();
            navigate(item.path);
        }
    };

    return (
        <nav
            className="
                fixed bottom-0 left-0 right-0
                z-50 lg:hidden
                bg-[#0b1412]
                border-t border-[#1f3d36]
                shadow-[0_-10px_30px_rgba(0,0,0,0.6)]
                h-16
                pb-safe 
            "
        >
            <div className="flex justify-between items-center h-full w-full">
                {navItems.map((item) => {
                    const isActive = item.path && location.pathname === item.path;
                    const isActiveBrowse = item.action === "browse" && showBrowse;
                    const active = isActive || isActiveBrowse;

                    return (
                        <button
                            key={item.label}
                            onClick={(e) => {
                                if (item.action === "browse") e.stopPropagation();
                                handleNavClick(item);
                            }}
                            className="
                                group relative w-full h-full
                                flex flex-col items-center justify-center gap-1
                                active:scale-95 transition-transform duration-100
                            "
                        >
                            {active && (
                                <span className="absolute top-2 w-1 h-1 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]" />
                            )}

                            <item.icon
                                size={24}
                                strokeWidth={active ? 2.5 : 2}
                                className={`
                                    transition-colors duration-300
                                    ${active
                                        ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                                        : "text-[#6b8f83] group-hover:text-gray-300"
                                    }
                                `}
                            />
                            <span
                                className={`
                                    text-[10px] font-medium tracking-wide transition-colors duration-300
                                    ${active ? "text-emerald-400" : "text-[#6b8f83] group-hover:text-gray-300"}
                                `}
                            >
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default MobileBottomNav;