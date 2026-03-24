import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';

const LastReadBanner = ({ lastReadData }) => {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="group relative bg-gradient-to-br from-[#121415]/95 to-[#0d0f10]/95 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between shadow-2xl shadow-black/40 overflow-hidden transition-all duration-500 hover:border-white/10 hover:bg-[#16191a]/95">

                {/* Ambient Glow */}
                <div className="absolute -left-20 top-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl transition-transform duration-700 group-hover:translate-x-10 pointer-events-none"></div>

                {/* Top Highlight Glow (Premium touch) */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none 
        bg-gradient-to-b from-white/5 via-transparent to-transparent 
        opacity-0 group-hover:opacity-100 transition duration-500" />

                {/* Left Section */}
                <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto z-10">

                    {/* Image */}
                    <div className="relative shrink-0 [perspective:1000px]">
                        <img
                            src={lastReadData.coverImage}
                            alt={lastReadData.title}
                            className="w-16 h-24 sm:w-20 sm:h-28 object-cover rounded-xl 
            shadow-[0_8px_16px_rgba(0,0,0,0.6)] ring-1 ring-white/10 
            transition-transform duration-500 
            group-hover:scale-[1.05] group-hover:rotate-1"
                        />
                        <div className="absolute inset-0 bg-emerald-500/20 blur-2xl -z-10 rounded-full opacity-50 transition-opacity duration-500 group-hover:opacity-80"></div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-col justify-center">

                        {/* Label */}
                        <span className="flex items-center gap-2 text-emerald-400/90 text-[10px] sm:text-xs font-bold tracking-[0.15em] uppercase mb-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            You Last Visited
                        </span>

                        {/* Title */}
                        <h3 className="text-gray-50 text-xl sm:text-2xl font-semibold leading-tight tracking-tight mb-2 sm:mb-2.5">
                            {lastReadData.title?.length > 250
                                ? lastReadData.title.slice(0, 250) + "..."
                                : lastReadData.title}
                        </h3>

                        {/* Category Tag */}
                        <p
                            className="inline-block px-3 py-1 rounded-lg w-fit 
            bg-gradient-to-r from-purple-500/20 to-pink-500/20 
            text-purple-300 text-xs sm:text-sm font-semibold tracking-wide 
            border border-purple-500/30 backdrop-blur-sm 
            transition-all duration-300 group-hover:scale-105"
                        >
                            {lastReadData.category}
                        </p>

                        {/* Optional: Progress (future feature) */}
                        {/* <span className="text-xs text-gray-400 mt-1">
            Continue from 42%
          </span> */}
                    </div>
                </div>

                {/* Right Section */}
                <div className="w-full sm:w-auto mt-4 sm:mt-0 z-10 shrink-0">
                    <Link to={`/story/${lastReadData._id}`} className="block">
                        <button
                            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 
            bg-emerald-500 text-[#022c22] font-bold text-sm sm:text-base 
            rounded-full transition-all duration-300 
            flex items-center justify-center gap-2 sm:gap-3 
            shadow-[0_0_20px_rgba(16,185,129,0.15)] 
            hover:shadow-[0_0_35px_rgba(16,185,129,0.35)] 
            hover:bg-emerald-400 hover:-translate-y-1 active:translate-y-0"
                        >
                            <span className="font-medium tracking-tight">Resume Story</span>
                            <PlayCircle className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LastReadBanner;