import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../../Api-calls/register.js";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react"; // Import spinner
import { useAuth } from "../../context/Authcontext.js"; // Import Auth for redirect check
import AuthImg from "../../Assets/AuthImg.webp";
import logo from "../../Assets/logo.png";
const Register = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Check if already logged in

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const result = await signupUser(email, password, username);

      if (result?.success) {
        toast.success("Account created! Please verify your email before logging in.");

        // Clear form
        setUsername("");
        setEmail("");
        setPassword("");

        // Navigate to Login so they can sign in after verification
        navigate("/login");
      } else {
        toast.error(result?.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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

      {/* LEFT SIGNUP PANEL */}
      <div className="w-full lg:w-[45%] flex items-center justify-center px-4 sm:px-6 lg:px-10 relative z-10">
        <div className="w-full max-w-md lg:max-w-lg">

          {/* Heading */}
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              Create an account
            </h2>
            <p className="text-gray-400 text-sm">
              Join a community of readers and writers shaping new worlds.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* Username */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5 uppercase tracking-wide">
                Username
              </label>
              <input
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-[#081612] border border-gray-700 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>

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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#081612] border border-gray-700 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full flex items-center justify-center gap-2
                bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-3.5 
                text-sm font-bold tracking-wide transition-all shadow-lg shadow-emerald-900/20
                mt-4
                ${loading ? "opacity-70 cursor-not-allowed" : "hover:-translate-y-0.5"}
              `}
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              {loading ? "Creating Account..." : "Sign up"}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-400 mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-400 font-semibold hover:text-emerald-300 transition">
              Log in
            </Link>
          </p>

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

export default Register;