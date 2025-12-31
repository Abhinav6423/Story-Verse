import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Authentication/Login.jsx";
import Register from "./pages/Authentication/Register.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";

import ProtectedRoute from "./utils/ProtectedRoute.jsx";
import Layout from "./pages/Layout/Layout.jsx";

import HomeFeed from "./pages/Home/HomeFeed.jsx";
import ViewShortStory from "./components/ShortStory/ViewShortStory.jsx";
import UserProfile from "./pages/profile/UserProfile.jsx";
import CreatePost from "./components/create-update/CreatePost.jsx";
import GoodReadsShortStoryGrid from "./components/GoodReadsShortStory/GoodReadsShortStoryGrid.jsx";
import CategoryShortStoryResultsGrid from "./components/categoryShortStoryResults/CategoryShortStoryResultsGrid.jsx";
import UpdateShortStory from "./components/Profile/UpdateShortStory.jsx";

import AuthSuccess from "./pages/Authentication/AuthSucess"; // ✅ ADD THIS
import { ToastContainer } from "react-toastify";

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
        theme="light"
      />

      <Routes>
        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* ✅ GOOGLE OAUTH CALLBACK SUCCESS */}
        <Route path="/auth/success" element={<AuthSuccess />} />

        {/* ---------- PROTECTED ROUTES ---------- */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/home" element={<HomeFeed />} />
            <Route path="/story/:storyId" element={<ViewShortStory />} />
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
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
