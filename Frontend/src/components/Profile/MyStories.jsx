// import React, { useState } from "react";
// import { getUserCreatedShortStories } from "../../Api-calls/getUserCreatedShortStories.js";
// import Navbar from "../../components/Home/Navbar.jsx";
// import MyStoryCard from "./MyStoryCard.jsx";
// import { useQuery } from "@tanstack/react-query";
// import Loader from "../Loader.jsx";
// import { BookOpen } from "lucide-react";
// import { Link } from "react-router-dom";
// const MyStories = () => {
//     const [status, setStatus] = useState("published");

//     const { data, isLoading, isError, error } = useQuery({
//         queryKey: ["userCreatedShortStories", status],
//         queryFn: () => getUserCreatedShortStories(status),
//         refetchOnWindowFocus: false,
//         staleTime: 5000,
//     });

//     if (isLoading) return <Loader />;
//     if (isError) return <div className="p-6 text-red-500">{error.message}</div>;

//     const stories = data?.data || [];

//     return (
//         <div className=" bg-transparent  ">
//             <div className="max-w-7xl mx-auto py-7 sm:py-3">

//                 {/* ===== HEADER ===== */}
//                 <div className="flex flex-col sm:flex-row gap-5 items-center justify-between mb-8 sm:mb-8 ">

//                     <h2 className="text-2xl font-semibold text-white ">
//                         Your Stories
//                     </h2>

//                     {/* FILTERS */}
//                     <div className="flex items-center bg-[#059E70] rounded-full px-1 py-.5">
//                         <button
//                             onClick={() => setStatus("published")}
//                             className={`
//             cursor-pointer
//             flex items-center gap-2.5
//             px-3 py-1.5
//             rounded-full
//             text-xs font-semibold
//             transition-all
//             ${status === "published"
//                                     ? "bg-white text-black shadow-md"
//                                     : "text-white "}
//         `}
//                         >

//                             Published
//                         </button>

//                         <button
//                             onClick={() => setStatus("draft")}
//                             className={`
//             cursor-pointer
//             flex items-center gap-2.5
//             px-5 py-2.5
//             rounded-full
//             text-sm font-semibold
//             transition-all
//             ${status === "draft"
//                                     ? "bg-white text-black shadow-md"
//                                     : "text-white "}
//         `}
//                         >

//                             Draft
//                         </button>
//                     </div>

//                 </div>

//                 {/* ===== STORIES GRID ===== */}
//                 {stories.length === 0 ? (
//                     <p className="text-center text-gray-500 mt-20 text-sm">
//                         No {status} stories found.
//                     </p>
//                 ) : (
//                     <div
//                         className="
//                         grid
//                         grid-cols-2
//                         sm:grid-cols-3
//                         md:grid-cols-4
//                         lg:grid-cols-5
//                         gap-x-6
//                         gap-y-10
//                     "
//                     >
//                         {stories.map((story) => (


//                             <MyStoryCard
//                                 key={story._id}
//                                 id={story._id}
//                                 title={story.title}
//                                 image={story.coverImage}
//                                 status={story.status}
//                                 category={story.category}
//                                 time={story.createdAt}
//                             />


//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );

// };

// export default MyStories;



import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

import { useAuth } from "../../context/Authcontext.js";
import { getUserCreatedShortStories } from "../../Api-calls/getUserCreatedShortStories.js";

import Loader from "../Loader.jsx";
import MyStoryCard from "./MyStoryCard.jsx";

const MyStories = () => {
    const [status, setStatus] = useState("published");

    // 🔐 Auth state (Firebase-driven)
    const { userData, loading: authLoading } = useAuth();

    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["userCreatedShortStories", status],
        queryFn: () => getUserCreatedShortStories(status),

        // 🔥 IMPORTANT: wait for auth before calling protected API
        enabled: !authLoading && !!userData,

        refetchOnWindowFocus: false,
        staleTime: 5000,

        /*
        ======================================================
        🧁 COOKIE-BASED AUTH (FOR FUTURE USE)
        ------------------------------------------------------
        If you ever switch back to cookies:
        - remove `enabled`
        - enable withCredentials in API
        ======================================================
        */
    });

    // ⛔ Wait for auth OR data
    if (authLoading || isLoading) return <Loader />;

    if (isError) {
        return (
            <div className="p-6 text-red-500">
                {error?.message || "Failed to load stories"}
            </div>
        );
    }

    const stories = data?.data || [];

    return (
        <div className="bg-transparent">
            <div className="max-w-7xl mx-auto py-7 sm:py-3">
                {/* ===== HEADER ===== */}
                <div className="flex flex-col sm:flex-row gap-5 items-center justify-between mb-8">
                    <h2 className="text-2xl font-semibold text-white">
                        Your Stories
                    </h2>

                    {/* ===== FILTERS ===== */}
                    <div className="flex items-center bg-[#059E70] rounded-full px-1 py-0.5">
                        <button
                            onClick={() => setStatus("published")}
                            className={`
                cursor-pointer
                px-3 py-1.5
                rounded-full
                text-xs font-semibold
                transition-all
                ${status === "published"
                                    ? "bg-white text-black shadow-md"
                                    : "text-white"
                                }
              `}
                        >
                            Published
                        </button>

                        <button
                            onClick={() => setStatus("draft")}
                            className={`
                cursor-pointer
                px-5 py-2.5
                rounded-full
                text-sm font-semibold
                transition-all
                ${status === "draft"
                                    ? "bg-white text-black shadow-md"
                                    : "text-white"
                                }
              `}
                        >
                            Draft
                        </button>
                    </div>
                </div>

                {/* ===== STORIES GRID ===== */}
                {stories.length === 0 ? (
                    <p className="text-center text-gray-500 mt-20 text-sm">
                        No {status} stories found.
                    </p>
                ) : (
                    <div
                        className="
              grid
              grid-cols-2
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-5
              gap-x-6
              gap-y-10
            "
                    >
                        {stories.map((story) => (
                            <MyStoryCard
                                key={story._id}
                                id={story._id}
                                title={story.title}
                                image={story.coverImage}
                                status={story.status}
                                category={story.category}
                                time={story.createdAt}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyStories;
