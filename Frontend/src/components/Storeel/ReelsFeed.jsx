import React, { useState } from 'react';
import { listAllStoreels } from '../../Api-calls/listAllStoreels.js';
import { useQuery } from "@tanstack/react-query";
import { Link } from 'react-router-dom';
// === SAFE DUMMY DATA ===
const DUMMY_REELS = [
    {
        id: 'reel_1',
        storyId: 'story_101',
        title: 'The Silent Hallway',
        author: '@preface_horror',
        duration: '0:45',
        videoUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1000&auto=format&fit=crop',
    },
    {
        id: 'reel_2',
        storyId: 'story_102',
        title: 'What the Mirror Saw',
        author: '@dark_tales',
        duration: '1:12',
        videoUrl: 'https://images.unsplash.com/photo-1614031679227-2c1b48b5dc0d?q=80&w=1000&auto=format&fit=crop',
    },
    {
        id: 'reel_3',
        storyId: 'story_103',
        title: 'The Last Stop',
        author: '@midnight_express',
        duration: '2:03',
        videoUrl: 'https://images.unsplash.com/photo-1600705001712-421f1d1f03f3?q=80&w=1000&auto=format&fit=crop',
    },
    {
        id: 'reel_4',
        storyId: 'story_104',
        title: 'Echoes in the Dark',
        author: '@whispers',
        duration: '0:59',
        videoUrl: 'https://images.unsplash.com/photo-1505635552518-3448ff116af3?q=80&w=1000&auto=format&fit=crop',
    },
];

const ReelsFeed = () => {
    const [hoveredReel, setHoveredReel] = useState(null);



    const { isLoading, data, error } = useQuery({
        queryKey: ["storeels"],
        queryFn: listAllStoreels,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutes

    })

    const storeels = data?.data?.reels || [];

    if (isLoading) {
        return (
            <div className="text-center text-white py-10 flex flex-col items-center gap-2">
                <svg className="animate-spin h-8 w-8 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">

                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p>Loading storeels...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center text-red-400 py-10 flex flex-col items-center gap-2">
                <AlertCircle size={24} />
                <p>Unable to load storeels.</p>
            </div>
        );
    }

    return (
        <div className="bg-[#0A0A0C] text-zinc-100 md:px-8 md:pb-12 md:pt-24 min-h-screen relative">

            {/* Header Section - Desktop Only (Mobile usually hides this for full-screen immersion) */}
            <div className="hidden md:block max-w-[1600px] mx-auto mb-8 px-4 sm:px-6">
                <div className="flex flex-col items-start gap-1">
                    <span className="text-xs font-bold tracking-[0.2em] text-emerald-500 uppercase">
                        Quick Bytes
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2 leading-none">
                        Story <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Reels</span>
                    </h1>
                    <p className="text-zinc-400 text-sm md:text-base">
                        Immersive teasers for your next psychological thriller.
                    </p>
                </div>
            </div>

            {/* Responsive Layout */}
            <div
                className="
                    max-w-[1600px] mx-auto
                    flex flex-col md:grid
                    md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6
                    md:gap-6 lg:gap-8
                    h-[100dvh] md:h-auto /* 100dvh prevents mobile browser URL bar jumping */
                    w-full
                    overflow-y-scroll md:overflow-visible
                    snap-y snap-mandatory
                    /* Hide scrollbar completely */
                    [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
                "
            >
                {storeels.map((reel) => (
                    <Link
                        to={`/storeel/${reel._id}`}
                        key={reel._id}
                        className="block w-full h-[100dvh] md:h-auto snap-start snap-always md:snap-align-none outline-none"
                    >
                        <div
                            className="
                                relative
                                w-full
                                h-full
                                md:aspect-[9/16]
                                rounded-none md:rounded-xl
                                overflow-hidden
                                cursor-pointer
                                group
                                bg-black/40 md:backdrop-blur-md
                                border-0 md:border border-white/5
                                transition-all duration-300
                                md:hover:scale-[1.02]
                                md:hover:border-emerald-500/30
                                md:hover:shadow-[0_15px_40px_-10px_rgba(52,211,153,0.3)]
                            "
                        >
                            {/* Image */}
                            <img
                                src={reel.reelCover}
                                alt={reel.title}
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                onError={(e) => (e.target.src = "/fallback.png")}
                            />

                            {/* Top Gradient - For mobile UI (back buttons, etc.) */}
                            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />

                            {/* TALL Bottom Gradient (CRUCIAL FIX) 
                                Masks baked-in image text so your HTML text is readable 
                            */}
                            <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent pointer-events-none" />

                            {/* Title Stack */}
                            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 flex flex-col justify-end pointer-events-none pb-12 md:pb-6 z-20">
                                <h3 className="text-white font-bold text-xl md:text-lg leading-snug drop-shadow-lg line-clamp-3">
                                    {reel.title}
                                </h3>
                                {/* Optional: Add author or view count here if you want */}
                            </div>

                            {/* Center Play Button (Glassmorphism) */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-transparent transition-colors duration-300 z-10">
                                <div className="w-16 h-16 md:w-14 md:h-14 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30 transition-all duration-300 group-hover:bg-emerald-500/80 group-hover:border-emerald-400 group-hover:scale-110 shadow-lg">
                                    <PlayIcon size={28} className="text-white fill-white md:w-6 md:h-6 ml-1 drop-shadow-md" />
                                </div>
                            </div>

                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

// ICON
const PlayIcon = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white" className="ml-1">
        <path d="M8 5v14l11-7z" />
    </svg>
);

export default ReelsFeed;