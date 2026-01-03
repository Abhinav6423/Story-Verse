import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ThumbsUp, Bookmark } from "lucide-react";
import { toast } from "react-toastify";
import { MessageSquare, X } from "lucide-react";


import Loader from "../Loader.jsx";
import { OpenFeedShortStory } from "../../Api-calls/OpenFeedShortStory.js";
import { likeShortStory } from "../../Api-calls/likeShortStory.js";
import { addShortStoryToGoodReads } from "../../Api-calls/addShortStoryToGoodReads.js";
import { answerQuestionShortStory } from "../../Api-calls/answerQuestionShortStory.js"

const ViewShortStory = () => {
    const { storyId } = useParams();

    const [story, setStory] = useState({});
    const [loading, setLoading] = useState(true);

    // UI states
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    const [addedToGoodReads, setAddedToGoodReads] = useState(false);
    const [goodReadsCount, setGoodReadsCount] = useState(0);
    const [questionPopup, setQuestionPopup] = useState(false)
    const [answer, setAnswer] = useState("")
    const [alreadyAnswered, setAlreadyAnswered] = useState(false)

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
                setAlreadyAnswered(data.isQuestionAnswered === true);
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

    // freezes screen 
    useEffect(() => {
        if (!questionPopup) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow || "auto";
        };
    }, [questionPopup]);

    const handleAnswerSubmit = async () => {
        if (!answer.trim()) {
            toast.error("Answer cannot be empty");
            return;
        }

        const result = await answerQuestionShortStory({ storyId, answer });

        if (result.success) {
            toast.info("Submitting answer...");
            toast.success(result.message);

            setAlreadyAnswered(true)

            setAnswer("");
            setQuestionPopup(false);
        } else {
            toast.error(result.message);
        }
    };





    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-[#f8f9fb] text-gray-800">

            {/* COVER IMAGE */}
            <div className="relative w-full h-[260px] sm:h-[350px] overflow-visible">
                {story?.coverImage ? (
                    <img
                        src={story.coverImage}
                        alt={story.title}
                        className="
        w-full
        h-full
        object-cover
        hover:scale-105
        transition-transform
        duration-300
      "
                    />
                ) : (
                    <div
                        className="
        w-full
        h-full
        flex
        items-center
        justify-center
        bg-sky-100
        text-sky-900
        px-4
        text-center
      "
                    >
                        <h3 className="text-lg font-semibold leading-snug line-clamp-4">
                            {story.title}
                        </h3>
                    </div>
                )}

                {/* CATEGORY BADGE */}
                <span
                    className="
                    absolute bottom-0 left-1/2
                    -translate-x-1/2 translate-y-1/2
                    bg-[#1f3d34] text-white
                    px-6 py-2 rounded-full
                    text-sm sm:text-md
                    shadow-lg
                    border-4 border-white
                "
                >
                    {story.category}
                </span>
            </div>

            {/* CONTENT */}
            <div className="max-w-4xl mx-auto px-4 sm:px-10 pt-12 sm:pt-16">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-8">

                    {/* TITLE + AUTHOR */}
                    <div>
                        <h1 className="text-2xl sm:text-4xl text-center sm:text-left font-serif font-medium text-gray-900">
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
                    <div className="flex items-center justify-center sm:justify-end gap-2 sm:gap-3">
                        <button
                            onClick={handleLike}
                            className={`
                            inline-flex items-center gap-1.5
                            px-3 py-2 rounded-full text-xs sm:text-sm border transition
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

                        <button
                            onClick={handleGoodReads}
                            className={`
                            inline-flex items-center gap-2
                            px-4 py-2 rounded-full text-sm font-semibold border transition
                            ${addedToGoodReads
                                    ? "bg-emerald-600 text-white border-emerald-600"
                                    : "bg-white text-emerald-600 border-emerald-400 hover:bg-emerald-50"}
                        `}
                        >
                            <Bookmark
                                size={18}
                                fill={addedToGoodReads ? "currentColor" : "none"}
                            />
                            {goodReadsCount} Good Reads
                        </button>
                    </div>
                </div>

                {/* DESCRIPTION */}
                {story.description && (
                    <p
                        className="
            mt-6
            text-base sm:text-lg
            text-gray-600
            font-serif
            leading-relaxed
            max-w-3xl
            mx-auto sm:mx-0
            text-center sm:text-left
        "
                    >
                        {story.description}
                    </p>
                )}


                <hr className="my-8 border-gray-200" />

                {/* STORY CONTENT */}
                <div
                    className="
    prose
    prose-gray
    font-serif
    text-[18px]
    leading-[1.6]
    max-w-full
    overflow-x-hidden
    break-words
  "
                >

                    <div
                        dangerouslySetInnerHTML={{
                            __html: story.story.replace(
                                "<p>",
                                `<p class="first-letter:text-6xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:leading-none">`
                            ),
                        }}
                    />
                </div>

                {/* FINAL QUESTION CARD */}
                <div className="w-full bg-[#0f2a22] rounded-xl p-4 sm:p-5 shadow-lg mt-6">

                    <div className="flex items-center gap-2 mb-3 justify-center sm:justify-start">
                        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white text-emerald-600 font-bold">
                            ?
                        </div>
                        <h3 className="text-sm font-semibold text-white">
                            Final Question
                        </h3>
                    </div>

                    <p className="text-sm text-white mb-4 text-center sm:text-left">
                        {story.finalQuestion}
                    </p>

                    <div className="bg-emerald-900/80 border border-emerald-700 rounded-lg px-4 py-2">
                        <p className="text-xs text-emerald-200 text-center sm:text-left">
                            On correct answer, you will receive 20XP & on incorrect answer, you will receive 0XP.
                        </p>
                    </div>

                    <button
                        disabled={alreadyAnswered}
                        onClick={() => !alreadyAnswered && setQuestionPopup(true)}
                        className={`
                        mt-4 w-full py-2 rounded-3xl text-sm font-semibold transition
                        ${alreadyAnswered
                                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                : "bg-emerald-600 hover:bg-emerald-700 text-white"}
                    `}
                    >
                        {alreadyAnswered ? "Already Answered" : "Get Started"}
                    </button>
                </div>
            </div>

            {/* MODAL */}
            {questionPopup && (
                <>
                    {/* BACKDROP */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
                        onClick={() => setQuestionPopup(false)}
                    />

                    {/* MODAL */}
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <div
                            className="
                    w-full
                    max-w-sm
                    bg-[#0f2a22]
                    rounded-2xl
                    px-4
                    py-6
                    sm:px-5
                    shadow-2xl
                    relative
                    max-h-[90vh]
                    overflow-y-auto
                "
                        >
                            {/* CLOSE */}
                            <button
                                onClick={() => setQuestionPopup(false)}
                                className="absolute top-3 right-3 text-gray-400 hover:text-white"
                            >
                                <X size={18} />
                            </button>

                            {/* HEADER */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-7 h-7 flex items-center justify-center bg-emerald-600 text-white font-bold">
                                    ?
                                </div>
                                <h3 className="text-white font-semibold">
                                    Final Question
                                </h3>
                            </div>

                            {/* QUESTION */}
                            <p className="text-sm text-white mb-3">
                                {story.finalQuestion}
                            </p>

                            {/* INPUT */}
                            <input
                                type="text"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Type your answer here"
                                className="
                        w-full
                        bg-[#133a2f]
                        text-white
                        placeholder:text-emerald-300
                        border border-emerald-700
                        rounded-xl
                        px-4
                        py-3
                        text-sm
                        focus:ring-2 focus:ring-emerald-500
                    "
                            />

                            {/* INFO */}
                            <p className="mt-3 px-4 py-2 rounded-lg text-xs text-emerald-100 bg-emerald-900/80 border border-emerald-700">
                                On correct answer, you will receive 50XP & on incorrect answer, you will receive 0XP.
                            </p>

                            {/* SUBMIT */}
                            <button
                                onClick={handleAnswerSubmit}
                                className="mt-5 w-full py-2 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </>
            )}


        </div>
    );


};

export default ViewShortStory;
