import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../Api-calls/register.js";
import Loader from "../../components/Loader.jsx";
import { toast } from "react-toastify";

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
      const result = await registerUser({ username, email, password });

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
    <div className="h-screen w-full bg-[#0f2a22] relative overflow-auto">

      {/* LOGO */}
      <div className="hidden md:block absolute top-4 right-6 z-20">
        <Link to="/" className="text-white text-xl font-serif font-semibold">
          StoryFlix
        </Link>
      </div>

      <div className="md:hidden w-full flex justify-center pt-4 pb-3 z-20 relative">
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

            <h2 className="text-2xl font-semibold text-gray-900">
              Create your account
            </h2>
            <p className="text-sm text-gray-500 mt-1 mb-6">
              Join a community of readers and writers shaping new worlds.
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                className="w-full rounded-lg border px-4 py-2.5 text-sm"
              />

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
                Create account
              </button>
            </form>



            <p className="text-center text-sm text-gray-600 mt-5">
              Already have an account?{" "}
              <Link to="/" className="text-emerald-600 font-medium">
                Login
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
