import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../../Api-calls/register.js";
import Loader from "../../components/Loader.jsx";
import { toast } from "react-toastify";
import AuthImg from "../../Assets/AuthImg.png";
const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signupUser(email, password);

      if (result?.success) {
        toast.success("Account created successfully 🎉");
        navigate("/home");

        setUsername("");
        setEmail("");
        setPassword("");


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

  if (loading) return <Loader />;

  return (
    <div className="h-screen w-full bg-[#0b1f1a] overflow-hidden relative">
      {/* LOGO */}
      <div className="absolute top-6 left-[2%]  z-20">
        <Link to="/" className="text-white text-xl font-serif font-semibold">
          StoryFlix
        </Link>
      </div>

      <div className="h-full flex">
        {/* LEFT LOGIN PANEL */}
        <div className="w-full md:w-[50%] flex items-center justify-center px-6">
          <div className="w-full max-w-md p-5  ">

            {/* Heading */}
            <h2 className="text-[30px] text-center font-medium text-white tracking-tight">
              Create your account
            </h2>

            <p className="mt-1 text-center text-sm text-white/70 mb-10">
              Join a community of readers and writers shaping new worlds
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>

              {/* Username */}
              <div>
                <label className="block text-[11px] text-gray-400 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full bg-transparent border border-gray-600/70 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] text-gray-400 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent border border-gray-600/70 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] text-gray-400 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-transparent border border-gray-600/70 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />

                <div className="text-right ">
                  <Link
                    to="/forgot-password"
                    className="text-[11px] text-gray-400 hover:text-emerald-400 transition"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2 text-sm font-medium transition disabled:opacity-60 mt-2"
              >
                {loading ? "Signing up..." : "Sign up"}
              </button>
            </form>

            {/* Login link */}
            <p className="text-center text-[11px] text-gray-400 mt-2">
              Already have an account?{" "}
              <Link to="/" className="text-emerald-400 font-medium">
                Login User
              </Link>
            </p>

            

          </div>
        </div>




        {/* RIGHT IMAGE GRID */}
        <div className="hidden md:block md:w-[50%] ">
          <img
            src={AuthImg}
            alt="Story covers"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );

};

export default Register;
