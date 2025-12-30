import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import MobileBottomNav from "../../components/Home/MobileBottomNav.jsx";
import Navbar from "../../components/Home/Navbar.jsx";
import CategoryPopup from "../../components/Home/CategoryPopup.jsx";

const AppLayout = () => {
  const [showBrowse, setShowBrowse] = useState(false);
  const location = useLocation();

  /* 🔑 CLOSE POPUP ON ANY ROUTE CHANGE */
  useEffect(() => {
    setShowBrowse(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#f8f9fb] pb-16">
      {/* DESKTOP NAVBAR */}
      <Navbar onAnyNavClick={() => setShowBrowse(false)} />

      {/* PAGE CONTENT */}
      <Outlet />

      {/* MOBILE BOTTOM NAV */}
      <MobileBottomNav
        showBrowse={showBrowse}
        setShowBrowse={setShowBrowse}
        onAnyNavClick={() => setShowBrowse(false)}
      />

      {/* CATEGORY POPUP */}
      <CategoryPopup
        open={showBrowse}
        onClose={() => setShowBrowse(false)}
        onSelect={(category) => {
          setShowBrowse(false);
        }}
      />
    </div>
  );
};

export default AppLayout;
