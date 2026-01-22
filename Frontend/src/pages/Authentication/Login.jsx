import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Authcontext.js";
import { loginUser } from "../../Api-calls/login.js";
import { toast } from "react-toastify";
import AuthImg from "../../Assets/AuthImg.png";
import Loader from "../../components/Loader.jsx";

const Login = () => {
  const { reloadUserData, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Redirect ONLY inside useEffect
  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  /* ---------------- EMAIL / PASSWORD LOGIN ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const result = await loginUser(email, password);

      if (!result?.success) {
        toast.error(result?.message || "Login failed");
        return;
      }

      await reloadUserData(); // sync auth context
      navigate("/home");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />

  return (
    <div className="h-screen w-full bg-[#0b1f1a] overflow-hidden relative">
      {/* LOGO */}
      <div className="absolute top-6 left-[2%] z-20">
        <Link to="/" className="text-white text-xl font-serif font-semibold">
          StoryFlix
        </Link>
      </div>

      <div className="h-full flex">
        {/* LEFT LOGIN PANEL */}
        <div className="w-full lg:w-[45%] flex items-center justify-center px-4 sm:px-6 lg:px-10">
          <div className="w-full max-w-md lg:max-w-lg rounded-2xl backdrop-blur-xl px-6 lg:px-10 py-8 lg:py-10">

            {/* Heading */}
            <h2 className="text-[26px] sm:text-[30px] lg:text-[32px] text-center font-medium text-white mb-6 sm:mb-8 tracking-tight">
              Welcome back
            </h2>

            <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label className="block text-[11px] sm:text-[12px] text-gray-400 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent border border-gray-600/70 rounded-lg px-4 py-2.5 sm:py-3 text-sm sm:text-[15px] text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] sm:text-[12px] text-gray-400 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-transparent border border-gray-600/70 rounded-lg px-4 py-2.5 sm:py-3 text-sm sm:text-[15px] text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />

                {/* Forgot password */}
                <div className="text-right mt-2">
                  <Link
                    to="/forgot-password"
                    className="text-[11px] sm:text-[12px] text-gray-400 hover:text-emerald-400 transition"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2.5 sm:py-3 text-sm sm:text-[15px] font-medium transition disabled:opacity-60 mt-2"
              >
                Login User
              </button>
            </form>

            {/* Register */}
            <p className="text-center text-[11px] sm:text-[12px] text-gray-400 mt-5">
              Don’t have an account?{" "}
              <Link to="/register" className="text-emerald-400 font-medium">
                Register User
              </Link>
            </p>

            {/* Verification Info */}
            <div className="mt-5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-4 py-3">
              <p className="text-[11px] sm:text-[12px] text-emerald-200 leading-relaxed">
                A verification email has been sent to your registered email address.
                If you don’t see it in your inbox, please check your spam or junk folder.
              </p>
            </div>

          </div>
        </div>

        {/* RIGHT IMAGE GRID (ONLY LAPTOP & BIG SCREENS) */}
        <div className="hidden lg:block lg:w-[55%]">
          <img
            src={AuthImg}
            alt="Story covers"
            className="w-full h-full object-cover object-right"
          />
        </div>
      </div>
    </div>
  );


};

export default Login;
