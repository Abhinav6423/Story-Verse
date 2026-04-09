import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react'; // Ensure you have this icon imported

const LastReadBanner = ({ lastReadData }) => {
    return (
        <div className="w-full flex justify-center px-3 sm:px-6">
            {/* Controlled width for desktop */}
            <div className="w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl">

                <div className="
                group relative
                bg-[#121212] sm:bg-[#181818]
                hover:bg-[#282828]
                border-b border-white/5
                sm:border sm:border-white/5
                sm:rounded-xl
                px-3 py-2.5 sm:px-4 sm:py-3
                flex items-center justify-between
                transition-all duration-200
                cursor-pointer
            ">

                    {/* LEFT */}
                    <div className="flex items-center gap-3 sm:gap-4 w-full overflow-hidden">

                        {/* Image */}
                        <div className="relative shrink-0">
                            <img
                                src={lastReadData.coverImage}
                                alt={lastReadData.title}
                                className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 object-cover rounded-md"
                            />
                        </div>

                        {/* TEXT */}
                        <div className="flex flex-col justify-center overflow-hidden pr-2">

                            <h3 className="text-white text-sm sm:text-base lg:text-lg font-semibold truncate">
                                {lastReadData.title}
                            </h3>

                            <p className="text-[#a7a7a7] text-xs sm:text-sm font-medium truncate flex items-center gap-1.5 mt-0.5">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                </span>
                                {lastReadData.category} • You Last Visited
                            </p>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center shrink-0 pl-3 sm:pl-6">
                        <Link to={`/story/${lastReadData._id}`}>
                            <button
                                aria-label="Resume Story"
                                className="
                                flex items-center justify-center
                                w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12
                                rounded-full
                                bg-white/5 hover:bg-white/10
                                text-white hover:text-emerald-400
                                transition-all duration-200
                                hover:scale-110
                            "
                            >
                                <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-[2px]" />
                            </button>
                        </Link>
                    </div>

                    {/* SUBTLE HOVER GLOW (DESKTOP ONLY FEEL) */}
                    <div className="hidden sm:block absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none" />
                </div>
            </div>
        </div>
    );
};

export default LastReadBanner;