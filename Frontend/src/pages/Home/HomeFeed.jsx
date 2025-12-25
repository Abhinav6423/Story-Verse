import React from 'react'
import Navbar from '../../components/Home/Navbar.jsx'
import TopTrendStoryGrid from '../../components/TopTrendStory/TopTrendStoryGrid.jsx'
import ShortStoryGrid from '../../components/ShortStory/ShortStoryGrid.jsx'

const HomeFeed = () => {
    return (
        <div className="min-h-screen bg-[#141414] text-white">

            {/* Top gradient (Netflix style depth) */}
            <div className="relative">
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent pointer-events-none" />
                <Navbar />
            </div>

            {/* MAIN CONTENT */}
            <main className="space-y-16 pb-20">

                {/* HERO */}
                <section>
                    <TopTrendStoryGrid />
                </section>

                {/* STORY ROWS */}
                <section className="px-4 md:px-6">
                    <ShortStoryGrid />
                </section>

            </main>
        </div>
    )
}

export default HomeFeed
