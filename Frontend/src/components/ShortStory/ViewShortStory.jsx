import React, { useState, useEffect } from "react";
import { OpenFeedShortStory } from "../../Api-calls/OpenFeedShortStory.js";
import { likeShortStory } from "../../Api-calls/likeShortStory.js";
import { useParams } from "react-router-dom";
import Loader from "../Loader.jsx";
import { ThumbsUp } from "lucide-react";

const ViewShortStory = () => {
    const { storyId } = useParams();

    const [story, setStory] = useState({});
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false); // ✅ loading state for like

    /* ================= FETCH STORY ================= */
    const fetchStory = async () => {
        try {
            const result = await OpenFeedShortStory({ storyId });

            if (result?.success) {
                setStory(result?.data?.ShortStory);
                setLiked(result?.data?.ShortStory?.isLiked || false); // ✅ initial like state
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

    /* ================= LIKE HANDLER ================= */
    const handleLike = async () => {
        if (liked || likeLoading) return;

        try {
            setLikeLoading(true); // ✅ start loading

            const result = await likeShortStory({ storyId });

            if (result?.success) {
                setLiked(true); // ✅ mark liked
            }
        } catch (error) {
            console.error("Error liking story:", error);
        } finally {
            setLikeLoading(false); // ✅ stop loading
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-[#141414] text-gray-200">
            <div className="max-w-screen mx-auto bg-[#181818] shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden">

                {/* COVER */}
                <div className="w-full h-72 sm:h-96 overflow-hidden">
                    <img
                        src={story.coverImage}
                        alt="Story Cover"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* HEADER */}
                <div className="px-6 sm:px-10 pt-10 text-center">
                    <p className="text-lg tracking-wide uppercase font-semibold text-red-500 mb-3">
                        {story?.category}
                    </p>

                    <h1 className="text-[38px] sm:text-[44px] font-serif font-bold text-white leading-tight">
                        {story.title}
                    </h1>

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
                            disabled={liked || likeLoading}
                            className={`
                                flex items-center gap-2
                                px-6 py-2.5 rounded-full
                                font-semibold transition-all duration-300 border
                                ${liked
                                    ? "bg-red-600 text-white border-red-600 cursor-not-allowed"
                                    : "bg-transparent text-white border-white/30 hover:bg-red-600 hover:border-red-600"
                                }
                                ${likeLoading ? "opacity-70 cursor-wait" : ""}
                            `}
                        >
                            <ThumbsUp
                                size={20}
                                className={
                                    liked
                                        ? "text-white"
                                        : likeLoading
                                            ? "text-gray-300 animate-pulse"
                                            : "text-red-600"
                                }
                            />
                            <span>
                                {likeLoading ? "Liking..." : liked ? "Liked" : "Like"}
                            </span>
                        </button>
                    </div>

                    <div className="mx-auto mt-8 mb-10 h-px w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    {story?.description && (
                        <p className="text-[18px] text-gray-400 italic max-w-xl mx-auto leading-relaxed">
                            {story.description}
                        </p>
                    )}
                </div>

                {/* STORY BODY */}
                <div
                    className="px-6 sm:px-10 md:px-16 py-12 font-serif text-[18px] sm:text-[20px] leading-relaxed text-gray-300"
                    style={{ maxWidth: "80vw", margin: "0 auto" }}
                >
                    <div dangerouslySetInnerHTML={{ __html: story?.story }} />
                </div>
            </div>
        </div>
    );
};

export default ViewShortStory;
