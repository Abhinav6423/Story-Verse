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

      {/* SECTION 1: HERO (POSTER / GOOD READS) */}
      {/* IMPORTANT: Make sure inside HomeGoodReadGrid hero height is reduced (80–85vh) */}
      <section aria-label="Curated Good Reads">
        <HomeGoodReadGrid />
      </section>

      {/* SECTION 2: STORY REELS (VISIBLE JUST BELOW HERO 👀) */}
      <section
        id="reels-section"
        aria-label="Story Previews"
        className="px-4 md:px-6 mt-2"
      >
        <StoreelGrid />
      </section>

      {/* MAIN CONTENT */}
      <main className="space-y-0 pb-32 md:pb-10">

        {/* SECTION 3: TRENDING */}
        <section
          aria-label="Trending Stories"
          className="px-4 md:px-6 mt-6"
        >
          <TopTrendStoryGrid />
        </section>

        {/* SECTION 4: ALL STORIES */}
        <section
          aria-label="Fresh Reads"
          className="px-4 md:px-6"
        >
          <ShortStoryGrid />
        </section>

      </main>

      {/* FIXED LAST READ BANNER */}
      {userData?.lastRead && (
        <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-50 px-2 pb-2 md:p-0">
          <LastReadBanner lastReadData={userData.lastRead} />
        </div>
      )}
    </div>
  );
};

export default memo(HomeFeed);