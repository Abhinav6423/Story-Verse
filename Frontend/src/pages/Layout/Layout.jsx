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
          background: `
            radial-gradient(ellipse at 0% 50%, rgba(22, 78, 56, 0.5) 0%, transparent 50%),
            radial-gradient(ellipse at 100% 50%, rgba(22, 78, 56, 0.5) 0%, transparent 50%),
            #0a0c0a
          `
        }}
      />



      {/* CONTENT WRAPPER */}
      <div className="relative z-10 flex flex-col min-h-screen">

        <Navbar
          onAnyNavClick={handleCloseBrowse}
          setShowBrowse={handleToggleBrowse}
          showBrowse={showBrowse}
        />

        <main className="flex-1 w-full pb-20 ">
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