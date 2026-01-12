import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, Plus, LayoutGrid, User, LogOut } from "lucide-react";
import CategoryPopup from "./CategoryPopup";
import { logoutUser } from "../../Api-calls/logout";
import { toast } from "react-toastify";

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
            // Ignore hamburger & mobile menu clicks
            if (
                hamburgerRef.current?.contains(e.target) ||
                mobileMenuRef.current?.contains(e.target)
            ) {
                return;
            }

            if (
                showProfileMenu &&
                profileMenuRef.current &&
                !profileMenuRef.current.contains(e.target)
            ) {
                setShowProfileMenu(false);
            }

            if (showMobileMenu) {
                setShowMobileMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [showProfileMenu, showMobileMenu]);

    /* ================= CLOSE ON ROUTE CHANGE ================= */
    useEffect(() => {
        setShowProfileMenu(false);
        setShowMobileMenu(false);
        setShowBrowse(false);
    }, [location.pathname]);

    const handleLogout = async () => {
        // 1️⃣ UI RESET FIRST (instant)
        toast.success("Logged out");
        navigate("/");

        // 2️⃣ Background cleanup
        try {
            await logoutUser();
        } catch (err) {
            console.error("Logout API failed silently");
        }
    };


    return (
        <>
            {/* ================= NAVBAR ================= */}
            <nav className="sticky top-0 z-50   backdrop-blur-md text-gray-100">


                {/* GLASS BACKGROUND LAYERS */}
                <div className="absolute inset-0 bg-[#1A1A1A] "></div>

                <div className="relative max-w-7xl mx-auto px-6 h-16 flex items-center text-gray-100">

                    {/* LOGO */}
                    <Link
                        to="/home"
                        className="font-serif italic text-2xl font-light tracking-tight text-gray-100"
                    >
                        StoryFlix
                    </Link>

                    {/* DESKTOP ACTIONS */}
                    <div className="ml-auto hidden md:flex items-center gap-6 text-sm text-gray-300">

                        {/* WRITE STORY */}
                        <Link
                            to="/create"
                            className="flex items-center gap-1 hover:text-white transition"
                        >
                            <div className="border border-white/30 rounded-full p-0.5">
                                <Plus size={14} />
                            </div>
                            <span className="font-medium">Write story</span>
                        </Link>

                        {/* BROWSE */}
                        <button
                            className="cursor-pointer flex gap-1 items-center hover:text-white transition"
                            onClick={() => setShowBrowse(p => !p)}
                        >
                            <LayoutGrid size={18} />
                            <span className="font-medium">Browse</span>
                        </button>

                        {/* PROFILE MENU */}
                        <div className="relative" ref={profileMenuRef}>
                            <button
                                className="flex items-center gap-1 hover:text-white transition"
                                onClick={() => {
                                    onAnyNavClick();
                                    setShowProfileMenu(p => !p);
                                }}
                            >
                                <User size={18} />
                                <span className="font-medium">Profile</span>
                            </button>

                            {showProfileMenu && (
                                <div className="absolute right-0 mt-3 w-48 bg-[#1f2a27] border border-white/10 rounded-xl shadow-xl p-0.5">
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
                        className="ml-auto md:hidden text-gray-200"
                        onClick={() => {
                            onAnyNavClick();
                            setShowMobileMenu(prev => !prev);
                        }}
                    >
                        <Menu size={22} />
                    </button>
                </div>
            </nav>

            {/* ================= MOBILE MENU ================= */}
            {showMobileMenu && (
                <>
                    <div className="fixed inset-0 bg-black/40 z-40" />

                    <div
                        ref={mobileMenuRef}
                        className="fixed top-16 left-0 right-0 z-50 bg-[#1f2a27] shadow-xl"
                    >
                        <Link
                            to="/profile"
                            onClick={() => setShowMobileMenu(false)}
                            className="block px-4 py-3 text-gray-200 border-b border-white/10 hover:bg-white/10"
                        >
                            View Profile
                        </Link>

                        <Link
                            to="/goodReads/ShortStory"
                            onClick={() => setShowMobileMenu(false)}
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

export default Navbar;
