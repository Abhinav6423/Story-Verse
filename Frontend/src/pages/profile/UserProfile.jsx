import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/Authcontext.js";
import Navbar from "../../components/Home/Navbar.jsx";
import MyStories from "../../components/Profile/MyStories.jsx";
import { getUserProfileData } from "../../Api-calls/getUserProfileData.js";
import Loader from "../../components/Loader.jsx";
import { LogOut } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
    const { userData, setUserData } = useAuth();
    const [loading, setLoading] = useState(true);
    const [userStats, setUserStats] = useState({});
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const result = await logoutUser();
            if (result?.success) {
                toast.success(result?.message);
                navigate("/");
            }
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Logout failed");
        }
    };

    useEffect(() => {
        const userProfile = async () => {
            try {
                const res = await getUserProfileData();

                if (res?.success) {
                    setUserStats(res.stats || {});
                    setUserData(res.user); // ✅ sync auth user
                } else {
                    setUserStats({});
                    console.error(res?.message);
                }
            } finally {
                setLoading(false);
            }
        };

        userProfile();
    }, []);


    if (loading) return <Loader />;

    console.log("🔴 AUTH USER DATA =", userData);
    console.log("🔴 USER STATS =", userStats);
    console.log(userData?.profilePic)

    return (
        <>
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

                {/* PROFILE SECTION */}
                <div className="px-4 sm:px-10 max-w-7xl mx-auto">
                    {/* PROFILE ROW */}
                    <div
                        className="
              relative -mt-20
              mx-auto
              max-w-10xl
              px-4
              flex flex-col items-center text-center
              lg:grid lg:grid-cols-[auto_1fr]
              lg:items-end lg:text-left
              lg:gap-30
            "
                    >
                        {/* AVATAR + NAME */}
                        <div className="flex flex-col items-center lg:items-start">
                            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-md">
                                <img
                                    src={userData?.profilePic}
                                    alt="profile"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>


                            <h1 className="mt-4 text-2xl font-medium text-gray-900">
                                {userData?.username}
                            </h1>

                            <p className="text-green-950 font-medium text-sm mt-1">
                                Story Writer • Reader
                            </p>
                        </div>

                        {/* STATS */}
                        <div
                            className="
                mt-6
                grid grid-cols-3 gap-y-6 gap-x-10
                lg:mt-0
                lg:flex lg:items-center lg:gap-8
              "
                        >
                            <Stat
                                label="Stories"
                                value={userStats?.totalShortStoriesCreated || 0}
                            />
                            <Divider />
                            <Stat
                                label="Reads"
                                value={userStats?.totalShortStoriesRead || 0}
                            />
                            <Divider />
                            <Stat
                                label="Chapters+"
                                value={userStats?.totalChaptersCreated || 0}
                            />
                            <Divider />
                            <Stat
                                label="Chapters-"
                                value={userStats?.totalChaptersRead || 0}
                            />
                            <Divider />
                            <Stat label="Level" value={userStats?.level || 0} />
                            <Divider />
                            <Stat label="XP" value={userStats?.xp || 0} />
                        </div>
                    </div>

                    <div className="w-full h-px bg-gray-400 mt-9"></div>

                    {/* STORIES */}
                    <div>
                        <MyStories />
                    </div>
                </div>
            </div>
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
