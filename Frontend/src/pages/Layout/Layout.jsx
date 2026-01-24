import { useState, useEffect, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../../components/Home/Navbar";
import MobileBottomNav from "../../components/Home/MobileBottomNav";
import CategoryPopup from "../../components/Home/CategoryPopup";

const Layout = () => {
  const [showBrowse, setShowBrowse] = useState(false);
  const location = useLocation();

  /* ================= EFFECT: CLOSE ON ROUTE CHANGE ================= */
  // Whenever the URL changes (user navigates), close the popup
  useEffect(() => {
    setShowBrowse(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  /* ================= HANDLERS ================= */
  // Explicitly close the popup
  const handleCloseBrowse = useCallback(() => {
    setShowBrowse(false);
  }, []);

  // Toggle the popup (for the Browse button)
  const handleToggleBrowse = useCallback(() => {
    setShowBrowse((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen text-gray-200 font-sans selection:bg-emerald-500/30 relative">

      {/* BACKGROUND LAYERS */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, #164e38 0%, #062c21 40%, #020b08 80%, #000000 100%)`
        }}
      />
      <div
        className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
      />

      {/* CONTENT WRAPPER */}
      <div className="relative z-10 flex flex-col min-h-screen">

        <Navbar
          onAnyNavClick={handleCloseBrowse}
          setShowBrowse={handleToggleBrowse}
          showBrowse={showBrowse}
        />

        <main className="flex-1 w-full pb-20 md:pb-8">
          <Outlet />
        </main>

        <MobileBottomNav
          showBrowse={showBrowse}
          setShowBrowse={handleToggleBrowse} // For Browse button
          onCloseBrowse={handleCloseBrowse}  // For Home, Write, Profile buttons
        />

        <CategoryPopup
          open={showBrowse}
          onClose={handleCloseBrowse}
          onSelect={handleCloseBrowse}
        />
      </div>
    </div>
  );
};

export default Layout;