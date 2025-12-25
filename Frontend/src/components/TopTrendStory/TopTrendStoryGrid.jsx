import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import { listTrendingShortStory } from '../../Api-calls/trendingShortStory.js'
import Loader from '../Loader.jsx'

function TopTrendStoryGrid() {

    /* ================= STATE ================= */
    const [page, setPage] = useState(1)
    const [isAnimating, setIsAnimating] = useState(false)
    const limit = 1

    /* ================= DATA ================= */
    const { data, isLoading } = useQuery({
        queryKey: ['trendingShortStory', page, limit],
        queryFn: () => listTrendingShortStory({ page, limit }),
        keepPreviousData: true,
    })

    const totalCount = data?.totalCount || 0
    const story = data?.shortStories?.[0]
    const totalPages = Math.ceil(totalCount / limit)

    /* ================= EFFECTS (ALWAYS RUN) ================= */
    useEffect(() => {
        // Reset animation after page change
        setIsAnimating(false)
    }, [page])

    /* ================= HANDLERS ================= */
    const goNext = () => {
        if (page === totalPages) return
        setIsAnimating(true)
        setTimeout(() => {
            setPage(p => p + 1)
        }, 200)
    }

    const goPrev = () => {
        if (page === 1) return
        setIsAnimating(true)
        setTimeout(() => {
            setPage(p => p - 1)
        }, 200)
    }

    /* ================= CONDITIONAL RENDER ================= */
    if (isLoading) return <Loader />
    if (!story) return null

    return (
        <div className="mt-4 px-4 md:px-6">

            {/* ================= NETFLIX HERO ================= */}
            <div
                key={story._id}
                className={`
        relative group
        h-[380px] sm:h-[450px] md:h-[560px]
        rounded-2xl overflow-hidden
        transition-all duration-500 ease-out
        ${isAnimating
                        ? 'opacity-0 translate-y-2'
                        : 'opacity-100 translate-y-0'}
      `}
            >

                {/* Background */}
                <img
                    src={story.coverImage}
                    alt={story.title}
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Netflix dark vignette */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

                {/* ================= CONTENT ================= */}
                <div className="relative z-10 h-full flex items-center">
                    <div className="max-w-2xl px-6 sm:px-10 md:px-14 space-y-5">

                        {/* META */}
                        <div className="flex items-center gap-3 text-xs text-gray-300">
                            <span className="font-semibold text-green-400">Trending</span>
                            <span>•</span>
                            <span>{story.category || 'Drama'}</span>
                            <span>•</span>
                            <span>HD</span>
                        </div>

                        {/* TITLE */}
                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white leading-tight">
                            {story.title}
                        </h1>

                        {/* DESCRIPTION */}
                        <p className="text-sm sm:text-base text-gray-300 max-w-xl">
                            {story.description}
                        </p>

                        {/* ACTIONS */}
                        <div className="flex gap-4 pt-3">

                            <Link
                                to={`/story/${story._id}`}
                                className="
                bg-red-600 hover:bg-red-700
                text-white font-semibold
                px-7 py-3 rounded-md
                transition
              "
                            >
                                Read Now
                            </Link>

                            <Link
                                to={`/story/${story._id}`}
                                className="
                bg-white/20 hover:bg-white/30
                text-white font-semibold
                px-7 py-3 rounded-md
                transition
              "
                            >
                                More Info
                            </Link>

                        </div>

                    </div>
                </div>

                {/* ================= NETFLIX ARROWS ================= */}
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 sm:px-6 z-30 pointer-events-none">

                    <button
                        onClick={goPrev}
                        disabled={page === 1}
                        className="
            pointer-events-auto
            w-11 h-11
            rounded-full
            bg-black/50 hover:bg-black/70
            flex items-center justify-center
            opacity-100 sm:opacity-0
            sm:group-hover:opacity-100
            transition
            disabled:opacity-0
          "
                    >
                        <ChevronLeft className="w-6 h-6 text-white" />
                    </button>

                    <button
                        onClick={goNext}
                        disabled={page === totalPages}
                        className="
            pointer-events-auto
            w-11 h-11
            rounded-full
            bg-black/50 hover:bg-black/70
            flex items-center justify-center
            opacity-100 sm:opacity-0
            sm:group-hover:opacity-100
            transition
            disabled:opacity-0
          "
                    >
                        <ChevronRight className="w-6 h-6 text-white" />
                    </button>

                </div>

            </div>
        </div>
    )

}

export default TopTrendStoryGrid
