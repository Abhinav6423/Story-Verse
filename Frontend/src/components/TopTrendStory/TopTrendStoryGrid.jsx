import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import TopTrendStoryCard from './TopTrendStoryCard.jsx'
import { listTrendingShortStory } from '../../Api-calls/trendingShortStory.js'
import Loader from '../Loader.jsx'

function TopTrendStoryGrid() {

    /* ================= STATE ================= */
    const [page, setPage] = useState(1)
    const [isAnimating, setIsAnimating] = useState(false)
    const limit = 1

    /* ================= QUERY CLIENT ================= */
    const queryClient = useQueryClient()

    /* ================= QUERY ================= */
    const {
        data,
        isLoading,
        isFetching
    } = useQuery({
        queryKey: ['trendingShortStory', page, limit],
        queryFn: () => listTrendingShortStory({ page, limit }),
        staleTime: 1000 * 60 * 5,      // ✅ keeps prefetched data fresh
        keepPreviousData: true         // ✅ prevents UI flicker
    })

    const totalCount = data?.totalCount || 0
    const story = data?.shortStories?.[0]
    const totalPages = Math.ceil(totalCount / limit)

    /* ================= PREFETCH NEXT PAGE ================= */
    useEffect(() => {
        if (page < totalPages) {
            queryClient.prefetchQuery({
                queryKey: ['trendingShortStory', page + 1, limit],
                queryFn: () =>
                    listTrendingShortStory({ page: page + 1, limit }),
                staleTime: 1000 * 60 * 5
            })
        }
    }, [page, totalPages, limit, queryClient])

    /* ================= RESET ANIMATION ================= */
    useEffect(() => {
        setIsAnimating(false)
    }, [page])

    /* ================= HANDLERS ================= */
    const goNext = () => {
        if (page === totalPages) return
        setIsAnimating(true)
        setTimeout(() => setPage(p => p + 1), 200)
    }

    const goPrev = () => {
        if (page === 1) return
        setIsAnimating(true)
        setTimeout(() => setPage(p => p - 1), 200)
    }

    /* ================= CONDITIONAL RENDER ================= */
    if (isLoading && page === 1) return <Loader />
    if (!story) return null

    return (
        <div className="mt-4 px-4 md:px-6">

            {/* ================= HERO ================= */}
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






                {/* Content */}

                <TopTrendStoryCard story={story} />

                {/* ================= ARROWS ================= */}
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 sm:px-6 z-30 pointer-events-none">

                    <button
                        onClick={goPrev}
                        disabled={page === 1}
                        className="pointer-events-auto w-11 h-11 rounded-full bg-black/50 flex items-center justify-center disabled:opacity-40"
                    >
                        <ChevronLeft className="w-6 h-6 text-white" />
                    </button>

                    <button
                        onClick={goNext}
                        disabled={page === totalPages}
                        className="pointer-events-auto w-11 h-11 rounded-full bg-black/50 flex items-center justify-center disabled:opacity-40"
                    >
                        <ChevronRight className="w-6 h-6 text-white" />
                    </button>

                </div>

                {/* ================= BACKGROUND FETCH INDICATOR ================= */}
                {isFetching && !isLoading && (
                    <div className="absolute bottom-4 right-4 text-xs text-white/70">
                        Loading…
                    </div>
                )}

            </div>
        </div>
    )
}

export default TopTrendStoryGrid
