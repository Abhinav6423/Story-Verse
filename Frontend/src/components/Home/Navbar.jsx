import { useState, useEffect, useRef, memo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, Plus, LayoutGrid, User, LogOut , BookOpen } from "lucide-react";
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
            <nav className="sticky top-0 z-50 h-16 transition-all duration-300">

                {/* GLASS BACKGROUND LAYERS */}
                <div className="absolute inset-0 bg-[#1A1A1A]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#1A1A1A]/60"></div>
                <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center justify-between text-gray-100">

                    {/* LOGO */}
                    <Link
                        to="/home"
                        className="group flex-shrink-0 transition-opacity duration-300 hover:opacity-80"
                    >
                        <img
                            src={logo}
                            alt="Story-Verse Logo"
                            width="112"
                            height="40"
                            className="w-22 sm:w-28 h-auto object-contain drop-shadow-lg"
                        />
                    </Link>

                    {/* DESKTOP ACTIONS */}
                    <div className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-300">

                        {/* Write Story - Premium Glass Pill */}
                        <Link
                            to="/create"
                            className="group flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                        >
                            <Plus size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                            <span className="tracking-wide">Write Story</span>
                        </Link>

                        {/* Divider */}
                        <div className="h-6 w-[1px] bg-white/10 mx-2"></div>

                        {/* Browse Button */}
                        <button
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-300 group"
                            onClick={() => setShowBrowse(p => !p)}
                            aria-label="Browse Categories"
                        >
                            <LayoutGrid size={18} className="text-gray-400 group-hover:text-white transition-colors" />
                            <span className="tracking-wide">Browse</span>
                        </button>

                        {/* Profile Dropdown Trigger */}
                        <div className="relative" ref={profileMenuRef}>
                            <button
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-300 group ${showProfileMenu ? 'bg-white/5 text-white' : ''}`}
                                onClick={() => {
                                    onAnyNavClick();
                                    setShowProfileMenu(p => !p);
                                }}
                                aria-label="User Menu"
                            >
                                <User size={18} className="text-gray-400 group-hover:text-white transition-colors" />
                                <span className="tracking-wide">Profile</span>
                            </button>

                            {/* DESKTOP DROPDOWN MENU */}
                            {showProfileMenu && (
                                <div className="absolute right-0 mt-4 w-56 bg-[#1A1A1A]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)] p-1.5 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
                                    <div className="px-2 py-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 ml-1">
                                        Account
                                    </div>
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                                    >
                                        <User size={16} />
                                        View Profile
                                    </Link>
                                    <Link
                                        to="/goodReads/ShortStory"
                                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                                    >
                                        <BookOpen size={16} />
                                        Good Reads
                                    </Link>
                                    <div className="h-[1px] bg-white/5 my-1 mx-2"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
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
                        className="md:hidden p-2 rounded-full hover:bg-white/10 text-gray-200 transition-colors"
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
                    <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity" onClick={() => setShowMobileMenu(false)} />
                    <div
                        ref={mobileMenuRef}
                        className="fixed top-16 left-0 right-0 z-50 bg-[#1A1A1A]/95 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border-b border-white/10 rounded-b-3xl overflow-hidden animate-in slide-in-from-top-5 duration-300"
                    >
                        <div className="p-4 space-y-1">
                            <Link
                                to="/profile"
                                className="flex items-center gap-3 px-4 py-3.5 text-gray-200 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
                            >
                                <User size={18} className="text-gray-400" />
                                View Profile
                            </Link>
                            <Link
                                to="/goodReads/ShortStory"
                                className="flex items-center gap-3 px-4 py-3.5 text-gray-200 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
                            >
                                <BookOpen size={18} className="text-gray-400" />
                                Good Reads
                            </Link>
                            <div className="h-[1px] bg-white/5 my-2"></div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3.5 text-left text-red-400 hover:bg-red-500/10 rounded-2xl transition-all"
                            >
                                <LogOut size={18} />
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