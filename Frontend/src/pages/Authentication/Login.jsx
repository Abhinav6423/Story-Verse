import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Authcontext.js";
import { loginUser } from "../../Api-calls/login.js";
import { toast } from "react-toastify";
import AuthImg from "../../Assets/AuthImg.webp";
import logo from "../../Assets/logo.png";
import Loader from "../../components/Loader.jsx"; // Ensure this is your Book Loader

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

    setLoading(true); // 🟢 Triggers the full screen Loader

    try {
      // Add a minimum delay (e.g., 800ms) so the book animation 
      // has time to play at least once, making it feel smoother.
      const [result] = await Promise.all([
        loginUser(email, password),
        new Promise(resolve => setTimeout(resolve, 800))
      ]);

      if (!result?.success) {
        toast.error(result?.message || "Login failed");
        setLoading(false); // 🔴 Turn off loader if failed so form comes back
        return;
      }

      await reloadUserData(); // sync auth context
      navigate("/home");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  /* ---------------- GOOGLE LOGIN (Optional) ---------------- */
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  // ✅ SHOW LOADER IF LOGGING IN
  if (loading) {
    return <Loader text="Opening Story-Verse..." />;
  }

  return (
    <div className="h-screen w-full bg-[#0b1f1a] overflow-hidden relative flex">

      {/* LOGO */}
      <div className="absolute top-6 right-6 z-30">
        <Link
          to="/"
          className="block group transition-transform duration-300 hover:scale-110"
        >
          <img
            src={logo}
            alt="Preface Logo"
            className="
                w-16 h-16 sm:w-20 sm:h-20
                object-contain
                filter brightness-110 contrast-125
                drop-shadow-[0_5px_15px_rgba(0,0,0,0.6)]
                transition-all duration-500
                group-hover:rotate-6
                group-hover:drop-shadow-[0_0_20px_rgba(52,211,153,0.6)]
            "
          />
        </Link>
      </div>

      {/* LEFT LOGIN PANEL */}
      <div className="w-full lg:w-[45%] flex items-center justify-center px-4 sm:px-6 lg:px-10 relative z-10">
        <div className="w-full max-w-md lg:max-w-lg">

          {/* Heading */}
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              Welcome back
            </h2>
            <p className="text-gray-400 text-sm">
              Please enter your details to sign in.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5 uppercase tracking-wide">
                Email address
              </label>
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#081612] border border-gray-700 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#081612] border border-gray-700 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />

              <div className="text-right mt-2">
                <Link
                  to="/forgot-password"
                  className="text-xs text-gray-400 hover:text-emerald-400 transition font-medium"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`
                w-full flex items-center justify-center gap-2
                bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-3.5 
                text-sm font-bold tracking-wide transition-all shadow-lg shadow-emerald-900/20
                hover:-translate-y-0.5 active:scale-95
              `}
            >
              Sign in
            </button>

            {/* Optional Google Button */}
            {/* <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 bg-white text-black rounded-xl py-3.5 text-sm font-bold transition-transform hover:-translate-y-0.5"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
              Sign in with Google
            </button> */}

          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-400 mt-8">
            Don’t have an account?{" "}
            <Link to="/register" className="text-emerald-400 font-semibold hover:text-emerald-300 transition">
              Sign up for free
            </Link>
          </p>

          {/* Verification Warning */}
          <div className="mt-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex gap-3 items-start">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              If you just registered, please check your inbox (and spam folder) for the verification link before logging in.
            </p>
          </div>

        </div>
      </div>

      {/* RIGHT IMAGE GRID (Lazy Loaded) */}
      <div className="hidden lg:block lg:w-[55%] h-full relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1f1a] to-transparent z-10" />
        <img
          src={AuthImg}
          loading="lazy"
          alt="Story covers collage"
          className="w-full h-full object-cover object-right opacity-90"
        />
      </div>

    </div>
  );
};

export default Login;