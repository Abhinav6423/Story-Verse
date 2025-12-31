import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Authcontext.js";
import { loginUser } from "../../Api-calls/login.js";
import Loader from "../../components/Loader.jsx";
import { toast } from "react-toastify";
import GoogleButton from "../../utils/GoogleBtn.jsx";

const Login = () => {
  const { reloadUserData } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginUser(email, password);

      if (result?.success) {
        await reloadUserData();   // sync auth context
        navigate("/home");        // redirect immediately
      } else {
        toast.error(result?.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="h-screen w-full bg-[#0f2a22] relative overflow-hidden">

      {/* LOGO */}
      <div className="hidden md:block absolute top-4 right-6 z-20">
        <Link to="/" className="text-white text-xl font-serif font-semibold">
          StoryFlix
        </Link>
      </div>

      <div className="md:hidden w-full flex justify-center pt-4 pb-2 z-20 relative">
        <Link to="/" className="text-white text-xl font-serif font-semibold">
          StoryFlix
        </Link>
      </div>

      {/* MAIN */}
      <div className="h-full flex flex-col md:flex-row">

        {/* IMAGE */}
        <div className="hidden md:flex md:basis-[60%] px-4 py-2">
          <img
            src="https://i.pinimg.com/736x/70/4e/a9/704ea9e793e0e7e27117acfb7dc4d38e.jpg"
            alt="Library"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* FORM */}
        <div className="w-full md:basis-[40%] flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-white rounded-2xl px-6 py-8 shadow-lg">

            <h2 className="text-2xl font-semibold text-center text-gray-900">
              Hello Again
            </h2>
            <p className="text-sm text-gray-500 text-center mt-2 mb-6">
              Welcome back, you’ve been missed
            </p>

            {/* LOCAL LOGIN */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full rounded-lg border px-4 py-2.5 text-sm"
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full rounded-lg border px-4 py-2.5 text-sm"
              />

              <button
                type="submit"
                className="w-full bg-slate-900 text-white rounded-lg py-3 text-sm font-medium"
              >
                Sign In
              </button>
            </form>

            {/* GOOGLE LOGIN */}
            <div className="mt-6">
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-gray-300" />
                <span className="text-sm text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-300" />
              </div>

              <GoogleButton />
            </div>

            <p className="text-center text-sm text-gray-600 mt-6">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-emerald-600 font-medium">
                Register
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
