import React from "react";
import GoodReadShortStoryCard from "./GoodReadShortStoryCard.jsx";
import { Bookmark } from "lucide-react";
import Navbar from "../Home/Navbar.jsx";
import { userGoodReadsCollection } from "../../Api-calls/userGoodReadsCollection.js";
import Loader from "../Loader.jsx";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom"

const GoodReadsShortStoryGrid = () => {
    // const stories = [
    //     {
    //         "id": 1,
    //         "title": "The Last Train at 2:17 AM",
    //         "author": "Arjun Malhotra",
    //         "authorPhoto": "https://randomuser.me/api/portraits/men/32.jpg",
    //         "coverPic": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    //         "likes": 342
    //     },
    //     {
    //         "id": 2,
    //         "title": "Room 704",
    //         "author": "Meera Kapoor",
    //         "authorPhoto": "https://randomuser.me/api/portraits/women/45.jpg",
    //         "coverPic": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3",
    //         "likes": 521
    //     },
    //     {
    //         "id": 3,
    //         "title": "The Day the Sky Froze",
    //         "author": "Rohan Verma",
    //         "authorPhoto": "https://randomuser.me/api/portraits/men/54.jpg",
    //         "coverPic": "https://images.unsplash.com/photo-1519681393784-d120267933ba",
    //         "likes": 289
    //     },
    //     {
    //         "id": 4,
    //         "title": "Letters Never Sent",
    //         "author": "Ananya Singh",
    //         "authorPhoto": "https://randomuser.me/api/portraits/women/68.jpg",
    //         "coverPic": "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
    //         "likes": 614
    //     },
    //     {
    //         "id": 5,
    //         "title": "Midnight on Platform Zero",
    //         "author": "Kunal Sharma",
    //         "authorPhoto": "https://randomuser.me/api/portraits/men/71.jpg",
    //         "coverPic": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    //         "likes": 198
    //     },
    //     {
    //         "id": 6,
    //         "title": "The Silence Between Heartbeats",
    //         "author": "Ishita Rao",
    //         "authorPhoto": "https://randomuser.me/api/portraits/women/22.jpg",
    //         "coverPic": "https://images.unsplash.com/photo-1506784983877-45594efa4cbe",
    //         "likes": 437
    //     },
    //     {
    //         "id": 7,
    //         "title": "Echoes in an Empty House",
    //         "author": "Dev Patel",
    //         "authorPhoto": "https://randomuser.me/api/portraits/men/19.jpg",
    //         "coverPic": "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
    //         "likes": 356
    //     },
    //     {
    //         "id": 8,
    //         "title": "A Map with No Destinations",
    //         "author": "Nisha Chatterjee",
    //         "authorPhoto": "https://randomuser.me/api/portraits/women/12.jpg",
    //         "coverPic": "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
    //         "likes": 274
    //     },
    //     {
    //         "id": 9,
    //         "title": "When the Clock Stopped",
    //         "author": "Siddharth Jain",
    //         "authorPhoto": "https://randomuser.me/api/portraits/men/88.jpg",
    //         "coverPic": "https://images.unsplash.com/photo-1499084732479-de2c02d45fc4",
    //         "likes": 483
    //     },
    //     {
    //         "id": 10,
    //         "title": "The Girl Who Borrowed Tomorrow",
    //         "author": "Pooja Mehta",
    //         "authorPhoto": "https://randomuser.me/api/portraits/women/39.jpg",
    //         "coverPic": "https://images.unsplash.com/photo-1516542076529-1ea3854896e1",
    //         "likes": 699
    //     }
    // ]

    const { isLoading, isError, data } = useQuery({
        queryKey: ['userGoodReads'],
        queryFn: () => userGoodReadsCollection()
    });

    const stories = data?.shortStories || [];

    if (isLoading) return <Loader />
    if (isError) return <div className="p-6 text-red-500">{isError}</div>

    return (
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#dff7ee] to-white">
            

            {/* SOFT GREEN GLOW (responsive) */}
            <div
                className="
        pointer-events-none
        absolute
        -top-40 md:-top-52
        left-1/2
        -translate-x-1/2
        w-[600px] h-[600px]
        md:w-[900px] md:h-[900px]
        rounded-full
        bg-[radial-gradient(circle,_rgba(16,185,129,0.22)_0%,_rgba(16,185,129,0.12)_35%,_transparent_70%)]
      "
            />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

                {/* ================= HEADER ================= */}
                <div className="mb-6 sm:mb-10">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                        Your Good Reads
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Stories you’ve saved to read again
                    </p>
                </div>

                {/* ================= EMPTY STATE ================= */}
                {stories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-16 sm:py-20 px-4">
                        <Bookmark size={36} className="text-emerald-500 mb-4" />
                        <h3 className="text-gray-900 text-base sm:text-lg font-medium">
                            No saved stories yet
                        </h3>
                        <p className="text-gray-500 text-sm mt-2 max-w-sm">
                            Start exploring and save stories you love. They’ll appear here.
                        </p>
                    </div>
                ) : (
                    /* ================= GRID ================= */
                    <div
                        className="
            grid gap-4 sm:gap-6
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
          "
                    >
                        {stories.map((story) => (
                            <Link
                                to={`/story/${story._id}`}
                                key={story._id}
                                className="block"
                            >
                                <GoodReadShortStoryCard story={story} />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );


};

export default GoodReadsShortStoryGrid;
