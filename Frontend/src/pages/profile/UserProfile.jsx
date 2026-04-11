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
            <div className="min-h-screen bg-[#0A0A0C] text-white pb-20 md:pb-8">

                {/* COVER IMAGE */}
                <div className="relative h-48 sm:h-64 md:h-80 w-full overflow-hidden">
                    <img
                        src={books}
                        alt="Cover"
                        className="w-full h-full object-cover opacity-60 scale-105"
                    />
                    {/* CRITICAL FIX: The blend gradient. h-32 ensures a long, smooth transition into the body */}
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/60 to-transparent" />
                </div>

                {/* PROFILE CONTENT */}
                <div className="px-4 sm:px-10 max-w-7xl mx-auto relative z-10">

                    {/* PROFILE HEADER LAYOUT */}
                    <div className="flex flex-col items-center lg:flex-row lg:items-end lg:justify-between -mt-20 lg:-mt-24 mb-8">

                        {/* LEFT: AVATAR + NAME */}
                        <div className="flex flex-col items-center lg:flex-row lg:items-end gap-6 lg:gap-8">

                            {/* Avatar Circle with "Halo" Effect */}
                            <div className="relative group">
                                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-[6px] border-[#0A0A0C] bg-[#121212] shadow-2xl ring-4 ring-emerald-500/10">
                                    <img
                                        src={userData?.profilePic}
                                        alt="Profile"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>

                                {/* Edit Button - Polished with emerald glow */}
                                <button
                                    onClick={() => setShowUpdateProfile(true)}
                                    className="
                                        absolute bottom-3 right-3 
                                        bg-emerald-500 text-black 
                                        p-2.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] border-[4px] border-[#0A0A0C]
                                        hover:bg-emerald-400 hover:scale-110 transition-all duration-300
                                        z-20
                                    "
                                    aria-label="Edit Profile"
                                >
                                    <Pencil size={18} strokeWidth={2.5} />
                                </button>
                            </div>

                            {/* Name & Tagline */}
                            <div className="text-center lg:text-left mb-2 lg:mb-6">
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                                    {userData?.username || "Abhinav"}
                                </h1>
                                <p className="text-emerald-400/90 font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center lg:justify-start gap-2 mt-2">
                                    <User size={14} className="fill-emerald-400/20" />
                                    <span>Writer & Reader</span>
                                </p>
                            </div>
                        </div>

                        {/* RIGHT: STATS GRID - Upgraded to Glassmorphism */}
                        <div className="
                            mt-8 lg:mt-0 
                            bg-black/40 backdrop-blur-xl 
                            border border-white/10 rounded-2xl 
                            p-6 px-8
                            grid grid-cols-4 gap-y-6 gap-x-6
                            md:flex md:flex-row md:items-center 
                            shadow-[0_10px_40px_rgba(0,0,0,0.5)]
                        ">
                            <Stat icon={BookOpen} label="Created" value={userStats?.totalShortStoriesCreated} />
                            <Divider />
                            <Stat icon={Layers} label="Reads" value={userStats?.totalShortStoriesRead} />
                            <Divider />
                            <Stat icon={Trophy} label="Level" value={userStats?.level} highlight />
                            <Divider />
                            <Stat icon={Star} label="XP" value={userStats?.xp} highlight />
                        </div>
                    </div>

                    {/* DIVIDER - Refined fade effect */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-12" />

                    {/* STORIES SECTION */}
                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
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

const Stat = ({ icon: Icon, label, value, highlight }) => (
    <div className="flex flex-col items-center justify-center flex-1 min-w-[70px] group cursor-default">
        {/* ICON */}
        <div className={`mb-2 transition-all duration-300 ${highlight ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-emerald-400'}`}>
            {Icon && <Icon size={18} strokeWidth={2} className={highlight ? 'drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' : ''} />}
        </div>

        {/* NUMBER */}
        <p className={`text-xl sm:text-2xl font-black tracking-tighter leading-none mb-1.5 transition-all duration-300 ${highlight ? 'text-emerald-400' : 'text-zinc-100 group-hover:text-white'}`}>
            {value || 0}
        </p>

        {/* LABEL */}
        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.25em] group-hover:text-zinc-400 transition-colors">
            {label}
        </p>
    </div>
);

const Divider = () => (
    <div className="hidden md:block h-10 w-px bg-white/5 mx-2" />
);

export default UserProfile;