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
            {/* ================= PREMIUM SOFT NAVBAR ================= */}
            <nav className="w-full sticky top-0 z-50 bg-slate-50/80 backdrop-blur-md   ">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

                    {/* LEFT — LOGO */}
                    <Link to="/home" className="flex items-center gap-3">
                        <img
                            src="https://i.pinimg.com/736x/c0/fb/a0/c0fba0961d1b9a0b0d5f63a85979bb08.jpg"
                            alt="logo"
                            className="h-9 w-9 rounded-full object-cover"
                        />
                        <span className="hidden sm:block text-[15px] font-semibold tracking-tight text-slate-900">
                            spicy
                        </span>
                    </Link>

                    {/* CENTER — CONTENT SWITCH (SOFT PILL) */}
                    <div className="flex items-center bg-white rounded-full shadow-sm border border-slate-200 p-1 text-[13px] font-medium tracking-wide">
                        <button
                            onClick={() => setContentType("shortStories")}
                            className={`px-3 py-1 rounded-full transition
            ${contentType === "shortStories"
                                    ? "bg-indigo-50 text-indigo-600 shadow-sm"
                                    : "text-slate-600 hover:text-slate-900"}
          `}
                        >
                            Short Stories
                        </button>

                        <button
                            onClick={() => setContentType("books")}
                            className={`px-3 py-1 rounded-full transition
            ${contentType === "books"
                                    ? "bg-indigo-50 text-indigo-600 shadow-sm"
                                    : "text-slate-600 hover:text-slate-900"}
          `}
                        >
                            Books
                        </button>
                    </div>

                    {/* RIGHT — SEARCH + PROFILE */}
                    <div className="flex items-center gap-4">
                        <button className="hidden md:flex w-9 h-9 items-center justify-center rounded-full hover:bg-slate-100 transition">
                            <Search size={18} className="text-slate-600" />
                        </button>

                        {/* PROFILE DROPDOWN */}
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setOpen(!open)}
                                className="flex items-center gap-2 rounded-full p-1 hover:bg-slate-100 transition"
                            >
                                <img
                                    src={profileImg}
                                    alt="profile"
                                    className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-100"
                                />
                            </button>

                            {open && (
                                <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white shadow-xl border border-slate-100 overflow-hidden">

                                    {/* USER INFO */}
                                    <div className="px-4 py-3 flex items-center gap-3">
                                        <img
                                            src={profileImg}
                                            alt="profile"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">
                                                {username}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Story Writer • Reader
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-100" />

                                    {/* ACTIONS */}
                                    <div className="py-2">
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                                        >
                                            My Profile
                                        </Link>

                                        <Link
                                            to="/create"
                                            className="block px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition"
                                        >
                                             Write a Story
                                        </Link>
                                    </div>

                                    <div className="border-t border-slate-100" />

                                    {/* LOGOUT */}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
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
