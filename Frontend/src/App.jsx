import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Keep lightweight, critical components static
import ProtectedRoute from "./utils/ProtectedRoute.jsx";
import Loader from "./components/Loader.jsx";

// ================= LAZY LOAD PAGES (Code Splitting) =================

// Public / Landing
const Landing = lazy(() => import("./pages/Landing/Landing.jsx"));
const Login = lazy(() => import("./pages/Authentication/Login.jsx"));
const Register = lazy(() => import("./pages/Authentication/Register.jsx"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail.jsx"));
const AuthSuccess = lazy(() => import("./pages/Authentication/AuthSucess.jsx"));

// Layout
const Layout = lazy(() => import("./pages/Layout/Layout.jsx"));

// Core Features
const HomeFeed = lazy(() => import("./pages/Home/HomeFeed.jsx"));
const ReelFeed = lazy(() => import("./components/Storeel/ReelsFeed.jsx")); // If you want to keep this separate from HomeFeed
const ViewShortStory = lazy(() => import("./components/ShortStory/ViewShortStory.jsx"));
const CreatePost = lazy(() => import("./components/create-update/CreatePost.jsx"));

// Profile & User
const UserProfile = lazy(() => import("./pages/profile/UserProfile.jsx"));
const StoreelCreate = lazy(() => import("./components/Storeel/StoreelCreate.jsx"));
const UpdateProfile = lazy(() => import("./components/Profile/UpdateProfile.jsx"));
const UpdateShortStory = lazy(() => import("./components/Profile/UpdateShortStory.jsx"));

// Grids / Lists
const GoodReadsShortStoryGrid = lazy(() => import("./components/GoodReadsShortStory/GoodReadsShortStoryGrid.jsx"));
const CategoryShortStoryResultsGrid = lazy(() => import("./components/categoryShortStoryResults/CategoryShortStoryResultsGrid.jsx"));

// --- NEW: Lazy Load StoreelViewer ---
// (Make sure this path matches exactly where you saved the component)
const StoreelViewer = lazy(() => import("./components/Storeel/StoreelViewer.jsx"));

const App = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
      />

      <Suspense fallback={<Loader />}>
        <Routes>
          {/* ---------- PUBLIC ROUTES ---------- */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/auth/success" element={<AuthSuccess />} />

          {/* ---------- PROTECTED ROUTES ---------- */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/home" element={<HomeFeed />} />
              <Route path="/reels" element={<ReelFeed />} />
              <Route path="/story/:storyId" element={<ViewShortStory />} />

              {/* --- NEW ROUTE: Storeel Viewer --- */}
              {/* Note: React Router uses a colon ':' to denote a URL parameter */}
              <Route path="/storeel/:storeelId" element={<StoreelViewer />} />

              <Route path="/profile" element={<UserProfile />} />
              <Route path="/create" element={<CreatePost />} />

              <Route
                path="/goodReads/ShortStory"
                element={<GoodReadsShortStoryGrid />}
              />
              <Route
                path="/category/:category"
                element={<CategoryShortStoryResultsGrid />}
              />
              <Route
                path="/update/shortStory/:storyId"
                element={<UpdateShortStory />}
              />

              <Route path="/profile/update" element={<UpdateProfile />} />
              <Route path="/storeel/create/:id" element={<StoreelCreate />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default App;