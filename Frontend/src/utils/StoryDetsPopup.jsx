import React from 'react';
import { createPortal } from 'react-dom'; // 1. Import createPortal
import { Link } from 'react-router-dom';
import { X, ArrowRight } from 'lucide-react';

const StoryDetsPopup = ({ quickViewStory, setQuickViewStory }) => {
    // Safety check: if no story is selected, don't render anything
    if (!quickViewStory) return null;

    // 2. Wrap your entire modal in createPortal
    return createPortal(
        <div
            // Z-index will now work flawlessly because it's attached directly to the body
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md transition-all duration-300"
            onClick={() => setQuickViewStory(null)}
        >
            <div
                className="relative w-full max-w-4xl bg-gradient-to-br from-[#16181d] to-[#0a0c10] border border-white/10 rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-300 max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={() => setQuickViewStory(null)}
                    className="absolute sm:hidden top-4 right-4 z-50 p-2.5 bg-black/40 hover:bg-white/20 backdrop-blur-xl rounded-full text-gray-300 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-90"
                >
                    <X size={18} strokeWidth={2.5} />
                </button>

                {/* Modal Image Section */}
                <div className="w-full md:w-[45%] shrink-0 h-56 md:h-auto relative bg-[#0a0c10]">
                    <img
                        src={quickViewStory?.coverImage || '/placeholder.jpg'}
                        alt={quickViewStory?.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0a0c10] via-black/40 to-transparent md:via-transparent opacity-100" />
                </div>

                {/* Modal Content Section */}
                <div className="w-full md:w-[55%] flex flex-col overflow-hidden relative">

                    {/* SCROLLABLE INNER CONTENT */}
                    <div className="flex-1 overflow-y-auto p-6 sm:p-8 md:p-10 pb-2 md:pb-4 custom-scrollbar">

                        {/* Badges/Tags */}
                        {quickViewStory?.isGoodRead && (
                            <div className="mb-4">
                                <span className="inline-flex items-center px-3 py-1 text-[10px] sm:text-xs uppercase tracking-widest font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.15)]">
                                    Good Read
                                </span>
                            </div>
                        )}

                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 leading-tight mb-3">
                            {quickViewStory?.title}
                        </h2>

                        {/* Author Info */}
                        <p className="text-sm sm:text-base text-gray-500 mb-6 font-medium">
                            By <span className="text-gray-200">{quickViewStory?.author?.username || 'Unknown'}</span>
                        </p>

                        {/* Description */}
                        <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
                            {quickViewStory?.description || 'No description available for this story. Dive in to find out more about this exciting read!'}
                        </p>
                    </div>

                    {/* PINNED BOTTOM BUTTON */}
                    <div className="p-6 sm:p-8 md:p-10 pt-4 md:pt-4 bg-gradient-to-t from-[#0a0c10] via-[#0a0c10]/95 to-transparent border-t border-white/5 relative z-10 shrink-0">
                        <Link
                            to={`/story/${quickViewStory?._id}`}
                            className="group flex items-center justify-center w-full gap-3 py-3.5 sm:py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-sm sm:text-base font-bold rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transform hover:-translate-y-0.5"
                        >
                            <span className="tracking-wide">Read Full Story</span>
                            <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                        </Link>
                    </div>

                </div>
            </div>
        </div>,
        document.body // 3. The magic ingredient: Teleport this directly into the HTML body
    );
};

export default StoryDetsPopup;