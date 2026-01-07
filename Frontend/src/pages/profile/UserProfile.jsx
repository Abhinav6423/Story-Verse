import React, { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "react-toastify";

import { useAuth } from "../../context/Authcontext.js";
import { getUserProfileData } from "../../Api-calls/getUserProfileData.js";

import Loader from "../../components/Loader.jsx";
import MyStories from "../../components/Profile/MyStories.jsx";
import UpdateProfile from "../../components/Profile/UpdateProfile.jsx";

const UserProfile = () => {
    const { userData } = useAuth();

    const [loading, setLoading] = useState(true);
    const [userStats, setUserStats] = useState({});
    const [showUpdateProfile, setShowUpdateProfile] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getUserProfileData();
                if (res?.success) {
                    setUserStats(res.data.userStats);
                } else {
                    toast.error(res?.message || "Failed to load profile");
                }
            } catch (err) {
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <Loader />;

    return (
        <>
            {/* ================= PROFILE PAGE ================= */}
            <div
                className="min-h-screen bg-white"
                style={{ paddingBottom: "var(--mobile-bottom-nav-height)" }}
            >
                {/* COVER */}
                <div className="relative h-36 sm:h-56 w-full">
                    <img
                        src={
                            userData?.coverPic ||
                            "https://i.pinimg.com/1200x/9e/23/f0/9e23f0e8bacb5f03ad6418a3bdd1727b.jpg"
                        }
                        alt="cover"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* PROFILE CONTENT */}
                <div className="px-4 sm:px-10 max-w-7xl mx-auto">
                    {/* PROFILE HEADER */}
                    <div className="relative -mt-20 flex flex-col items-center text-center lg:grid lg:grid-cols-[auto_1fr] lg:items-end lg:text-left lg:gap-24">

                        {/* AVATAR + NAME */}
                        <div className="flex flex-col items-center lg:items-start">
                            <div className="relative w-40 h-40">
                                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-md">
                                    <img
                                        src={userData?.profilePic}
                                        alt="profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* ✏️ EDIT ICON */}
                                <button
                                    onClick={() => setShowUpdateProfile(true)}
                                    className="absolute bottom-2 right-2 bg-emerald-500 p-2 rounded-full shadow-md hover:bg-emerald-400 transition"
                                    aria-label="Edit Profile"
                                >
                                    <Pencil size={16} className="text-black" />
                                </button>
                            </div>

                            <h1 className="mt-4 text-2xl font-medium text-gray-900">
                                {userData?.username}
                            </h1>

                            <p className="text-green-950 font-medium text-sm mt-1">
                                Story Writer • Reader
                            </p>
                        </div>

                        {/* STATS */}
                        <div className="mt-6 grid grid-cols-3 gap-y-6 gap-x-10 lg:mt-0 lg:flex lg:items-center lg:gap-8">
                            <Stat label="Stories" value={userStats?.totalShortStoriesCreated || 0} />
                            <Divider />
                            <Stat label="Reads" value={userStats?.totalShortStoriesRead || 0} />
                            <Divider />
                            <Stat label="Chapters+" value={userStats?.totalChaptersCreated || 0} />
                            <Divider />
                            <Stat label="Chapters-" value={userStats?.totalChaptersRead || 0} />
                            <Divider />
                            <Stat label="Level" value={userStats?.level || 0} />
                            <Divider />
                            <Stat label="XP" value={userStats?.xp || 0} />
                        </div>
                    </div>

                    <div className="w-full h-px bg-gray-400 mt-9" />

                    {/* STORIES */}
                    <MyStories />
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

const Stat = ({ label, value }) => (
    <div className="min-w-[80px] flex flex-col items-center">
        <p className="text-xl font-bold text-gray-900">{value}</p>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1">
            {label}
        </p>
    </div>
);

const Divider = () => (
    <div className="hidden lg:block h-8 w-px bg-gray-300" />
);

export default UserProfile;
