import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ThumbsUp, Bookmark } from "lucide-react";
import { toast } from "react-toastify";

import Loader from "../Loader.jsx";
import { OpenFeedShortStory } from "../../Api-calls/OpenFeedShortStory.js";
import { likeShortStory } from "../../Api-calls/likeShortStory.js";
import { addShortStoryToGoodReads } from "../../Api-calls/addShortStoryToGoodReads.js";

const ViewShortStory = () => {
    const { storyId } = useParams();

    const [story, setStory] = useState({});
    const [loading, setLoading] = useState(true);

    // UI states
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    const [addedToGoodReads, setAddedToGoodReads] = useState(false);
    const [goodReadsCount, setGoodReadsCount] = useState(0);

    /* ---------------- FETCH STORY ---------------- */
    const fetchStory = async () => {
        try {
            const result = await OpenFeedShortStory({ storyId });

            if (result?.success) {
                const data = result.data.ShortStory;

                setStory(data);
                setLiked(data.isLiked);
                setAddedToGoodReads(data.isGoodRead);
                setLikesCount(data.likes);
                setGoodReadsCount(data.totalGoodReads);
            }
        } catch (error) {
            console.error("Error fetching story:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStory();
    }, [storyId]);

    /* ---------------- LIKE HANDLER ---------------- */
    const handleLike = async () => {
        // optimistic UI
        setLiked(prev => !prev);
        setLikesCount(prev => (liked ? prev - 1 : prev + 1));

        // call backend ONLY when liking
        if (liked) return;

        try {
            await likeShortStory({ storyId });
        } catch (error) {
            // rollback on failure
            setLiked(true);
            setLikesCount(prev => prev - 1);
            toast.error("Failed to like story");
        }
    };

    /* ---------------- GOOD READ HANDLER ---------------- */
    const handleGoodReads = async () => {
        // optimistic UI
        setAddedToGoodReads(prev => !prev);
        setGoodReadsCount(prev =>
            addedToGoodReads ? prev - 1 : prev + 1
        );

        // call backend ONLY when adding
        if (addedToGoodReads) return;

        try {
            const result = await addShortStoryToGoodReads({ storyId });
            if (!result?.success) throw new Error();
            toast.success(result.message);
        } catch (error) {
            // rollback
            setAddedToGoodReads(true);
            setGoodReadsCount(prev => prev - 1);
            toast.error("Failed to save Good Read");
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-[#f8f9fb] text-gray-800">

            {/* COVER IMAGE */}
            <div className="relative w-full h-[350px] overflow-visible">
                <img
                    src={story.coverImage}
                    alt="Story Cover"
                    className="w-full h-full object-cover object-top"
                />

                {/* CATEGORY BADGE */}
                <span className="
          absolute bottom-0 left-1/2
          -translate-x-1/2 translate-y-1/2
          bg-[#1f3d34] text-white
          px-7 py-2 rounded-full
          text-md shadow-lg
          border-4 border-white
        ">
                    {story.category}
                </span>
            </div>

            {/* CONTENT */}
            <div className="max-w-4xl mx-auto px-6 sm:px-10 pt-16">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-10">

                    {/* TITLE + AUTHOR */}
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-gray-900">
                            {story.title}
                        </h1>

                        <div className="flex items-center gap-2 mt-2">
                            <img
                                src={story.author?.profilePic}
                                alt={story.author?.username}
                                className="w-6 h-6 rounded-full object-cover"
                            />
                            <p className="text-sm text-gray-500">
                                {story.author?.username}
                            </p>
                        </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex items-center gap-2">

                        {/* LIKE */}
                        <button
                            onClick={handleLike}
                            className="
                inline-flex items-center gap-2
                px-4 py-2 rounded-full
                border border-black
                text-sm whitespace-nowrap
                hover:bg-gray-100
              "
                        >
                            <ThumbsUp
                                size={16}
                                stroke="black"
                                fill={liked ? "black" : "none"}
                            />
                            <span className="font-semibold">
                                {likesCount} Likes
                            </span>
                        </button>

                        {/* GOOD READ */}
                        <button
                            onClick={handleGoodReads}
                            className="
                inline-flex items-center gap-2
                px-4 py-2 rounded-full
                border border-emerald-400
                text-sm whitespace-nowrap
                text-emerald-600
                hover:bg-emerald-50
              "
                        >
                            <Bookmark
                                size={16}
                                stroke="currentColor"
                                fill={addedToGoodReads ? "currentColor" : "none"}
                            />
                            <span>{goodReadsCount} Good reads</span>
                        </button>

                    </div>
                </div>

                {/* DESCRIPTION */}
                {story.description && (
                    <div className="mt-8">
                        <p className="text-sm text-center sm:text-left font-semibold uppercase text-gray-800 mb-2">
                            Description
                        </p>
                        <p className="text-gray-600 text-center sm:text-left font-medium">
                            {story.description}
                        </p>
                    </div>
                )}

                <hr className="my-10 border-gray-200" />

                {/* STORY CONTENT */}
                <div className="prose prose-gray max-w-none font-serif text-[19px] leading-[1.6]">
                    <div
                        dangerouslySetInnerHTML={{
                            __html: story.story.replace(
                                "<p>",
                                `<p class="first-letter:text-6xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-gray-900">`
                            ),
                        }}
                    />
                </div>

            </div>
        </div>
    );
};

export default ViewShortStory;
