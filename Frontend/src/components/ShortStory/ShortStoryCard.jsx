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
        <div className="
  bg-white rounded-2xl
  border border-gray-100
  shadow-sm hover:shadow-lg transition
  overflow-hidden
  group
  w-full
">

            {/* IMAGE */}
            <div className="relative h-40 w-full overflow-hidden">
                <img
                    src={story?.coverImage}
                    alt="story cover"
                    className="w-full h-full object-cover
        group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* CONTENT */}
            <div className="p-3 space-y-2">

                {/* TITLE */}
                <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                    {story?.title}
                </h3>

                {/* AUTHOR */}
                <div className="flex items-center gap-2">
                    <img
                        src={story?.author?.profilePic}
                        className="w-6 h-6 rounded-full object-cover"
                        alt="author"
                    />
                    <span className="text-xs text-gray-600 font-medium">
                        {story?.author?.username}
                    </span>
                </div>

                {/* ACTION ROW */}
                <div className="flex items-center justify-between pt-2">

                    {/* LIKE */}
                    <button
                        onClick={likeStory}
                        disabled={loading}
                        className="flex items-center gap-1 text-xs text-gray-500
          hover:text-gray-800 transition disabled:opacity-50"
                    >
                        <Heart
                            size={16}
                            className={isLiked ? "fill-gray-900 text-gray-900" : ""}
                        />
                        <span>{likes}</span>
                    </button>

                    {/* READ */}
                    <Link to={`/story/${story._id}`}>
                        <button
                            className="text-xs font-medium text-gray-700
          hover:text-gray-900 transition"
                        >
                            Read →
                        </button>
                    </Link>
                </div>
            </div>
        </div>

    );
};

export default ShortStoryCard;
