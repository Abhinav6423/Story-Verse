import React, { useState } from "react";
import HomeGoodReadCard from "./HomeGoodReadCard";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listTopGoodReadsShortStory } from "../../Api-calls/TopGoodreadsShortStory.js"
import Loader from "../Loader.jsx";

function HomeGoodReadGrid() {


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
            <div className="hidden lg:block absolute inset-0 bg-transparent" />

            {/* ===== MOBILE + TABLET GRADIENT ===== */}
            <div className="lg:hidden absolute inset-0" />

            {/* ===== CONTENT ===== */}
            <div
                className="
        relative z-10
        px-4 py-6
        sm:px-6 sm:py-8
        md:px-8 md:py-10
        lg:px-16 lg:py-12
        xl:px-24 xl:py-14
        flex flex-col
        lg:flex-row
        gap-6 sm:gap-8 md:gap-10 lg:gap-20
        lg:items-center
      "
            >
                {/* LEFT INFO */}
                <div className="max-w-[300px] sm:max-w-[340px] md:max-w-[380px] lg:max-w-[420px] space-y-4 sm:space-y-5">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <BookOpen
                            size={18}
                            strokeWidth={3}
                            className="relative top-[1px] sm:size-[22px] lg:size-[24px]"
                        />
                        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium leading-none">
                            Good reads
                        </h2>
                    </div>

                    <p className="text-sm sm:text-[15px] md:text-base text-white/80 leading-snug font-normal">
                        Stories that stood out to readers and <br />
                        earned their place through votes and appreciation.
                    </p>
                </div>

                {/* RIGHT CARDS */}
                <div
                    className="
          flex
          gap-4 sm:gap-5 md:gap-6
          w-full
          overflow-x-auto
          lg:overflow-visible
          scrollbar-hide
          snap-x snap-mandatory
          py-3
          px-2 sm:px-4 md:px-6 lg:px-0
        "
                >
                    {shortStories.map((story, index) => (
                        <Link
                            key={story._id}
                            to={`/story/${story._id}`}
                            className="
              flex-shrink-0
              snap-start
            "
                        >
                            <HomeGoodReadCard
                                story={story}
                                rank={index + 1}
                            />
                        </Link>
                    ))}
                </div>
            </div>

            {/* ===== BOTTOM DIVIDER ===== */}
            <div
                className="
        absolute
        bottom-0
        left-0
        w-full
        h-px
        bg-white/70
        mx-4 sm:mx-6 md:mx-8 lg:mx-16 xl:mx-24
      "
            />
        </section>
    );


}

export default HomeGoodReadGrid;
