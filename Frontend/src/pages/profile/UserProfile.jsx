import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/Authcontext.js";
import Navbar from "../../components/Home/Navbar.jsx";
import MyStories from "../../components/Profile/MyStories.jsx";
import { getUserProfileData } from "../../Api-calls/getUserProfileData.js";

const UserProfile = () => {
    const { userData } = useAuth();
    const [loading, setLoading] = useState(true);
    const [userStats, setUserStats] = useState({});

    useEffect(() => {
        const userProfile = async () => {
            try {
                const res = await getUserProfileData();
                setUserStats(res?.data);
            } finally {
                setLoading(false);
            }
        };
        userProfile();
    }, []);

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#0f0f0f]">
            <Navbar />

            {/* PAGE WRAPPER */}
            <div className="flex justify-center px-4 py-6">
                <div className="w-full max-w-5xl">

                    {/* PROFILE CARD */}
                    <div className="bg-[#121212] rounded-3xl shadow-xl overflow-hidden border border-white/5">

                        {/* COVER */}
                        <div className="relative h-40 sm:h-52 md:h-72 bg-black">
                            <img
                                src={
                                    userData?.coverPic ||
                                    "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa"
                                }
                                className="w-full h-full object-cover opacity-90"
                                alt="cover"
                            />

                            {/* subtle overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                            {/* PROFILE IMAGE */}
                            <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
                                <img
                                    src={userData?.profilePic}
                                    className="
                  w-28 h-28
                  rounded-full
                  object-cover
                  border-4 border-[#121212]
                  shadow-lg
                "
                                    alt="profile"
                                />
                            </div>
                        </div>

                        {/* PROFILE INFO */}
                        <div className="pt-20 px-5 sm:px-8 text-center">

                            <h2 className="text-xl sm:text-2xl font-semibold text-white">
                                {userData?.username}
                            </h2>

                            <p className="text-sm text-gray-400 font-medium mt-1">
                                Story Writer • Reader
                            </p>

                            {/* STATS */}
                            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-6">
                                <StatBox label="Stories" value={userStats?.totalShortStoriesCreated} />
                                <StatBox label="Reads" value={userStats?.totalShortStoriesRead || 0} />
                                <StatBox label="Chapters+" value={userStats?.totalChaptersCreated || 0} />
                                <StatBox label="Chapters-" value={userStats?.totalChaptersRead || 0} />
                                <StatBox label="Level" value={userStats?.level || 0} />
                                <StatBox label="XP" value={userStats?.xp || 0} />
                            </div>
                        </div>

                        {/* CONTENT GRID */}
                        <div className="px-4 sm:px-6 md:px-8 py-8">
                            <MyStories />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );

};

/* ---------- SUB COMPONENTS ---------- */

const StatBox = ({ label, value }) => (
    <div
        className="
      flex flex-col items-center justify-center
      rounded-2xl
      bg-[#1a1a1a]
      px-4 py-5
      text-center
      transition
      hover:bg-[#1f1f1f]
    "
    >
        <p className="text-2xl sm:text-2xl md:text-3xl font-bold text-white leading-none">
            {value}
        </p>

        <p className="mt-2 text-[11px] sm:text-xs uppercase tracking-widest text-gray-400">
            {label}
        </p>
    </div>
);





export default UserProfile;
