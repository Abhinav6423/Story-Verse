import React, { useEffect, useState } from "react";
import { Pencil, User, BookOpen, Star, Trophy, Layers } from "lucide-react";
import { toast } from "react-toastify";

import { useAuth } from "../../context/Authcontext.js";
import { getUserProfileData } from "../../Api-calls/getUserProfileData.js";

import MyStories from "../../components/Profile/MyStories.jsx";
import UpdateProfile from "../../components/Profile/UpdateProfile.jsx";
import books from "../../Assets/books aesthetic.jpg"
// 1. Skeleton Component for smoother loading
const ProfileSkeleton = () => (
    <div className="min-h-screen bg-[#1A1A1A] animate-pulse">
        <div className="h-36 sm:h-56 w-full bg-gray-800" /> {/* Cover */}
        <div className="px-4 sm:px-10 max-w-7xl mx-auto -mt-20">
            <div className="flex flex-col items-center lg:flex-row lg:items-end lg:gap-8">
                <div className="w-40 h-40 rounded-full bg-gray-700 border-4 border-[#1A1A1A]" /> {/* Avatar */}
                <div className="mt-4 lg:mb-4 space-y-2 text-center lg:text-left">
                    <div className="h-8 w-48 bg-gray-700 rounded mx-auto lg:mx-0" />
                    <div className="h-4 w-32 bg-gray-800 rounded mx-auto lg:mx-0" />
                </div>
            </div>
            <div className="mt-8 flex gap-4 justify-center lg:justify-start">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-16 w-20 bg-gray-800 rounded" />)}
            </div>
        </div>
    </div>
);

const UserProfile = () => {
    const { userData, loading: authLoading } = useAuth();

    const [loading, setLoading] = useState(true);
    const [userStats, setUserStats] = useState({});
    const [showUpdateProfile, setShowUpdateProfile] = useState(false);

    useEffect(() => {
        if (authLoading) return;
        if (!userData) {
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await getUserProfileData();
                if (res?.success) {
                    setUserStats(res.data.userStats);
                } else {
                    toast.error(res?.message || "Failed to load profile");
                }
            } catch {
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [authLoading, userData]);


    if (loading || authLoading) return <ProfileSkeleton />;

    return (
        <>
            {/* ================= PROFILE PAGE ================= */}
            <div
                className="min-h-screen bg-[#1A1A1A] text-white pb-20 md:pb-8"
            >
                {/* COVER IMAGE */}
                <div className="relative h-40 sm:h-60 w-full bg-gray-800">
                    <img
                        src={books}
                        alt="Cover"
                        className="w-full h-full object-cover opacity-80"
                    />
                    {/* Gradient Overlay for text readability if you add cover text later */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
                </div>

                {/* PROFILE CONTENT */}
                <div className="px-4 sm:px-10 max-w-7xl mx-auto relative z-10">

                    {/* PROFILE HEADER LAYOUT */}
                    <div className="flex flex-col items-center lg:flex-row lg:items-end lg:justify-between -mt-20 mb-8">

                        {/* LEFT: AVATAR + NAME */}
                        <div className="flex flex-col items-center lg:flex-row lg:items-end gap-4 lg:gap-8">

                            {/* Avatar Circle */}
                            <div className="relative group">
                                <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden border-[5px] border-[#1A1A1A] bg-[#2a2a2a] shadow-xl">
                                    <img
                                        src={userData?.profilePic}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Edit Button (Desktop hover / Mobile always visible) */}
                                <button
                                    onClick={() => setShowUpdateProfile(true)}
                                    className="
                                        absolute bottom-2 right-2 
                                        bg-emerald-600 text-white 
                                        p-2.5 rounded-full shadow-lg border-4 border-[#1A1A1A]
                                        hover:bg-emerald-500 hover:scale-110 transition-all
                                        group-hover:opacity-100
                                    "
                                    aria-label="Edit Profile"
                                >
                                    <Pencil size={16} />
                                </button>
                            </div>

                            {/* Name & Tagline */}
                            <div className="text-center lg:text-left mb-2 lg:mb-4">
                                <h1 className="text-3xl font-bold text-white tracking-tight">
                                    {userData?.username || "StoryFlix User"}
                                </h1>
                                <p className="text-emerald-400/80 font-medium text-sm flex items-center justify-center lg:justify-start gap-1.5 mt-1">
                                    <User size={14} />
                                    <span>Writer & Reader</span>
                                </p>
                            </div>
                        </div>

                        {/* RIGHT: STATS GRID */}
                        {/* Optimized grid for mobile: 2 rows of 3, or flex wrap */}
                        <div className="
                            mt-8 lg:mt-0 
                            bg-white/5 border border-white/5 rounded-2xl 
                            p-4 sm:p-6
                            grid grid-cols-3 gap-x-8 gap-y-4
                            lg:flex lg:gap-8
                            backdrop-blur-sm
                        ">
                            <Stat icon={BookOpen} label="Created" value={userStats?.totalShortStoriesCreated} />
                            <Divider />
                            <Stat icon={Layers} label="Reads" value={userStats?.totalShortStoriesRead} />
                            <Divider />
                            <Stat icon={Trophy} label="Level" value={userStats?.level} />
                            <Divider />
                            <Stat icon={Star} label="XP" value={userStats?.xp} />
                        </div>
                    </div>

                    {/* DIVIDER */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-8" />

                    {/* STORIES SECTION */}
                    {/* MyStories handles its own loading state */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <MyStories />
                    </div>
                </div>
            </div>

            {/* ================= UPDATE PROFILE MODAL ================= */}
            {showUpdateProfile && (
                <UpdateProfile onClose={() => setShowUpdateProfile(false)} />
            )}
        </>
    );
};

/* ---------- SUB COMPONENTS ---------- */

const Stat = ({ icon: Icon, label, value }) => (
    <div className="flex flex-col items-center justify-center min-w-[60px]">
        <div className="text-emerald-500/80 mb-1 lg:hidden">
            {Icon && <Icon size={18} />}
        </div>
        <p className="text-xl sm:text-2xl font-bold text-white leading-none">
            {value || 0}
        </p>
        <p className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">
            {label}
        </p>
    </div>
);

const Divider = () => (
    <div className="hidden lg:block h-10 w-px bg-white/10" />
);

export default UserProfile;