import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../Api-calls/register.js";
import { useAuth } from "../../context/Authcontext.js";
import Loader from "../../components/Loader.jsx";

const Register = () => {
    const { reloadUserData } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [profilePic, setProfilePic] = useState("")

    const [loading, setLoading] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    // Redirect after successful registration
    useEffect(() => {
        if (isRegistered) {
            navigate("/home");
        }
    }, [isRegistered, navigate]);



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await registerUser({
                username,
                email,
                password,
                profilePic
            });

            if (result?.success) {
                reloadUserData();
                setIsRegistered(true); // Trigger navigation inside useEffect
            } else {
                alert(result?.message);
            }
        } catch (error) {
            console.error("Registration error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen flex items-center justify-center px-4
             bg-[url(https://i.pinimg.com/1200x/a0/50/40/a050401a6437cba929b52f0d5eb1438e.jpg)]
             bg-cover bg-center">
            <div className="w-full max-w-md">

                {/* Card */}
                <div className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.25)]
                    px-10 py-12">

                    {/* Heading */}
                    <h2 className="text-2xl font-semibold text-center text-slate-800">
                        Hello There!
                    </h2>
                    <p className="text-sm text-slate-500 text-center mt-1 mb-8">
                        Welcome to our community
                    </p>

                    {/* FORM */}
                    <form className="space-y-5" onSubmit={handleSubmit}>

                        {/* Username */}
                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter Username"
                            className="w-full bg-white rounded-xl px-4 py-3 text-sm
                     shadow focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />

                        {/* Email */}
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Address"
                            className="w-full bg-white rounded-xl px-4 py-3 text-sm
                     shadow focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />

                        {/* Password */}
                        <div className="relative">
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full bg-white rounded-xl px-4 py-3 text-sm
                       shadow focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            />

                        </div>

                        {/* Profile Picture */}
                        <div className="relative">
                            <input
                                type="profilePic"
                                name="profilePic"
                                value={profilePic}
                                onChange={(e) => setProfilePic(e.target.value)}
                                placeholder="Profile Picture"
                                className="w-full bg-white rounded-xl px-4 py-3 text-sm
                       shadow focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            />

                        </div>
                        {/* Button */}
                        <button
                            type="submit"
                            className="w-full rounded-xl py-3.5 text-sm font-medium tracking-wide
                     bg-slate-900 text-white
                     hover:bg-slate-800 transition"
                        >
                            Create Account
                        </button>

                    </form>

                    {/* Login Redirect */}
                    <p className="text-center text-sm text-slate-600 mt-6">
                        Already have an account?{" "}
                        <Link
                            to="/"
                            className="font-medium text-emerald-700 hover:underline"
                        >
                            Login
                        </Link>
                    </p>

                </div>
            </div>
        </div>

    );
};

export default Register;
