import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RecommendShortStory({ relatedStories = [] }) {

    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" },
        },
    };

    return (
        <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden bg-[#050505]">
            {/* Ambient Premium Background Gradients */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

            <style>
                {`
                @keyframes smoothFadeUp {
                    0% {
                        opacity: 0;
                        transform: translateY(20px) scale(0.98);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                .animate-premium-fade {
                    animation: smoothFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    opacity: 0; 
                }
            `}
            </style>

            <div className="max-w-[1400px] mx-auto relative z-10">
                {/* Elegant Header */}
                <div className="flex items-center gap-3 mb-10 pb-5 border-b border-white/[0.08]">
                    <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                        <Sparkles className="text-indigo-400" size={18} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-serif font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500">
                        More from this universe
                    </h2>
                </div>

                {/* UPDATED GRID: 2 columns on mobile, up to 5 on large screens for portrait book layout */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
                    {relatedStories.map((story, index) => (
                        <div
                            key={story._id}
                            onClick={() => navigate(`/story/${story._id}`)}
                            style={{ animationDelay: `${index * 100}ms` }}
                            className="animate-premium-fade cursor-pointer group relative flex flex-col bg-[#121212] border border-white/[0.05] rounded-xl overflow-hidden transition-all duration-300 hover:bg-[#18181b] hover:border-white/[0.1] hover:-translate-y-1 hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.5)] focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            {/* UPDATED IMAGE ASPECT RATIO: 2:3 for standard portrait book cover */}
                            <div className="relative aspect-[2/3] w-full overflow-hidden shrink-0 bg-zinc-900 border-b border-white/[0.02]">
                                <img
                                    src={story.coverImage || "/placeholder-cover.jpg"}
                                    alt={story.title}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />

                                {/* Subtle top gradient to make bookmark pop */}
                                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/50 to-transparent" />
                                {/* Bottom gradient merging into card body */}
                                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#121212] to-transparent" />

                                {/* Top Right Bookmark Icon */}
                                <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1.5 rounded-[4px] shadow-md opacity-90 group-hover:opacity-100 transition-opacity">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                </div>
                            </div>

                            {/* UPDATED CONTENT: Compact, no description, inline title and likes */}
                            <div className="flex flex-col flex-grow p-3 sm:p-4 relative z-10">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <h3 className="text-sm font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors duration-300 line-clamp-1 leading-tight">
                                        {story.title || "Story Title"}
                                    </h3>

                                    {/* Green Likes Badge matching your screenshot */}
                                    <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-[4px] shrink-0">
                                        <Heart size={10} className="fill-emerald-400/20" />
                                        <span className="text-[10px] font-bold tracking-wide">
                                            {story.likes || 0}
                                        </span>
                                    </div>
                                </div>

                                {/* Compact Author Row */}
                                <div className="flex items-center gap-2 mt-auto">
                                    <div className="w-5 h-5 rounded-full overflow-hidden border border-white/10 group-hover:border-emerald-400/50 transition-colors duration-300 shrink-0">
                                        <img
                                            src={story.author?.profilePic || "/default-avatar.png"}
                                            alt={story.author?.username || "Author"}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <span className="text-[11px] font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors truncate">
                                        {story.author?.username || "Unknown"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}