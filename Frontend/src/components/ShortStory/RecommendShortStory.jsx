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
        <section className="relative w-full pb-24 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden bg-transparent">

            <style>
                {`
            @keyframes smoothFadeUp {
                0% {
                    opacity: 0;
                    transform: translateY(30px) scale(0.95);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            .animate-premium-fade {
                animation: smoothFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                opacity: 0; 
            }
        `}
            </style>

            <div className="max-w-[1200px] mx-auto relative z-10">

                {/* UPDATED HEADER: More subtle, algorithmic, and cinematic */}
                <div className="flex items-end justify-between mb-8 pb-4 border-b border-emerald-900/20">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-xl md:text-2xl font-serif tracking-wide text-gray-200">
                            Continue the Thread
                        </h2>
                        <p className="text-xs text-gray-500 uppercase tracking-[0.2em]">Based on your atmospheric profile</p>
                    </div>
                    <Sparkles size={24} className="text-emerald-400" /> 
                </div>

                {/* THE GRID: High density, Netflix "More Like This" style */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
                    {relatedStories.map((story, index) => (
                        <div
                            key={story._id}
                            onClick={() => navigate(`/story/${story._id}`)}
                            style={{ animationDelay: `${index * 120}ms` }}
                            className="animate-premium-fade cursor-pointer group relative flex flex-col bg-[#0a0a0a] rounded-lg overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_-10px_rgba(16,185,129,0.15)] hover:-translate-y-1.5 hover:ring-1 hover:ring-emerald-500/30"
                        >
                            {/* IMAGE CONTAINER */}
                            <div className="relative aspect-[2/3] w-full overflow-hidden shrink-0 bg-[#050505]">
                                <img
                                    src={story.coverImage || "/placeholder-cover.jpg"}
                                    alt={story.title}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                />

                                {/* Permanent top vignette for badges */}
                                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/80 via-black/30 to-transparent" />

                                {/* Dynamic bottom vignette that rises on hover (The "Trailer" Reveal) */}
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#020403] via-[#020403]/80 to-transparent transition-all duration-500 group-hover:h-[80%]" />

                                {/* TOP BADGES: The Netflix Match Algorithm */}
                                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                                    {/* Pseudo-random or prop-based match score for psychological buy-in */}
                                    <span className="text-emerald-400 font-bold text-[10px] sm:text-[11px] tracking-wide drop-shadow-md">
                                        {90 + (index % 10)}% Match
                                    </span>
                                </div>

                                {/* Top Right Bookmark Icon */}
                                <div className="absolute top-3 right-3 text-white/40 group-hover:text-white transition-colors duration-300">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                </div>

                                {/* HOVER REVEAL CONTENT (Slides up over the image) */}
                                <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col justify-end translate-y-4 opacity-80 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">

                                    <h3 className="text-sm sm:text-base font-bold text-zinc-100 leading-tight mb-1.5 drop-shadow-lg line-clamp-2">
                                        {story.title || "Story Title"}
                                    </h3>

                                    {/* Hidden metadata that only shows on hover */}
                                    <div className="flex items-center gap-2 text-[10px] text-gray-300 font-medium mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        <span className="border border-gray-500/50 px-1.5 py-0.5 rounded-sm">18 Min</span>
                                        <span>{story.category || "Psychological"}</span>
                                    </div>

                                    {/* Compact Author & Likes Row */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full overflow-hidden border border-white/20">
                                                <img
                                                    src={story.author?.profilePic || "/default-avatar.png"}
                                                    alt={story.author?.username || "Author"}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <span className="text-[11px] font-medium text-zinc-400 truncate max-w-[80px]">
                                                {story.author?.username || "Unknown"}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1 text-emerald-400">
                                            <Heart size={12} className="fill-emerald-400/20" />
                                            <span className="text-[10px] font-bold tracking-wide">
                                                {story.likes || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}