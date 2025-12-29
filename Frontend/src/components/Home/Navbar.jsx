import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/Authcontext";
import { logoutUser } from "../../Api-calls/logout.js";
import { useNavigate, Link } from "react-router-dom";
import { Plus, LayoutGrid, User, Menu } from "lucide-react";

import CategoryPopup from "./CategoryPopup.jsx";

const Navbar = () => {
    const { userData, loading, reloadUserData } = useAuth();
    const navigate = useNavigate();

    const [loggedOut, setLoggedOut] = useState(false);
    const [showBrowse, setShowBrowse] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    if (loading) return <div>Loading...</div>;

    const handleLogout = async () => {
        try {
            const result = await logoutUser();
            if (result?.success) {
                setLoggedOut(true);
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    useEffect(() => {
        if (loggedOut) {
            navigate("/");
            reloadUserData();
        }
    }, [loggedOut, navigate, reloadUserData]);

    return (
        <>
            {/* ================= NAVBAR ================= */}
            <nav className="w-full sticky top-0 z-50 bg-white border-b border-gray-200">
                <div className="relative max-w-7xl mx-auto px-6 h-16 flex items-center">

                    {/* LOGO */}
                    <Link to="/home" className="font-serif text-2xl font-semibold text-gray-900 tracking-tighter">
                        StoryFlix
                    </Link>

                    {/* CENTER TABS (DESKTOP) */}
                    <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex gap-6 text-sm font-medium text-gray-700">
                        <button className="hover:text-black">Short Stories</button>
                        <button className="hover:text-black">Books</button>
                    </div>

                    {/* RIGHT ACTIONS (DESKTOP) */}
                    <div className="ml-auto hidden md:flex items-center gap-7 text-sm font-medium text-gray-700">

                        <Link to="/create" className="flex items-center gap-2 hover:text-black">
                            <span className="w-7 h-7 flex items-center justify-center border border-gray-800 rounded-full">
                                <Plus size={14} />
                            </span>
                            Write story
                        </Link>

                        <button
                            onClick={() => setShowBrowse(true)}
                            className="flex items-center gap-2 hover:text-black"
                        >
                            <LayoutGrid size={18} />
                            Browse
                        </button>

                        {/* PROFILE DROPDOWN */}
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileMenu((p) => !p)}
                                className="flex items-center gap-2 hover:text-black"
                            >
                                <User size={18} />
                                Profile
                            </button>

                            {showProfileMenu && (
                                <div className="absolute -right-15 mt-3 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                                        onClick={() => setShowProfileMenu(false)}
                                    >
                                        View Profile
                                    </Link>
                                    <Link
                                        to="/goodReads/ShortStory"
                                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                                        onClick={() => setShowProfileMenu(false)}
                                    >
                                        View Good Reads
                                    </Link>
                                    <Link
                                        to=""
                                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                                        onClick={() => setShowProfileMenu(false)}
                                    >
                                        View History
                                    </Link>

                                </div>
                            )}
                        </div>
                    </div>

                    {/* HAMBURGER (MOBILE) */}
                    <button
                        className="ml-auto md:hidden"
                        onClick={() => setShowMobileMenu(true)}
                    >
                        <Menu size={22} />
                    </button>
                </div>
            </nav>

            {/* ================= MOBILE MENU ================= */}
            {showMobileMenu && (
                <>
                    <div
                        onClick={() => setShowMobileMenu(false)}
                        className="fixed inset-0 bg-black/40 z-40"
                    />

                    <div className="fixed bottom-12 left-0 right-0 z-50 bg-white rounded-t-2xl p-4 animate-popup">
                        <Link
                            to="/profile"
                            className="block py-3 border-b text-sm font-medium"
                            onClick={() => setShowMobileMenu(false)}
                        >
                            View Profile
                        </Link>
                        <Link
                            to="/goodReads/ShortStory"
                            className="block py-3 border-b text-sm font-medium"
                            onClick={() => setShowMobileMenu(false)}
                        >
                            View Good Reads
                        </Link>
                        <Link
                            to=""
                            className="block py-3 text-sm font-medium"
                            onClick={() => setShowMobileMenu(false)}
                        >
                            View History
                        </Link>

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
