import React from 'react'
import StoryCard from './TopTrendStoryCard.jsx'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { listTrendingShortStory } from '../../Api-calls/trendingShortStory.js'
import { useQuery } from '@tanstack/react-query'
import Loader from '../Loader.jsx'
import { useState } from 'react'
import { Link } from 'react-router-dom'
function TopTrendStoryGrid() {

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(4)
    // const [totalCount, setTotalCount] = useState(0)

    const { data, isLoading } = useQuery(
        {
            queryKey: ['trendingShortStory', page, limit],
            queryFn: () => listTrendingShortStory({ page, limit }),
        }
    )

    if (isLoading) {
        return <Loader />
    }


    console.log(data)
    const totalCount = data?.totalCount

    const stories = data?.shortStories

    return (
        <div className="mt-1  px-4 md:px-6  py-1 rounded-2xl ">

            {/* ================= SECTION HEADER ================= */}
            <div className="flex items-center justify-center gap-4   ">
                {/* <div className="mb-1 flex items-center gap-2">
                    <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                        Trending
                    </span>
                </div> */}



            </div>



            {/* MOBILE — Horizontal Scroll */}
            <div className="
  flex gap-4 overflow-x-auto pb-2
  snap-x snap-mandatory
  scrollbar-hide sm:hidden
">
                {stories.map((story) => (
                    <div
                        key={story._id}
                        className="min-w-full snap-center flex-shrink-0"
                    >
                        <Link
                            to={`/story/${story._id}`}
                            className="block w-full"
                        >
                            <StoryCard story={story} />
                        </Link>
                    </div>
                ))}
            </div>


            {/* DESKTOP — Grid Layout */}
            <div className="
                hidden sm:grid 
                grid-cols-2 
                lg:grid-cols-3 
                xl:grid-cols-4 
                gap-6
            ">
                {stories.map((story) => (
                    <Link to={`/story/${story._id}`}>
                        <StoryCard key={story._id} story={story} />
                    </Link>
                ))}
            </div>

            {/* PAGINATION BUTTONS */}
            <div className=" hidden sm:flex justify-center items-center gap-3 mt-8">

                {/* Prev Button */}
                <button
                    onClick={() => Math.max(page - 1, 1)}
                    disabled={page === 1}
                    className="
                    flex items-center justify-center w-9 h-9 rounded-full
                    border border-gray-300 bg-white shadow-sm
                    hover:bg-gray-100 hover:border-gray-400 transition
                ">
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>



                {/* Next Button */}
                <button
                    onClick={() => Math.min(page + 1, Math.ceil(totalCount / limit))}
                    disabled={page === Math.ceil(totalCount / limit)}
                    className="
                    flex items-center justify-center w-9 h-9 rounded-full
                    border border-gray-300 bg-white shadow-sm
                    hover:bg-gray-100 hover:border-gray-400 transition
                ">
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>

            </div>

        </div>
    );
}

export default TopTrendStoryGrid;
