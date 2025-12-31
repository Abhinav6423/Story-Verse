import { Pencil, Trash2 } from "lucide-react";
import { deleteShortStory } from "../../Api-calls/deleteShortStory.js";
import { toast } from "react-toastify";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
const MyStoryCard = ({ title, image, id }) => {
    const [deleting, setDeleting] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const storyId = id;
    const handleDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const confirmed = window.confirm(
            "Are you sure you want to delete this story?"
        );
        if (!confirmed) return;

        try {
            setDeleting(true);
            const result = await deleteShortStory({ storyId: id });

            if (result?.success) {
                toast.success(result.message || "Story deleted");

                // 🔥 THIS IS THE MAGIC
                queryClient.invalidateQueries({
                    queryKey: ["userCreatedShortStories"]
                });
            }
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Failed to delete story"
            );
        } finally {
            setDeleting(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const confirmed = window.confirm(
            "Are you sure you want to update this story?"
        );
        if (!confirmed) return;

        navigate(`/update/shortStory/${storyId}`);
    }

    return (
        <div className="w-full">

            {/* BOOK COVER */}
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-gray-100 transition hover:shadow-lg">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                />

                {/* ACTION BUTTONS */}
                <div className="absolute top-2 right-2 flex gap-2">
                    <button
                        onClick={handleUpdate}
                        className="p-1.5 rounded-full bg-white/90 shadow text-gray-700 hover:text-blue-600"
                        title="Edit"
                    >
                        <Pencil size={14} />
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className={`p-1.5 rounded-full bg-white/90 shadow transition
                            ${deleting ? "opacity-50 cursor-not-allowed" : "hover:text-red-600"}
                        `}
                        title="Delete"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            <h3 className="mt-2 text-sm font-medium text-gray-900 leading-snug">
                {title}
            </h3>
        </div>
    );
};

export default MyStoryCard;
