import React from 'react'
import StoreelCard from './StoreelCard';
import { useQuery } from "@tanstack/react-query";
import { listAllStoreels } from '../../Api-calls/listAllStoreels.js';
import { AlertCircle } from 'lucide-react';

const StoreelGrid = () => {
    
   

    const { isLoading, data, error } = useQuery({
        queryKey: ["storeels"],
        queryFn: listAllStoreels,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutes

    })

    const storeels = data?.data?.reels || [];

    console.log("reel are ", storeels);

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
        <div className="w-full mb-12 group/section">

            {/* Header */}
            <div className="flex items-center justify-between mb-5 px-1 font-mono">
                <div className="flex items-center gap-3 md:gap-4">

                    {/* Badge */}
                    <div className="relative flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-emerald-500/20 to-[#050505]  shadow-[0_0_15px_rgba(52,211,153,0.15)] backdrop-blur-md shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 ml-0.5 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                        <div className="absolute inset-0 bg-emerald-400/10 blur-md rounded-xl -z-10" />
                    </div>

                    {/* Title Stack */}
                    <div className="flex flex-col justify-center">
                        <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-500/80 mb-0.5">
                            Quick Bytes
                        </span>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white leading-none">
                            Story <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Reels</span>
                        </h2>
                    </div>
                </div>

                {/* See All — fades in on section hover like Netflix */}
                <button className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-emerald-400/70 hover:text-emerald-400 transition-all duration-300 opacity-0 group-hover/section:opacity-100 translate-x-2 group-hover/section:translate-x-0">
                    See All
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Carousel Wrapper — fade edges like Netflix */}
            <div className="relative">

                

                {/* Scrollable Row */}
                <div className="flex gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory pb-4 pl-1 pr-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                    {storeels.length === 0 ? (
                        // Empty state
                        <div className="flex items-center justify-center w-full py-16 text-gray-600 text-sm">
                            No reels yet. Be the first to create one!
                        </div>
                    ) : (
                        storeels.map((reel) => (
                            <StoreelCard key={reel._id} reel={reel} />
                        ))
                    )}
                </div>
            </div>

            {/* Bottom subtle divider */}
            <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
    );
};

export default StoreelGrid;

