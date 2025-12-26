import React from "react";
import { OpenFeedShortStory } from "../../Api-calls/OpenFeedShortStory.js";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Loader from "../Loader.jsx";
import { likeShortStory } from "../../Api-calls/likeShortStory.js"
import { ThumbsUp } from "lucide-react";
const ViewShortStory = () => {


    const [story, setStory] = useState({});
    const [loading, setLoading] = useState(true)
    const { storyId } = useParams();
    console.log(storyId)
    const [liked, setLiked] = useState(false);


    const handleLike = async () => {
        try {
            const result = await likeShortStory({ storyId: storyId });
            console.log(result)
            if (result?.success) {
                setLiked(true);
            }

        } catch (error) {
            console.error("Error liking story:", error);
        }
    };


    const fetchStory = async () => {
        try {
            const result = await OpenFeedShortStory({ storyId });
            if (result?.success) {
                console.log(result?.data?.ShortStory)
                setStory(result?.data?.ShortStory);
                setLiked(result?.data?.ShortStory?.isLiked);
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



    if (loading) return <Loader />

    return (
        <div className="min-h-screen bg-[#141414] text-gray-200">

            {/* BOOK CONTAINER */}
            <div
                className="
        max-w-screen mx-auto
        bg-[#181818]
        shadow-[0_20px_60px_rgba(0,0,0,0.6)]
        overflow-hidden
      "
            >

                {/* COVER (UNCHANGED) */}
                <div className="w-full h-72 sm:h-96 overflow-hidden">
                    <img
                        src={story.coverImage}
                        alt="Story Cover"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* HEADER BLOCK */}
                <div className="px-6 sm:px-10 pt-10 text-center">

                    {/* CATEGORY */}
                    <p
                        className="
            text-lg
            tracking-wide
            uppercase
            font-semibold
            text-red-500
            mb-3
          "
                    >
                        {story?.category}
                    </p>

                    {/* TITLE */}
                    <h1
                        className="
            text-[38px] sm:text-[44px]
            font-serif
            font-bold
            text-white
            leading-tight
            tracking-tight
          "
                    >
                        {story.title}
                    </h1>

                    {/* AUTHOR */}
                    <div className="flex justify-center items-center gap-3 mt-6">
                        <img
                            src={story?.author?.profilePic}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-white/10"
                            alt="author"
                        />
                        <span className="text-sm text-gray-400 font-medium">
                            By <span className="text-gray-200">{story?.author?.username}</span>
                        </span>
                    </div>

                    {/* LIKE BUTTON */}
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={handleLike}
                            disabled={liked}
                            className={`
            flex items-center gap-2
            px-6 py-2.5
            rounded-full
            font-semibold
            transition-all
            duration-300
            border
            ${liked
                                    ? "bg-red-600 text-white border-red-600 cursor-not-allowed"
                                    : "bg-transparent text-white border-white/30 hover:bg-red-600 hover:border-red-600"}
        `}
                        >
                            <ThumbsUp
                                size={20}
                                className={liked ? "text-white" : "text-red-600"}
                            />

                            <span>
                                {liked ? "Liked" : "Like"}
                            </span>
                        </button>
                    </div>


                    {/* DIVIDER */}
                    <div className="mx-auto mt-8 mb-10 h-px w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    {/* INTRO / SUBTITLE */}
                    {story?.description && (
                        <p
                            className="
              text-[18px]
              text-gray-400
              italic
              max-w-xl
              font-semibold
              mx-auto
              leading-relaxed
            "
                        >
                            {story.description}
                        </p>
                    )}
                </div>

                {/* READING AREA (UNCHANGED ALIGNMENT) */}
                <div
                    className="
          px-6
          sm:px-10
          md:px-16
          py-12
          font-serif
          text-[18px]
          sm:text-[20px]
          leading-relaxed
          text-gray-300
          reader-area
        "
                    style={{
                        maxWidth: "80vw",
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
