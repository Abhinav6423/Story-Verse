import React, { useState } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { likeShortStory } from "../../Api-calls/likeShortStory.js";

const ShortStoryCard = ({ story }) => {
    const [isLiked, setIsLiked] = useState(story?.isLiked || false);
    const [likes, setLikes] = useState(story?.likes || 0);
    const [loading, setLoading] = useState(false);

    const likeStory = async (e) => {
        e.stopPropagation();
        if (loading || isLiked) return;

        try {
            setLoading(true);
            const result = await likeShortStory({ storyId: story._id });

            if (result?.success) {
                setIsLiked(true);
                setLikes((prev) => prev + 1);
            }
        } catch (error) {
            console.error("Error liking story:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Link
            to={`/story/${story?._id}`}
            className="group block w-full"
        >
            <div className="w-full">

                {/* THUMBNAIL */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black">

                    <img
                        src={story?.coverImage}
                        alt={story?.title}
                        className="
            w-full h-full object-cover
            transition-transform duration-500
            group-hover:scale-105
          "
                    />

                    {/* HOVER OVERLAY */}
                    <div
                        className="
            absolute inset-0
            bg-black/30
            opacity-0 group-hover:opacity-100
            transition
          "
                    />

                    
                </div>

                {/* TEXT CONTENT (BELOW IMAGE) */}
                <div className="mt-3 space-y-1.5">

                    {/* TITLE */}
                    <h3
                        className="
            text-[15px] font-semibold leading-snug
            text-white
            line-clamp-2
            group-hover:text-red-500
            transition
          "
                    >
                        {story?.title}
                    </h3>

                    {/* META ROW */}
                    <div className="flex items-center justify-between text-xs text-gray-400">

                        {/* AUTHOR */}
                        <div className="flex items-center gap-2">
                            <img
                                src={story?.author?.profilePic}
                                alt="author"
                                className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="font-medium">
                                {story?.author?.username}
                            </span>
                        </div>

                        {/* LIKES */}
                        <div className="flex items-center gap-1 border border-gray-400 px-2 py-1 rounded-full">
                           
                            <span className="font-medium">{likes}</span>
                            <span className="font-medium ">Likes</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )




};

export default ShortStoryCard;
