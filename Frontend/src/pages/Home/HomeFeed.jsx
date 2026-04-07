import React, { memo } from "react";
import TopTrendStoryGrid from "../../components/TopTrendStory/TopTrendStoryGrid.jsx";
import ShortStoryGrid from "../../components/ShortStory/ShortStoryGrid.jsx";
import HomeGoodReadGrid from "../../components/HomeGoodReads/HomeGoodReadGrid.jsx";
import LastReadBanner from "../../components/lastRead/LastReadBanner.jsx";
import { useAuth } from "../../context/Authcontext.js";
import StoreelGrid from "../../components/Storeel/StoreelGrid.jsx"; // Make sure this is imported!

const HomeFeed = () => {
  const { userData } = useAuth();

  return (
    <div className="min-h-screen bg-transparent text-white relative">

      {/* SECTION 1: GOOD READS */}
      <section aria-label="Curated Good Reads">
        <HomeGoodReadGrid />
      </section>

      {/* MAIN CONTENT */}
      {/* INCREASED bottom padding (pb-32 md:pb-24) so the last items in the grid 
          don't get hidden completely behind the fixed banner. */}
      <main className="space-y-0 pb-32 md:pb-10">

        {/* SECTION 1.5: STORY REELS */}
        <section
          aria-label="Story Reels"
          className="px-4 md:px-6 mt-6"
        >
          <StoreelGrid />
        </section>

        {/* SECTION 2: TRENDING */}
        <section
          aria-label="Trending Stories"
          className="px-4 md:px-6 mt-6"
        >
          <TopTrendStoryGrid />
        </section>

       

        {/* SECTION 3: ALL STORIES */}
        {/* Note: Kept mt-0 here assuming the pt-4/pt-6 we added directly inside 
            ShortStoryGrid handles the spacing nicely. */}
        <section
          aria-label="Fresh Reads"
          className="px-4 md:px-6"
        >
          <ShortStoryGrid />
        </section>
      </main>

      {/* ========================================= */}
      {/* FIXED LAST READ BANNER (Spotify Style)    */}
      {/* ========================================= */}
      {userData?.lastRead && (
        <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-50 px-2 pb-2 md:p-0">
          {/* IMPORTANT: Change `bottom-16` to precisely match the height of your MobileBottomNav.
             For example, if your bottom nav is h-20 (80px), change it to `bottom-20`.
             The `px-2 pb-2 md:p-0` gives it a slight floating pill look on mobile, and flush on desktop.
           */}
          <LastReadBanner lastReadData={userData.lastRead} />
        </div>
      )}

    </div>
  );
};

export default memo(HomeFeed);