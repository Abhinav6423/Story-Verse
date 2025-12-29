import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, Plus, LayoutGrid, User } from "lucide-react";
import CategoryPopup from "./CategoryPopup";
import { logoutUser } from "../../Api-calls/logout.js";
import { LogOut } from "lucide-react"
import {toast} from 'react-toastify'
const Navbar = () => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showBrowse, setShowBrowse] = useState(false);

    const profileMenuRef = useRef(null);
    const mobileMenuRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();

    /* ================= CLICK OUTSIDE HANDLER ================= */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                showProfileMenu &&
                profileMenuRef.current &&
                !profileMenuRef.current.contains(e.target)
            ) {
                setShowProfileMenu(false);
            }

            if (
                showMobileMenu &&
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(e.target)
            ) {
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
    }, [location.pathname]);

    const handleLogout = async () => {
        try {
            const result = await logoutUser();
            if (result?.success) {
                toast.success(result?.message);
                navigate("/");
            }
        } catch (error) {
            console.error("Logout error:", error);
            toast.error(error?.response?.data);
        }
    }

    return (
        <>
            {/* ================= NAVBAR ================= */}
            <nav className="w-full sticky top-0 z-50 bg-white border-b border-gray-200">
                <div className="relative max-w-7xl mx-auto px-6 h-16 flex items-center">

                    {/* LOGO */}
                    <Link
                        to="/home"
                        className="font-serif text-2xl font-semibold text-gray-900 tracking-tighter"
                    >
                        StoryFlix
                    </Link>

                    {/* CENTER TABS (DESKTOP) */}
                    <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex gap-6 text-sm font-medium text-gray-700">
                        <button className="hover:text-black">Short Stories</button>
                        <button className="hover:text-black">Books</button>
                    </div>

                    {/* RIGHT ACTIONS (DESKTOP) */}
                    <div className="ml-auto hidden md:flex items-center gap-7 text-sm font-medium text-gray-700">

                        <Link
                            to="/create"
                            className="flex items-center gap-2 hover:text-black"
                        >
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
                        <div className="relative" ref={profileMenuRef}>
                            <button
                                onClick={() =>
                                    setShowProfileMenu((p) => !p)
                                }
                                className="flex items-center gap-2 hover:text-black"
                            >
                                <User size={18} />
                                Profile
                            </button>

                            {showProfileMenu && (
                                <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                                    >
                                        View Profile
                                    </Link>
                                    <Link
                                        to="/goodReads/ShortStory"
                                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                                    >
                                        View Good Reads
                                    </Link>
                                    <Link
                                        to=""
                                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                                    >
                                        View History
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="
        w-full
        px-4 py-2
        text-sm
        text-left
        font-medium
        text-red-600
        hover:bg-gray-100
        flex items-center gap-2
    "
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
                    {/* BACKDROP */}
                    <div className="fixed inset-0 bg-black/40 z-40" />

                    {/* TOP DROPDOWN */}
                    <div
                        ref={mobileMenuRef}
                        className="
                            fixed top-16 left-0 right-0 z-50
                            bg-white
                            border-b border-gray-200
                            shadow-lg
                            animate-slide-down
                        "
                    >
                        <Link
                            to="/profile"
                            className="block px-6 py-4 border-b text-sm font-medium hover:bg-gray-50"
                        >
                            View Profile
                        </Link>

                        <Link
                            to="/goodReads/ShortStory"
                            className="block px-6 py-4 border-b text-sm font-medium hover:bg-gray-50"
                        >
                            View Good Reads
                        </Link>

                        <Link
                            to=""
                            className="block px-6 py-4 text-sm font-medium hover:bg-gray-50 border-b"
                        >
                            View History
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="
        w-full
        px-6 py-4
        text-sm 
        font-medium
        text-red-600
        hover:bg-gray-50
        flex items-center gap-1
    "
                        >
                            <LogOut size={18} />
                            <span className="text-sm">LogOut</span>
                        </button>



                    </div>
                </>
            )
            }

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
