import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/Authcontext";
import { logoutUser } from "../../Api-calls/logout.js";
import { useNavigate, Link } from "react-router-dom";
import { Search } from "lucide-react"

const Navbar = () => {
    const { userData, loading, reloadUserData } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);

    const [loggedOut, setLoggedOut] = useState(false);
    const [contentType, setContentType] = useState("shortStories");

    const menuRef = useRef(null);

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
    }, [loggedOut, navigate]);

    const handleSubmit = async () => {
        try {
            const result = await listFeedShortStory(titleSearch);

        } catch (error) {
            console.error("Logout error:", error);
        }
    }

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <>
            {/* ================= NETFLIX NAVBAR ================= */}
            <nav className="w-full sticky top-0 z-50 bg-black/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

                    {/* LEFT — LOGO */}
                    <Link to="/home" className="flex items-center gap-3">
                        <span
                            className="
            text-red-600
            text-lg sm:text-xl md:text-2xl
            font-extrabold
            tracking-wide
          "
                        >
                            STORYFLIX
                        </span>
                    </Link>

                    {/* CENTER — NAV LINKS */}
                    <div
                        className="
          hidden md:flex
          items-center gap-6
          text-sm md:text-base
          font-medium
          text-gray-300
        "
                    >
                        <button
                            onClick={() => setContentType("shortStories")}
                            className={`
            transition
            hover:text-white
            ${contentType === "shortStories" ? "text-white" : ""}
          `}
                        >
                            Short Stories
                        </button>

                        <button
                            onClick={() => setContentType("books")}
                            className={`
            transition
            hover:text-white
            ${contentType === "books" ? "text-white" : ""}
          `}
                        >
                            Books
                        </button>
                    </div>

                    {/* RIGHT — SEARCH + PROFILE */}
                    <div className="flex items-center gap-4">

                        {/* SEARCH */}
                        <button
                            className="
            hidden md:flex
            w-9 h-9
            items-center justify-center
            rounded-full
            hover:bg-white/10
            transition
          "
                        >
                            <Search size={18} className="text-white" />
                        </button>

                        {/* PROFILE */}
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setOpen(!open)}
                                className="
              flex items-center gap-2
              rounded-full p-1
              hover:bg-white/10
              transition
            "
                            >
                                <img
                                    src={profileImg}
                                    alt="profile"
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            </button>

                            {open && (
                                <div
                                    className="
                absolute right-0 mt-3 w-60
                rounded-md
                bg-[#141414]
                shadow-xl
                border border-white/10
                overflow-hidden
              "
                                >
                                    {/* USER */}
                                    <div className="px-4 py-3">
                                        <p
                                            className="
                    text-sm md:text-base
                    font-semibold
                    text-white
                  "
                                        >
                                            {username}
                                        </p>
                                        <p className="text-xs md:text-sm text-gray-400">
                                            Story Writer • Reader
                                        </p>
                                    </div>

                                    <div className="border-t border-white/10" />

                                    {/* LINKS */}
                                    <div className="py-2">
                                        <Link
                                            to="/profile"
                                            className="
                    block px-4 py-2
                    text-sm md:text-base
                    text-gray-300
                    hover:bg-white/10
                    transition
                  "
                                        >
                                            Profile
                                        </Link>

                                        <Link
                                            to="/create"
                                            className="
                    block px-4 py-2
                    text-sm md:text-base
                    text-gray-300
                    hover:bg-white/10
                    transition
                  "
                                        >
                                            Write a Story
                                        </Link>
                                    </div>

                                    <div className="border-t border-white/10" />

                                    {/* LOGOUT */}
                                    <button
                                        onClick={handleLogout}
                                        className="
                  w-full text-left
                  px-4 py-2
                  text-sm md:text-base
                  text-red-500
                  hover:bg-white/10
                  transition
                "
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>

    )



};

export default Navbar;
