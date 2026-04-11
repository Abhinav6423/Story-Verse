import { useState, useEffect, useRef, memo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, Plus, LayoutGrid, User, LogOut, BookOpen } from "lucide-react";
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
            <nav className="fixed w-full top-0 z-50 h-16 sm:h-20 transition-all duration-300">

                {/* CINEMATIC BACKGROUND LAYERS */}
                {/* 1. Very subtle top gradient fade just for text legibility, matching the airy look */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent pointer-events-none"></div>

                {/* 2. Transparent background */}
                <div className="absolute inset-0 bg-transparent"></div>

                <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center justify-between text-white">

                    {/* LOGO */}
                    <Link
                        to="/home"
                        className="group flex-shrink-0 transition-transform duration-300 hover:scale-105"
                    >
                        <img
                            src={logo}
                            alt="Preface Logo"
                            width="112"
                            height="40"
                            className="w-24 sm:w-28 h-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                        />
                    </Link>

                    {/* DESKTOP ACTIONS */}
                    <div className="hidden lg:flex items-center gap-6 text-sm font-medium">

                        {/* Write Story */}
                        <Link
                            to="/create"
                            className="group flex items-center gap-2 py-2 transition-all duration-300"
                        >
                            <Plus size={16} className="text-white/70 group-hover:text-emerald-400 transition-colors duration-300" />
                            <span className="tracking-wide text-white/90 group-hover:text-emerald-400 transition-colors duration-300">Write story</span>
                        </Link>

                        {/* Browse Button */}
                        <button
                            className="flex items-center gap-2 py-2 transition-all duration-300 group"
                            onClick={() => setShowBrowse(p => !p)}
                            aria-label="Browse Categories"
                        >
                            <LayoutGrid size={16} className="text-white/70 group-hover:text-emerald-400 transition-colors duration-300" />
                            <span className="tracking-wide text-white/90 group-hover:text-emerald-400 transition-colors duration-300">Browse</span>
                        </button>

                        {/* Profile Dropdown Trigger */}
                        <div className="relative" ref={profileMenuRef}>
                            <button
                                className={`flex items-center gap-2 py-2 transition-all duration-300 group ${showProfileMenu ? 'text-emerald-400' : 'text-white/90'}`}
                                onClick={() => {
                                    onAnyNavClick();
                                    setShowProfileMenu(p => !p);
                                }}
                                aria-label="User Menu"
                            >
                                <User size={16} className={`transition-colors duration-300 ${showProfileMenu ? 'text-emerald-400' : 'text-white/70 group-hover:text-emerald-400'}`} />
                                <span className={`tracking-wide transition-colors duration-300 ${showProfileMenu ? 'text-emerald-400' : 'group-hover:text-emerald-400'}`}>Profile</span>
                            </button>

                            {/* DESKTOP DROPDOWN MENU */}
                            {showProfileMenu && (
                                <div className="absolute right-0 mt-4 w-56 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.8)] p-1.5 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
                                    <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                                        Account
                                    </div>
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-200 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-colors duration-200"
                                    >
                                        <User size={16} />
                                        View Profile
                                    </Link>
                                    <Link
                                        to="/goodReads/ShortStory"
                                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-200 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-colors duration-200"
                                    >
                                        <BookOpen size={16} />
                                        Good Reads
                                    </Link>
                                    <div className="h-[1px] bg-white/10 my-1 mx-2"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors duration-200"
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
                        className={`md:hidden p-2 rounded-full transition-colors drop-shadow-md ${showMobileMenu ? 'bg-white/10 text-emerald-400' : 'hover:bg-white/10 text-white'}`}
                        onClick={() => {
                            onAnyNavClick();
                            setShowMobileMenu(prev => !prev);
                        }}
                        aria-label="Toggle Menu"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </nav>

            {/* ================= MOBILE MENU ================= */}
            {showMobileMenu && (
                <>
                    <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity" onClick={() => setShowMobileMenu(false)} />
                    <div
                        ref={mobileMenuRef}
                        className="fixed top-16 sm:top-20 left-0 right-0 z-50 bg-black/80 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] border-b border-white/10 rounded-b-3xl overflow-hidden animate-in slide-in-from-top-5 duration-300"
                    >
                        <div className="p-4 space-y-1">
                            <Link
                                to="/profile"
                                className="flex items-center gap-3 px-4 py-3.5 text-gray-200 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-2xl transition-all duration-200"
                            >
                                <User size={18} className="text-current opacity-70" />
                                View Profile
                            </Link>
                            <Link
                                to="/goodReads/ShortStory"
                                className="flex items-center gap-3 px-4 py-3.5 text-gray-200 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-2xl transition-all duration-200"
                            >
                                <BookOpen size={18} className="text-current opacity-70" />
                                Good Reads
                            </Link>
                            <div className="h-[1px] bg-white/10 my-2 mx-2"></div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3.5 text-left text-red-400 hover:bg-red-500/10 rounded-2xl transition-all duration-200"
                            >
                                <LogOut size={18} className="text-current opacity-80" />
                                Logout
                            </button>
                        </div>
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