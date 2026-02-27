import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Ensure CSS is imported

// Keep lightweight, critical components static
import ProtectedRoute from "./utils/ProtectedRoute.jsx";
import Loader from "./components/Loader.jsx"; // Use your new Book Loader here!


// ================= LAZY LOAD PAGES (Code Splitting) =================
// These will only load when the URL is visited, saving massive bundle size.

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
const ViewShortStory = lazy(() => import("./components/ShortStory/ViewShortStory.jsx"));
const CreatePost = lazy(() => import("./components/create-update/CreatePost.jsx"));

// Profile & User
const UserProfile = lazy(() => import("./pages/profile/UserProfile.jsx"));
const UpdateProfile = lazy(() => import("./components/Profile/UpdateProfile.jsx"));
const UpdateShortStory = lazy(() => import("./components/Profile/UpdateShortStory.jsx"));

// Grids / Lists
const GoodReadsShortStoryGrid = lazy(() => import("./components/GoodReadsShortStory/GoodReadsShortStoryGrid.jsx"));
const CategoryShortStoryResultsGrid = lazy(() => import("./components/categoryShortStoryResults/CategoryShortStoryResultsGrid.jsx"));

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
        theme="dark" // Switched to dark to match your theme
      />

      {/* SUSPENSE WRAPPER:
         Shows your animated <Loader /> while the specific page chunk is downloading.
      */}
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
              <Route path="/story/:storyId" element={<ViewShortStory />} />
              <Route path="/profile" element={<UserProfile />} />

              {/* Heavy components like CreatePost now load on demand! */}
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
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default App;