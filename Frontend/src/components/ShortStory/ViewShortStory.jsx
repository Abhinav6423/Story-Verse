import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ThumbsUp, Bookmark, MessageSquare, X } from "lucide-react";
import { toast } from "react-toastify";

import Loader from "../Loader.jsx";
import { OpenFeedShortStory } from "../../Api-calls/OpenFeedShortStory.js";
import { likeShortStory } from "../../Api-calls/likeShortStory.js";
import { addShortStoryToGoodReads } from "../../Api-calls/addShortStoryToGoodReads.js";
import { answerQuestionShortStory } from "../../Api-calls/answerQuestionShortStory.js";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const ViewShortStory = () => {
    const { storyId } = useParams();

    const [story, setStory] = useState({});
    const [loading, setLoading] = useState(true);

    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    const [addedToGoodReads, setAddedToGoodReads] = useState(false);
    const [goodReadsCount, setGoodReadsCount] = useState(0);

    const [questionPopup, setQuestionPopup] = useState(false);
    const [answer, setAnswer] = useState("");
    const [alreadyAnswered, setAlreadyAnswered] = useState(false);

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
        toast.info(wasLiked ? "Removing like..." : "Liking story...");

        setLiked(!wasLiked);
        setLikesCount((prev) => (wasLiked ? prev - 1 : prev + 1));

        try {
            await likeShortStory({ storyId });
            toast.dismiss();
            toast.success(wasLiked ? "Like removed" : "Story liked ❤️");
        } catch {
            toast.dismiss();
            setLiked(wasLiked);
            setLikesCount((prev) => (wasLiked ? prev + 1 : prev - 1));
            toast.error("Action failed");
        }
    };

    /* ---------------- GOOD READ HANDLER ---------------- */
    const handleGoodReads = async () => {
        const wasAdded = addedToGoodReads;
        toast.info(wasAdded ? "Removing from Good Reads" : "Adding to Good Reads");

        setAddedToGoodReads(!wasAdded);
        setGoodReadsCount((prev) => (wasAdded ? prev - 1 : prev + 1));

        try {
            const result = await addShortStoryToGoodReads({ storyId });
            if (!result?.success) throw new Error();
            toast.success(wasAdded ? "Removed from Good Reads" : "Added to Good Reads 📚");
        } catch {
            setAddedToGoodReads(wasAdded);
            setGoodReadsCount((prev) => (wasAdded ? prev + 1 : prev - 1));
            toast.error("Action failed");
        }
    };

    /* ---------------- BODY SCROLL LOCK ---------------- */
    useEffect(() => {
        if (!questionPopup) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev || "auto";
        };
    }, [questionPopup]);

    const handleAnswerSubmit = async () => {
        if (!answer.trim()) {
            toast.error("Answer cannot be empty");
            return;
        }

        const result = await answerQuestionShortStory({ storyId, answer });
        if (result.success) {
            toast.success(result.message);
            setAlreadyAnswered(true);
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
            <div className="relative w-full h-[260px] sm:h-[350px]">
                {story?.coverImage ? (
                    <LazyLoadImage
                        src={story.coverImage}
                        alt={story.title}
                        effect="blur"
                        wrapperClassName="w-full h-full"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-sky-100 text-sky-900">
                        <h3 className="text-lg font-semibold">{story.title}</h3>
                    </div>
                )}

                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-[#1f3d34] text-white px-6 py-2 rounded-full shadow-lg border-4 border-white">
                    {story.category}
                </span>
            </div>

            {/* CONTENT */}
            <div className="max-w-4xl mx-auto px-4 sm:px-10 pt-16">
                <h1 className="text-3xl font-serif text-center">{story.title}</h1>

                <div className="flex justify-center gap-2 mt-2">
                    <img
                        src={story.author?.profilePic}
                        alt={story.author?.username}
                        loading="lazy"
                        className="w-6 h-6 rounded-full object-cover"
                    />
                    <p className="text-sm text-gray-500">{story.author?.username}</p>
                </div>

                <div
                    className="prose prose-gray max-w-full mt-8"
                    dangerouslySetInnerHTML={{ __html: story.story }}
                />
            </div>
        </div>
    );
};

export default ViewShortStory;
