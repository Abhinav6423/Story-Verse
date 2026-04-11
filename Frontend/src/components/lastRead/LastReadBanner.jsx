import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react'; // Ensure you have this icon imported

const LastReadBanner = ({ lastReadData }) => {
    return (
        <div className="w-full flex justify-center px-4 sm:px-6 relative z-30">
            {/* Controlled width for desktop - slightly tighter for a premium "widget" feel */}
            <div className="w-full max-w-2xl lg:max-w-4xl">

                <div className="
                    group relative
                    bg-black/40 backdrop-blur-xl
                    border border-white/10
                    rounded-2xl
                    p-3 sm:p-4
                    flex items-center justify-between
                    transition-all duration-300
                    cursor-pointer
                    shadow-[0_10px_40px_rgba(0,0,0,0.6)]
                    overflow-hidden
                ">
                    {/* SUBTLE HOVER GLOW (Now covers the whole background smoothly) */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* LEFT SIDE */}
                    <div className="relative z-10 flex items-center gap-4 w-full overflow-hidden">

                        {/* Image */}
                        <div className="relative shrink-0">
                            <img
                                src={lastReadData.coverImage}
                                alt={lastReadData.title}
                                className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-cover rounded-xl shadow-md border border-white/5"
                            />
                        </div>

                        {/* TEXT */}
                        <div className="flex flex-col justify-center overflow-hidden pr-2">
                            <h3 className="text-white text-base sm:text-lg font-bold truncate tracking-wide drop-shadow-sm">
                                {lastReadData.title}
                            </h3>

                            <p className="text-gray-400 text-xs sm:text-sm font-medium truncate flex items-center gap-2 mt-1">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                                </span>
                                {lastReadData.category} <span className="text-gray-600">•</span> You Last Visited
                            </p>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="relative z-10 flex items-center shrink-0 pl-4 sm:pl-6">
                        <Link to={`/story/${lastReadData._id}`} onClick={(e) => e.stopPropagation()}>
                            <button
                                aria-label="Resume Story"
                                className="
                                    flex items-center justify-center
                                    w-10 h-10 sm:w-12 sm:h-12
                                    rounded-full
                                    bg-white text-black
                                    hover:bg-emerald-500 hover:text-white
                                    transition-all duration-300
                                    hover:scale-105 active:scale-95
                                    shadow-[0_0_15px_rgba(255,255,255,0.15)]
                                "
                            >
                                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-[2px]" />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LastReadBanner;