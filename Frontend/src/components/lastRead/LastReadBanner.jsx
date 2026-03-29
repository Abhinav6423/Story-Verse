import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react'; // Ensure you have this icon imported

const LastReadBanner = ({ lastReadData }) => {
    return (
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-6">
            {/* Spotify-style compact strip:
                - Reduced padding (p-2 sm:p-3)
                - Dark, solid/slightly-transparent background to match the reference
                - Removed heavy shadows and borders for a flush, native feel
            */}
            <div className="group relative bg-[#121212] sm:bg-[#181818] hover:bg-[#282828] border-b border-white/5 sm:border sm:border-transparent sm:rounded-xl p-2 sm:p-3 flex items-center justify-between transition-colors duration-200 cursor-pointer">

                {/* Left Section: Image and Text */}
                <div className="flex items-center gap-3 w-full overflow-hidden z-10">

                    {/* Image - Small, square, and compact like album art */}
                    <div className="relative shrink-0">
                        <img
                            src={lastReadData.coverImage}
                            alt={lastReadData.title}
                            className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md shadow-sm"
                        />
                    </div>

                    {/* Details - Stacked vertically, truncated text */}
                    <div className="flex flex-col justify-center overflow-hidden pr-2">
                        {/* Title - Bold, white, single line truncation */}
                        <h3 className="text-white text-sm sm:text-base font-semibold truncate">
                            {lastReadData.title}
                        </h3>

                        {/* Subtitle/Category - Gray, smaller, single line truncation */}
                        <p className="text-[#a7a7a7] text-xs sm:text-sm font-medium truncate flex items-center gap-1.5 mt-0.5">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                            </span>
                            {lastReadData.category} • You Last Visited
                        </p>
                    </div>
                </div>

                {/* Right Section: Play Action */}
                <div className="flex items-center gap-4 z-10 shrink-0 pr-2 sm:pr-4">
                    <Link to={`/story/${lastReadData._id}`} className="block">
                        <button
                            aria-label="Resume Story"
                            className="flex items-center justify-center text-white hover:scale-110 hover:text-emerald-400 transition-all duration-200"
                        >
                            {/* Simple solid play icon, mimicking the right side of the Spotify bar */}
                            <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
                        </button>
                    </Link>
                </div>

                {/* Optional: Very subtle bottom border progress bar effect (Uncomment if you want a visual progress line) */}
                {/* <div className="absolute bottom-0 left-0 h-[2px] bg-emerald-500 w-[42%] rounded-bl-xl z-20"></div> */}
            </div>
        </div>
    );
};

export default LastReadBanner;