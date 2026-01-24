import { useState, useEffect, useRef, memo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, Plus, LayoutGrid, User, LogOut } from "lucide-react";
import CategoryPopup from "./CategoryPopup";
import { logoutUser } from "../../Api-calls/logout";
import { toast } from "react-toastify";
import logo from "../../Assets/logo.png";

const Navbar = ({ onAnyNavClick, setShowBrowse, showBrowse }) => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const profileMenuRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const hamburgerRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();

    /* ================= CLICK OUTSIDE HANDLER ================= */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                hamburgerRef.current?.contains(e.target) ||
                mobileMenuRef.current?.contains(e.target)
            ) {
                return;
            }

            if (showProfileMenu && profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
                setShowProfileMenu(false);
            }

            if (showMobileMenu) {
                setShowMobileMenu(false);
            }
        };

        // 'mousedown' is faster than 'click' for UI responsiveness
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showProfileMenu, showMobileMenu]);

    /* ================= CLOSE ON ROUTE CHANGE ================= */
    useEffect(() => {
        setShowProfileMenu(false);
        setShowMobileMenu(false);
        setShowBrowse(false);
    }, [location.pathname, setShowBrowse]);

    const handleLogout = async () => {
        toast.success("Logged out");
        navigate("/");
        try {
            await logoutUser();
        } catch (err) {
            console.error("Logout API failed silently");
        }
    };

    return (
        <>
            {/* ================= NAVBAR ================= */}
            <nav className="sticky top-0 z-50 backdrop-blur-md text-gray-100 h-16">

                {/* GLASS BACKGROUND */}
                <div className="absolute inset-0 bg-[#1A1A1A]/90"></div>

                <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center text-gray-100">

                    {/* LOGO - OPTIMIZED FOR LCP & CLS */}
                    <Link
                        to="/home"
                        className="font-serif italic text-2xl font-light tracking-tight text-gray-100 flex-shrink-0"
                    >
                        {/* 1. Explicit Width/Height prevents Layout Shift (CLS).
                           2. No lazy loading because this is the LCP element (Above the Fold).
                        */}
                        <img
                            src={logo}
                            alt="Story-Verse Logo"
                            width="112"  // 28 * 4 = 112px (approx for w-28)
                            height="40"  // Approx height to reserve space
                            className="w-22 sm:w-28 h-auto object-contain"
                        />
                    </Link>

                    {/* DESKTOP ACTIONS */}
                    <div className="ml-auto hidden md:flex items-center gap-6 text-sm text-gray-300">

                        <Link
                            to="/create"
                            className="flex items-center gap-1 hover:text-white transition"
                        >
                            <div className="border border-white/30 rounded-full p-0.5">
                                <Plus size={14} />
                            </div>
                            <span className="font-medium">Write story</span>
                        </Link>

                        <button
                            className="cursor-pointer flex gap-1 items-center hover:text-white transition"
                            onClick={() => setShowBrowse(p => !p)}
                            aria-label="Browse Categories"
                        >
                            <LayoutGrid size={18} />
                            <span className="font-medium">Browse</span>
                        </button>

                        <div className="relative" ref={profileMenuRef}>
                            <button
                                className="flex items-center gap-1 hover:text-white transition"
                                onClick={() => {
                                    onAnyNavClick();
                                    setShowProfileMenu(p => !p);
                                }}
                                aria-label="User Menu"
                            >
                                <User size={18} />
                                <span className="font-medium">Profile</span>
                            </button>

                            {showProfileMenu && (
                                <div className="absolute right-0 mt-3 w-48 bg-[#1f2a27] border border-white/10 rounded-xl shadow-xl p-0.5 animate-in fade-in zoom-in-95 duration-100">
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-gray-200 hover:bg-white/10 rounded-lg"
                                    >
                                        View Profile
                                    </Link>
                                    <Link
                                        to="/goodReads/ShortStory"
                                        className="block px-4 py-2 text-gray-200 hover:bg-white/10 rounded-lg"
                                    >
                                        Good Reads
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="cursor-pointer w-full px-4 py-2 text-left text-red-400 flex gap-2 hover:bg-white/10 rounded-lg"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* HAMBURGER (MOBILE) */}
                    <button
                        ref={hamburgerRef}
                        className="ml-auto md:hidden text-gray-200 p-2 -mr-2"
                        onClick={() => {
                            onAnyNavClick();
                            setShowMobileMenu(prev => !prev);
                        }}
                        aria-label="Open Menu"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </nav>

            {/* ================= MOBILE MENU ================= */}
            {showMobileMenu && (
                <>
                    <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)} />
                    <div
                        ref={mobileMenuRef}
                        className="fixed top-16 left-0 right-0 z-50 bg-[#1f2a27] shadow-xl border-b border-white/10"
                    >
                        <Link
                            to="/profile"
                            className="block px-4 py-3 text-gray-200 border-b border-white/10 hover:bg-white/10"
                        >
                            View Profile
                        </Link>
                        <Link
                            to="/goodReads/ShortStory"
                            className="block px-4 py-3 text-gray-200 border-b border-white/10 hover:bg-white/10"
                        >
                            View GoodReads
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-3 text-left text-red-400 flex gap-2 hover:bg-white/10"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </>
            )}

            {/* ================= CATEGORY POPUP ================= */}
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
};

// Memoize to prevent re-renders when parent state changes (e.g. scroll position, other popups)
export default memo(Navbar);