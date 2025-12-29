import React, { useState } from "react";
import HomeGoodReadCard from "./HomeGoodReadCard";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listTopGoodReadsShortStory } from "../../Api-calls/TopGoodreadsShortStory.js"
import Loader from "../Loader.jsx";

function HomeGoodReadGrid() {
    const stories = [
        {
            _id: "gr1",
            title: "The Tenant",
            coverImage: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
            totalGoodReads: "10.6k",
            author: {
                username: "Aleen Kizoff",
                profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
            },
        },
        {
            _id: "gr2",
            title: "Cut to the Bone",
            coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
            totalGoodReads: "8.1k",
            author: {
                username: "Ellison Cooper",
                profilePic: "https://randomuser.me/api/portraits/women/44.jpg",
            },
        },
        {
            _id: "gr3",
            title: "Eritis: The Silver Legacy",
            coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c",
            totalGoodReads: "7.4k",
            author: {
                username: "T.E. Stoyer",
                profilePic: "https://randomuser.me/api/portraits/men/65.jpg",
            },
        },
    ];

    const { data, isLoading, isError } = useQuery({
        queryKey: ["topGoodReadsShortStory"],
        queryFn: listTopGoodReadsShortStory,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    console.log(data?.goodreads?.map(gr => gr?.story) || [])
    const shortStories =
        data?.goodreads?.map(gr => gr.story) || [];


    if (isLoading) return <Loader />
    if (isError) return alert("Something went wrong")


    return (
        <section className="relative text-white overflow-hidden">
            {/* ===== DESKTOP GRADIENT ===== */}
            <div
                className="
          hidden md:block
          absolute inset-0
        "
                style={{
                    background: `
            linear-gradient(
              90deg,
              #0b3d2e 0%,
              #0e5a45 25%,
              #1fd1a3 50%,
              #0e5a45 75%,
              #0b3d2e 100%
            )
          `,
                }}
            />

            {/* ===== MOBILE GRADIENT ===== */}
            <div
                className="
          md:hidden
          absolute inset-0
        "
                style={{
                    background: `
            radial-gradient(
              circle at 60% 35%,
              #1fd1a3 0%,
              #0e5a45 45%,
              #0b3d2e 100%
            )
          `,
                }}
            />

            {/* ===== CONTENT ===== */}
            <div
                className="
          relative z-10
          px-4 py-6
          md:px-10 md:py-8
          flex flex-col
          md:flex-row
          gap-6 sm:gap-26
          md:items-center
        "
            >
                {/* LEFT INFO */}
                <div className="max-w-[280px] space-y-4">
                    <div className="flex items-center gap-2">
                        <BookOpen size={20} strokeWidth={3} className="relative top-[1px]" />
                        <h2 className="text-xl md:text-2xl font-medium leading-none">
                            Good reads
                        </h2>
                    </div>

                    <p className="text-sm text-white/80 leading-snug font-normal">
                        Stories that stood out to readers and <br /> earned their place through
                        votes and  appreciation.
                    </p>
                </div>

                {/* RIGHT CARDS */}
                <div
                    className="
    flex gap-4
    w-full
    overflow-x-auto
    md:overflow-visible
    scrollbar-hide
    py-2
    px-4 md:px-0
  "
                >
                    {shortStories.map((story, index) => (
                        <Link
                            key={story._id}
                            to={`/story/${story._id}`}
                            className="
        
      "
                        >
                            <HomeGoodReadCard
                                story={story}
                                rank={index + 1}
                            />
                        </Link>
                    ))}

                    {/* 👇 SCROLL END SPACER (CRITICAL) */}
                    <div className="flex-none w-4 md:hidden" />
                </div>



            </div>
        </section>
    );
}

export default HomeGoodReadGrid;
