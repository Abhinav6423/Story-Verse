import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, Plus, LayoutGrid, User, LogOut } from "lucide-react";
import CategoryPopup from "./CategoryPopup";
import { logoutUser } from "../../Api-calls/logout";
import { toast } from "react-toastify";

const Navbar = ({ onAnyNavClick }) => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showBrowse, setShowBrowse] = useState(false);

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
        try {
            const result = await logoutUser();
            if (result?.success) {
                toast.success(result.message);
                navigate("/");
            }
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    return (
        <>
            {/* ================= NAVBAR ================= */}
            <nav className="sticky top-0 z-50 bg-white border-b">
                <div className="relative max-w-7xl mx-auto px-6 h-16 flex items-center">

                    {/* LOGO */}
                    <Link
                        to="/home"
                        
                        className="font-serif text-2xl font-semibold tracking-tight"
                    >
                        StoryFlix
                    </Link>

                    {/* DESKTOP ACTIONS */}
                    <div className="ml-auto hidden md:flex items-center gap-6 text-sm">

                        <Link to="/create" className="flex items-center gap-2">
                            <Plus size={14} />
                            Write story
                        </Link>

                        <button onClick={() => setShowBrowse(true)}>
                            <LayoutGrid size={18} />
                        </button>

                        {/* PROFILE MENU */}
                        <div className="relative" ref={profileMenuRef}>
                            <button onClick={() => setShowProfileMenu(p => !p)}>
                                <User size={18} />
                            </button>

                            {showProfileMenu && (
                                <div className="absolute right-0 mt-3 w-48 bg-white border rounded-xl shadow-lg">
                                    <Link to="/profile" className="block px-4 py-2">
                                        View Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2 text-left text-red-600 flex gap-2"
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
                        className="ml-auto md:hidden"
                        onClick={() => {
                            onAnyNavClick();
                            setShowMobileMenu(prev => !prev)
                        }}
                    >
                        <Menu size={22} />
                    </button>
                </div>
            </nav>

            {/* ================= MOBILE MENU ================= */}
            {showMobileMenu && (
                <>
                    {/* BACKDROP */}
                    <div className="fixed inset-0 bg-black/40 z-40" />

                    {/* DROPDOWN */}
                    <div
                        ref={mobileMenuRef}
                        className="fixed top-16 left-0 right-0 z-50 bg-white shadow-lg"
                    >
                        <Link
                            to="/profile"
                            onClick={() => setShowMobileMenu(false)}
                            className="block px-4 py-2 border-b"
                        >
                            View Profile
                        </Link>
                        <Link
                            to="/goodReads/ShortStory"
                            onClick={() => setShowMobileMenu(false)}
                            className="block  px-4 py-2 border-b"
                        >
                            View GoodReads
                        </Link>



                        <button
                            onClick={handleLogout}
                            className="w-full  px-4 py-2 text-left text-red-600 flex gap-2"
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
