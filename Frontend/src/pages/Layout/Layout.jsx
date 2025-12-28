import { Outlet } from "react-router-dom";
import MobileBottomNav from "../../components/Home/MobileBottomNav.jsx";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-[#f8f9fb] pb-16">
      {/* PAGE CONTENT */}
      <Outlet />

      {/* MOBILE BOTTOM NAV (GLOBAL) */}
      <MobileBottomNav />
    </div>
  );
};

export default AppLayout;
