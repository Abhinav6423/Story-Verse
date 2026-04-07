import React, { useState, memo } from "react";
import { Pencil, Trash2, Calendar, Folder, Film } from "lucide-react";
import { deleteShortStory } from "../../Api-calls/deleteShortStory.js";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const MyStoryCard = ({ title, image, id, status, category, time }) => {
    const [deleting, setDeleting] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const handleDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!window.confirm("Are you sure you want to delete this story?")) return;

        try {
            setDeleting(true);
            const result = await deleteShortStory({ storyId: id });

            if (result?.success) {
                toast.success(result.message || "Story deleted");
                // Immediately update the cache to remove the item without refetching everything
                queryClient.setQueryData(["userCreatedShortStories", status], (oldData) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        data: oldData.data.filter(story => story._id !== id)
                    };
                });
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to delete story");
        } finally {
            setDeleting(false);
        }
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/update/shortStory/${id}`);
    };

    // Format Date
    const formattedDate = new Date(time).toLocaleDateString("en-US", {
        month: "short", day: "numeric"
    });

    // 1. Don't forget to define this at the top of your component!
    // const navigate = useNavigate();

    return (
        <div className="w-full p-2 rounded-xl bg-[#212121] border border-white/5 hover:border-white/10 transition-colors group">

            {/* WRAPPER LINK (Clicking card goes to story view) */}
            <Link to={`/story/${id}`} className="block w-full">

                {/* BOOK COVER */}
                <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-gray-800 shadow-md">
                    {image ? (
                        <LazyLoadImage
                            src={image}
                            alt={title}
                            effect="blur"
                            wrapperClassName="w-full h-full !block"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-800 px-4 text-center">
                            <h3 className="text-sm font-semibold text-zinc-400 line-clamp-3">
                                {title}
                            </h3>
                        </div>
                    )}

                    {/* ACTION BUTTONS (Visible on Hover or Mobile) */}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">

                        {/* NEW: CREATE REEL BUTTON */}
                        <button
                            onClick={(e) => {
                                e.preventDefault(); // Stops the outer <Link> from triggering
                                navigate(`/storeel/create/${id}`); // Routes to your create page
                            }}
                            className="p-2 rounded-full bg-black/60 hover:bg-emerald-500 text-white backdrop-blur-sm transition-colors border border-transparent hover:border-emerald-400"
                            title="Create Story Trailer"
                        >
                            <Film size={14} />
                        </button>

                        <button
                            onClick={(e) => {
                                e.preventDefault(); // Make sure your handleUpdate also has this!
                                handleUpdate(e);
                            }}
                            className="p-2 rounded-full bg-black/60 hover:bg-blue-600 text-white backdrop-blur-sm transition-colors"
                            title="Edit Story"
                        >
                            <Pencil size={14} />
                        </button>

                        <button
                            onClick={(e) => {
                                e.preventDefault(); // Make sure your handleDelete also has this!
                                handleDelete(e);
                            }}
                            disabled={deleting}
                            className={`
                            p-2 rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors
                            ${deleting ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"}
                        `}
                            title="Delete Story"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>

                    {/* STATUS BADGE */}
                    <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                        {status}
                    </div>
                </div>

                {/* INFO SECTION */}
                <div className="mt-3 space-y-1">
                    <h3 className="text-sm font-semibold text-white leading-tight line-clamp-1" title={title}>
                        {title}
                    </h3>

                    <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                            <Folder size={12} />
                            <span className="truncate max-w-[80px]">{category || "Uncategorized"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            <span>{formattedDate}</span>
                        </div>
                    </div>
                </div>

            </Link>
        </div>
    );
};

export default memo(MyStoryCard);