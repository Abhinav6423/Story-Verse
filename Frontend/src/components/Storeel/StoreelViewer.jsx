import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { openStoreel } from '../../Api-calls/OpenStoreel.js';

const StoreelViewer = () => {
    const navigate = useNavigate();
    const { storeelId } = useParams();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    const { data, isLoading, error } = useQuery({
        queryKey: ["openStoreel", storeelId],
        queryFn: () => openStoreel(storeelId)
    });


    // console.log("Open Storeel API response:", storeelData);
    // console.log("Open Storeel API response:", data?.reel?.reelCover);

    // ✅ Use real slides from API
    const slides = data?.reel?.slidesText || [];
    const coverImage = data?.reel?.reelCover || "";
    const storyId = data?.reel?.reelStory;

    useEffect(() => {
        if (slides.length === 0) return; // ✅ Don't run if no slides yet

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    handleNext();
                    return 0;
                }
                return prev + 1;
            });
        }, 50);

        return () => clearInterval(interval);
    }, [currentIndex, slides.length]);

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setProgress(0);
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setProgress(0);
        }
    };

    const handleReadStory = () => {
        if (storyId) navigate(`/story/${storyId}`); // ✅ Navigate to actual story
    };

    // ✅ Loading state
    if (isLoading) return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-white/50 text-sm">Loading reel...</span>
            </div>
        </div>
    );

    // ✅ Error state
    if (error || !data) return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]">
            <div className="flex flex-col items-center gap-4 text-center px-6">
                <span className="text-red-400 text-lg font-semibold">Failed to load reel</span>
                <button onClick={() => navigate(-1)} className="text-white/50 text-sm underline">Go back</button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]">

            {/* BACKGROUND */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img
                    src={coverImage} // ✅ Real cover image
                    alt="Background"
                    className="w-full h-full object-cover blur-3xl opacity-40 scale-125"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/95" />
            </div>

            {/* TOP UI */}
            <div className="absolute top-0 left-0 w-full pt-8 md:pt-12 pb-4 px-4 z-20 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <div className="flex gap-1.5 mb-6 max-w-md mx-auto">
                    {slides.map((_, i) => (
                        <div key={i} className="h-[2px] flex-1 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-400 transition-all duration-75 ease-linear shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                                style={{
                                    width: i < currentIndex ? '100%' : i === currentIndex ? `${progress}%` : '0%'
                                }}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-between items-center max-w-md mx-auto pointer-events-auto">
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white/50">
                        {data?.title || "Story Hook"} {/* ✅ Real title */}
                    </span>
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md rounded-full transition-all duration-300 group"
                    >
                        <X size={18} className="text-white/70 group-hover:text-white transition-colors" />
                    </button>
                </div>
            </div>

            {/* CENTER CONTENT */}
            <div className="relative z-10 px-8 text-center w-full max-w-lg pointer-events-none">
                <h2
                    key={currentIndex}
                    className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 leading-[1.3] drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-bottom-4 duration-700"
                >
                    {slides[currentIndex]} {/* ✅ Real slide text */}
                </h2>
            </div>

            {/* NAVIGATION ZONES */}
            <div className="absolute inset-0 flex mt-32 mb-32 z-30">
                <div className="w-[30%] h-full cursor-pointer" onClick={handleBack} />
                <div className="w-[70%] h-full cursor-pointer" onClick={handleNext} />
            </div>

            {/* BOTTOM CTA */}
            <div className="absolute bottom-8 md:bottom-12 left-0 w-full flex justify-center z-40 px-6">
                <button
                    onClick={handleReadStory}
                    className="group relative w-full max-w-[280px] py-4 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 overflow-hidden rounded-2xl transition-all duration-300 active:scale-95 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="relative flex items-center justify-center gap-2 text-sm font-semibold tracking-wide text-white">
                        Read Full Story
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-400 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </span>
                </button>
            </div>
        </div>
    );
};


export default StoreelViewer;