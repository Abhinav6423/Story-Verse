import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/Authcontext.js";
import { Star, BookOpen, Book, Flame, Award, Zap } from "lucide-react";
import Navbar from "../../components/Home/Navbar.jsx";
import MyStories from "../../components/Profile/MyStories.jsx";
import { getUserProfileData } from "../../Api-calls/getUserProfileData.js";

const UserProfile = () => {
    const { userData } = useAuth();
    const [loading, setLoading] = useState(true);
    const [userStats, setUserStats] = useState({});

    const xpPercent =
        userStats?.xp && userStats?.xpToNextLevel
            ? (userStats.xp / (userStats.xp + userStats.xpToNextLevel)) * 100
            : 0;

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
        <div className="min-h-screen ">
            <Navbar />

            {/* MAIN PROFILE CARD */}
            <div className="flex justify-center ">
                <div className="w-full max-w-md  rounded-[28px]  p-6">

                    {/* TOP AVATAR AREA */}
                    <div className="flex items-center gap-4">
                        <img
                            src={userData?.profilePic}
                            alt="profile"
                            className="w-20 h-20 rounded-2xl object-cover border"
                        />

                        <div className="flex-1">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {userData?.username}
                            </h2>

                            <p className="text-xs text-gray-500 mt-0.5">
                                Story Writer • Reader
                            </p>

                            <div className="mt-2 flex items-center gap-2 text-indigo-600 text-xs font-medium">
                                <Zap className="w-4 h-4" />
                                Power Score
                            </div>
                        </div>
                    </div>

                    {/* XP BAR */}
                    <div className="mt-5">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Level {userStats?.level}</span>
                            <span>{userStats?.xp}/{userStats?.xpToNextLevel} XP</span>
                        </div>

                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-indigo-500 transition-all"
                                style={{ width: `${xpPercent}%` }}
                            />
                        </div>
                    </div>

                    {/* STATS GRID (LIKE AVATAR APP) */}
                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <StatPill icon={<BookOpen size={14} />} label="Stories Created" value={userStats?.totalShortStoriesCreated} />
                        <StatPill icon={<Book size={14} />} label="Chapters Created" value={userStats?.totalChaptersCreated} />
                        <StatPill icon={<Flame size={14} />} label="Stories Read" value={userStats?.totalShortStoriesRead} />
                        <StatPill icon={<Book size={14} />} label="Chapters Read" value={userStats?.totalChaptersRead} />
                        <StatPill icon={<Award size={14} />} label="Total XP" value={userStats?.xp} />
                        <StatPill icon={<Star size={14} />} label="Level" value={userStats?.level} />
                    </div>

                   
                </div>
            </div>

            <MyStories />
        </div>
    );
};

/* STAT PILL (GAME STYLE) */
const StatPill = ({ icon, label, value }) => (
    <div className="flex items-center justify-between bg-gray-100 px-4 py-3 rounded-xl">
        <div className="flex items-center gap-2 text-gray-600 text-xs font-semibold">
            {icon}
            <span>{label}</span>
        </div>
        <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
);

export default UserProfile;
