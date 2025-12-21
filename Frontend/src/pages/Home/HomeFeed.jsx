import React from 'react'
import Navbar from '../../components/Home/Navbar.jsx'
import TopTrendStoryGrid from '../../components/TopTrendStory/TopTrendStoryGrid.jsx'
import ShortStoryGrid from '../../components/ShortStory/ShortStoryGrid.jsx'

const HomeFeed = () => {
    return (
        <div className='bg-slate-50/80 backdrop-blur-md'>
            <Navbar />
            <TopTrendStoryGrid />
            <ShortStoryGrid/>
        </div>
    )
}

export default HomeFeed