import { Home, PlusCircle, Grid, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function MobileBottomNav() {
    const location = useLocation();

    const navItems = [
        { label: "Home", icon: Home, path: "/home" },
        { label: "Write", icon: PlusCircle, path: "/create" },
        { label: "Browse", icon: Grid, path: "/browse" },
        { label: "Profile", icon: User, path: "/profile" },
    ];

    return (
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
                {navItems.map(({ label, icon: Icon, path }) => {
                    const isActive = location.pathname === path;

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
    );
}

export default MobileBottomNav;
