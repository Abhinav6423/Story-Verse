import React from 'react'
import Login from './pages/Authentication/Login.jsx'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/Authentication/Register.jsx'
import ProtectedRoute from './utils/ProtectedRoute.jsx'
import HomeFeed from './pages/Home/HomeFeed.jsx'
import ViewShortStory from "./components/ShortStory/ViewShortStory.jsx"
import UserProfile from './pages/profile/UserProfile.jsx'
import CreatePost from './components/create-update/CreatePost.jsx'
import { ToastContainer } from 'react-toastify';
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
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />


        <Route element={<ProtectedRoute />}>
          <Route path='/home' element={<HomeFeed />} />
          <Route path='/story/:storyId' element={<ViewShortStory />} />
          <Route path='/profile' element={<UserProfile />} />
          <Route path='/create' element={<CreatePost />} />
        </Route>
      </Routes>
    </>
  )
}

export default App