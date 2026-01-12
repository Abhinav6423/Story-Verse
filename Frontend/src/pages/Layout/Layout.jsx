
import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../../components/Home/Navbar";
import MobileBottomNav from "../../components/Home/MobileBottomNav";
import CategoryPopup from "../../components/Home/CategoryPopup";
import Homebg from "../../Assets/Homebg.jpeg";
const Layout = () => {
  const [showBrowse, setShowBrowse] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setShowBrowse(false);
  }, [location.pathname]);

  return (
    <div
      className="min-h-screen flex flex-col text-gray-200 pb-16 md:pb-4 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${Homebg})`,
      }}
    >



      {/* NAVBAR */}
      <Navbar
        onAnyNavClick={() => setShowBrowse(false)}
        setShowBrowse={setShowBrowse}
        showBrowse={showBrowse}
      />

      {/* PAGE CONTENT */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* MOBILE NAV */}
      <MobileBottomNav
        showBrowse={showBrowse}
        setShowBrowse={setShowBrowse}
        onAnyNavClick={() => setShowBrowse(false)}
      />

      {/* CATEGORY POPUP */}
      <CategoryPopup
        open={showBrowse}
        onClose={() => setShowBrowse(false)}
        onSelect={() => setShowBrowse(false)}
      />
    </div>
  );
};

export default Layout;