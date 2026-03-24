import React, { memo } from "react";
import TopTrendStoryGrid from "../../components/TopTrendStory/TopTrendStoryGrid.jsx";
import ShortStoryGrid from "../../components/ShortStory/ShortStoryGrid.jsx";
import HomeGoodReadGrid from "../../components/HomeGoodReads/HomeGoodReadGrid.jsx";
import LastReadBanner from "../../components/lastRead/LastReadBanner.jsx";
import { useAuth } from "../../context/Authcontext.js";
const HomeFeed = () => {
  const { userData } = useAuth();
  return (
    <div className="min-h-screen bg-transparent text-white relative">

      {/* PERFORMANCE NOTE: 
         If you want a background image, ensure it is a small WebP file 
         or use a CSS Gradient (recommended for speed).
      */}
      {/* <div className="fixed inset-0 z-[-1] bg-gradient-to-b from-[#0f2a24] via-[#0b1412] to-black" /> */}

      {/* ========================================= */}
      {/* SECTION 0: LAST READ (Highest Priority) */}
      {/* ========================================= */}
      {userData?.lastRead && (
        <section aria-label="Resume Reading" className="px-4 md:px-6 pt-14 pb-2">
          <LastReadBanner lastReadData = {userData.lastRead} />
        </section>
      )}

      {/* SECTION 1: GOOD READS (Usually the LCP element) */}
      <section aria-label="Curated Good Reads">
        <HomeGoodReadGrid />
      </section>

      {/* MAIN CONTENT */}
      {/* Added pb-20 to prevent content being hidden behind MobileBottomNav */}
      <main className="space-y-6 pb-20 md:pb-8">

        {/* SECTION 2: TRENDING */}
        <section aria-label="Trending Stories">
          <TopTrendStoryGrid />
        </section>

        {/* SECTION 3: ALL STORIES */}
        <section
          aria-label="Fresh Reads"
          className="px-4 md:px-6"
        >
          <ShortStoryGrid />
        </section>
      </main>
    </div>
  );
};

// Memoize to prevent re-renders if parent Layout updates props unrelated to this feed
export default memo(HomeFeed);