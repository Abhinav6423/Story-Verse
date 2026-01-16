import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext.js";
import Loader from "../components/Loader.jsx";

const ProtectedRoute = () => {
  const { userData, loading } = useAuth();

  // 1️⃣ Wait for auth resolution
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // 2️⃣ Redirect declaratively
  if (!userData) {
    return <Navigate to="/" replace />;
  }

  // 3️⃣ Allow access
  return <Outlet />;
};

export default ProtectedRoute;
