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
        const wasLiked = liked;

        // 🔥 INSTANT TOAST
        toast.info(wasLiked ? "Removing like..." : "Liking story...");

        // optimistic UI
        setLiked(!wasLiked);
        setLikesCount(prev => (wasLiked ? prev - 1 : prev + 1));

        try {
            await likeShortStory({ storyId });
            toast.dismiss();
            toast.success(wasLiked ? "Like removed" : "Story liked ❤️");
        } catch (error) {
            toast.dismiss();
            setLiked(wasLiked);
            setLikesCount(prev => (wasLiked ? prev + 1 : prev - 1));
            toast.error("Action failed");
        }
    };


    /* ---------------- GOOD READ HANDLER ---------------- */
    const handleGoodReads = async () => {
        const wasAdded = addedToGoodReads; // snapshot

        toast.info(wasAdded ? "Removing from Good Reads" : "Adding to Good Reads");

        // optimistic toggle
        setAddedToGoodReads(!wasAdded);
        setGoodReadsCount(prev => (wasAdded ? prev - 1 : prev + 1));

        try {
            const result = await addShortStoryToGoodReads({ storyId });
            if (!result?.success) throw new Error();

            toast.success(
                wasAdded ? "Removed from Good Reads" : "Added to Good Reads 📚"
            );
        } catch (error) {
            // rollback
            setAddedToGoodReads(wasAdded);
            setGoodReadsCount(prev => (wasAdded ? prev + 1 : prev - 1));
            toast.error("Action failed");
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
                <span
                    className="
          absolute bottom-0 left-1/2
          -translate-x-1/2 translate-y-1/2
          bg-[#1f3d34] text-white
          px-7 py-2 rounded-full
          text-md shadow-lg
          border-4 border-white
        "
                >
                    {story.category}
                </span>
            </div>

            {/* CONTENT */}
            <div className="max-w-4xl mx-auto px-6 sm:px-10 pt-16">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-8">

                    {/* TITLE + AUTHOR */}
                    <div>
                        <h1 className="text-3xl text-center sm:text-4xl font-serif font-medium text-gray-900">
                            {story.title}
                        </h1>

                        <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
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
                    <div
                        className="
    flex items-center
    justify-center sm:justify-end
    gap-2 sm:gap-3
    whitespace-nowrap
  "
                    >
                        {/* LIKE */}
                        <button
                            onClick={handleLike}
                            className={`
      inline-flex items-center gap-1.5
      px-3 py-2 sm:px-4
      rounded-full
      text-xs sm:text-sm
      border
      transition
      ${liked
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-black border-black hover:bg-gray-100"}
    `}
                        >
                            <ThumbsUp
                                size={14}
                                stroke={liked ? "white" : "black"}
                                fill={liked ? "white" : "none"}
                            />
                            <span className="font-semibold">
                                {likesCount} Likes
                            </span>
                        </button>

                        {/* GOOD READ */}
                        <button
                            onClick={handleGoodReads}
                            className={`
      inline-flex items-center gap-2
      px-4 py-2 sm:px-6 sm:py-3
      rounded-full
      text-sm sm:text-base
      font-semibold
      border
      transition
      ${addedToGoodReads
                                    ? "bg-emerald-600 text-white border-emerald-600"
                                    : "bg-white text-emerald-600 border-emerald-400 hover:bg-emerald-50"}
    `}
                        >
                            <Bookmark
                                size={18}
                                stroke="currentColor"
                                fill={addedToGoodReads ? "currentColor" : "none"}
                            />
                            <span>
                                {goodReadsCount} Good Reads
                            </span>
                        </button>
                    </div>

                </div>

                {/* DESCRIPTION */}
                {story.description && (
                    <div className="mt-19 ">
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
