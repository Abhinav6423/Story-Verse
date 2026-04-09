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

            {/* Header Section - Desktop */}
            <div className="hidden md:block max-w-7xl mx-auto mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
                    Discover Stories
                </h1>
                <p className="text-zinc-400 text-sm md:text-base">
                    Immersive teasers for your next psychological thriller.
                </p>
            </div>

            

            {/* Responsive Layout */}
            <div
                className="
                    max-w-7xl mx-auto
                    flex flex-col md:grid
                    md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
                    md:gap-6
                    h-[100dvh] md:h-auto /* 100dvh prevents mobile browser URL bar jumping */
                    w-full
                    overflow-y-scroll md:overflow-visible
                    snap-y snap-mandatory
                    /* Hide scrollbar completely */
                    [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
                "
            >
                {storeels.map((reel) => (
                    // Moved snap properties to the Link wrapper to ensure the entire block snaps
                    <Link
                        to={`/storeel/${reel._id}`}
                        key={reel._id}
                        className="block w-full h-[100dvh] md:h-auto snap-start snap-always md:snap-align-none"
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
                                bg-zinc-900
                                border-0 md:border border-zinc-800
                                transition-transform duration-300
                                md:hover:scale-[1.02]
                                md:hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]
                            "
                        >
                            {/* Image */}
                            <img
                                src={reel.reelCover}
                                alt={reel.title}
                                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                                onError={(e) => (e.target.src = "/fallback.png")}
                            />

                            {/* Top Gradient */}
                            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />

                            {/* Bottom Gradient */}
                            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

                            {/* Title */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 flex flex-col justify-end pointer-events-none pb-8 md:pb-4">
                                <h3 className="text-white font-bold text-lg md:text-sm leading-tight drop-shadow-md">
                                    {reel.title}
                                </h3>
                            </div>

                            {/* Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                <div className="w-16 h-16 md:w-12 md:h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30 transition-transform duration-300 group-hover:scale-110">
                                    <PlayIcon size={28} className="text-white md:w-6 md:h-6" />
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