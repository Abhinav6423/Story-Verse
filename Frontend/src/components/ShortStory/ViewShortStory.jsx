import React from "react";
import { OpenFeedShortStory } from "../../Api-calls/OpenFeedShortStory.js";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Loader from "../Loader.jsx";
const ViewShortStory = () => {


    const [story, setStory] = useState({});
    const [loading, setLoading] = useState(true)
    const { storyId } = useParams();
    console.log(storyId)

    const fetchStory = async () => {
        try {
            const result = await OpenFeedShortStory({ storyId });
            if (result?.success) {
                console.log(result?.data?.ShortStory)
                setStory(result?.data?.ShortStory);
            }
        } catch (error) {
            console.error("Error fetching story:", error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStory();
    }, [storyId]);


    return (
        <div className="min-h-screen bg-[#f6f4ef] text-gray-900 ">

            {/* BOOK CONTAINER */}
            <div className="
    max-w-4xl mx-auto
    bg-white

    shadow-[0_20px_60px_rgba(0,0,0,0.12)]
    overflow-hidden
  ">

                {/* COVER (PART OF BOOK) */}
                <div className="w-full h-72 sm:h-96 overflow-hidden">
                    <img
                        src={story.coverImage}
                        alt="Story Cover"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* BOOK HEADER */}
                <div className="px-6 sm:px-10 pt-8 text-center">

                    <p className="text-xs tracking-widest text-indigo-600 font-semibold uppercase">
                        {story?.category}
                    </p>

                    <h1 className="mt-3 text-3xl sm:text-4xl font-serif font-bold text-gray-900 leading-snug">
                        {story.title}
                    </h1>

                    {/* AUTHOR */}
                    <div className="flex justify-center items-center mt-4">
                        <img
                            src={story?.author?.profilePic}
                            className="w-9 h-9 rounded-full border object-cover"
                            alt="author"
                        />
                        <span className="ml-3 text-sm text-gray-600 font-medium">
                            By {story?.author?.username}
                        </span>
                    </div>

                    {/* DIVIDER */}
                    <div className="mx-auto mt-6 h-[1px] w-24 bg-gray-300 rounded-full"></div>
                </div>

                {/* READING PAGE */}
                <div
                    className="
        px-6
        sm:px-10
        md:px-16
        py-10
        font-serif
        text-[17px]
        leading-relaxed
        text-[#1b1b1b]
        reader-area
      "
                    style={{
                        maxWidth: "680px",
                        margin: "0 auto",
                    }}
                >
                    <div dangerouslySetInnerHTML={{ __html: story?.story }} />
                </div>
            </div>
        </div>

    );
};

export default ViewShortStory;
