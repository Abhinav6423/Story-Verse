import React from "react";
import Navbar from "../../components/Home/Navbar.jsx";
import TopTrendStoryGrid from "../../components/TopTrendStory/TopTrendStoryGrid.jsx";
import ShortStoryGrid from "../../components/ShortStory/ShortStoryGrid.jsx";
import HomeGoodReadGrid from "../../components/HomeGoodReads/HomeGoodReadGrid.jsx";
import MobileBottomNav from "../../components/Home/MobileBottomNav.jsx";
const HomeFeed = () => {
  return (
    <div className="min-h-screen bg-white text-black">
     
      

      {/* GOOD READS STRIP */}
      <HomeGoodReadGrid />

      {/* MAIN CONTENT */}
      <main className="space-y-9 sm:space-y-1 pb-16 md:pb-0">
        {/* HERO */}
        <section>
          <TopTrendStoryGrid />
        </section>

        {/* STORY GRID */}
        <section className="px-4 md:px-6 mb-5 ">
          <ShortStoryGrid />
        </section>
      </main>

      
    </div>
  );
};

export default HomeFeed;
