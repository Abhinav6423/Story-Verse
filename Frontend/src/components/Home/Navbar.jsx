import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/Authcontext";
import { logoutUser } from "../../Api-calls/logout.js";
import { useNavigate, Link } from "react-router-dom";
import { Plus, LayoutGrid, User } from "lucide-react";

import CategoryPopup from "./CategoryPopup.jsx";

const Navbar = () => {
    const { userData, loading, reloadUserData } = useAuth();
    const navigate = useNavigate();

    const [loggedOut, setLoggedOut] = useState(false);
    const [showBrowse, setShowBrowse] = useState(false);

    if (loading) return <div>Loading...</div>;

    const username = userData?.username;
    const profileImg = userData?.profilePic;

    const handleLogout = async () => {
        try {
            const result = await logoutUser();
            if (result?.success) {
                setLoggedOut(true);
                alert(result?.message);
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

                    {/* LEFT — LOGO */}
                    <Link to="/home" className="flex items-center">
                        <span
                            className="
                font-serif
                text-2xl
                font-semibold
                text-gray-900
                tracking-tighter
              "
                        >
                            StoryFlix
                        </span>
                    </Link>

                    {/* CENTER — NAV TABS (DESKTOP ONLY) */}
                    <div
                        className="
              absolute left-1/2 -translate-x-1/2
              hidden md:flex
              items-center gap-6
              text-sm
              font-medium
              text-gray-700
            "
                    >
                        <button className="hover:text-black transition">
                            Short Stories
                        </button>
                        <button className="hover:text-black transition">
                            Books
                        </button>
                    </div>

                    {/* RIGHT — ACTIONS (DESKTOP ONLY) */}
                    <div className="ml-auto hidden md:flex items-center gap-7 text-sm font-medium text-gray-700">

                        {/* WRITE STORY */}
                        <Link to="/create">
                            <button className="cursor-pointer flex items-center gap-2 hover:text-black transition">
                                <span className="w-7 h-7 flex items-center justify-center border border-gray-800 rounded-full">
                                    <Plus size={14} strokeWidth={2} />
                                </span>
                                <span className="hidden sm:inline">Write story</span>
                            </button>
                        </Link>

                        {/* BROWSE */}
                        <button
                            onClick={() => setShowBrowse(true)}
                            className="cursor-pointer flex items-center gap-2 hover:text-black transition"
                        >
                            <LayoutGrid size={18} />
                            <span className="hidden sm:inline">Browse</span>
                        </button>

                        {/* PROFILE */}
                        <Link to="/profile">
                            <button className="cursor-pointer flex items-center gap-2 hover:text-black transition">
                                <User size={18} />
                                <span className="hidden sm:inline">Profile</span>
                            </button>
                        </Link>

                    </div>
                </div>
            </nav>

            {/* ================= BROWSE CATEGORY POPUP ================= */}
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
