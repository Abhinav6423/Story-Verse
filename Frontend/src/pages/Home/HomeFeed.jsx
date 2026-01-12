import React from "react";
import Navbar from "../../components/Home/Navbar.jsx";
import TopTrendStoryGrid from "../../components/TopTrendStory/TopTrendStoryGrid.jsx";
import ShortStoryGrid from "../../components/ShortStory/ShortStoryGrid.jsx";
import HomeGoodReadGrid from "../../components/HomeGoodReads/HomeGoodReadGrid.jsx";
import MobileBottomNav from "../../components/Home/MobileBottomNav.jsx";
import Homebg from "../../Assets/Homebg.jpeg";
const HomeFeed = () => {
  return (
    <div className="min-h-screen bg-transparent text-white">



      {/* GOOD READS STRIP */}
      <HomeGoodReadGrid />

      {/* MAIN CONTENT */}
      <main className="space-y-3 sm:space-y-1 pb-3 md:pb-0">
        {/* HERO */}
        <section>
          <TopTrendStoryGrid />
        </section>

        {/* STORY GRID */}
        <section className="px-4 md:px-6 mb-5 "
          // style={{
          //   backgroundImage: `url(${Homebg})`,
          // }}
        >
          <ShortStoryGrid />
        </section>
      </main>


    </div>
  );
};

export default HomeFeed;
