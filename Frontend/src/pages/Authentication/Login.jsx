import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/Authcontext.js";
import { loginUser } from "../../Api-calls/login.js";
import { useNavigate } from "react-router-dom";
const Login = () => {
    const { reloadUserData } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/home");
        }
    }, [isLoggedIn, navigate]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await loginUser(email, password);
            if (result?.success) {
                reloadUserData();
                setIsLoggedIn(true);
            } else {
                alert(result?.message);
            }
        } catch (error) {
            console.error("Login error:", error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div
            className="min-h-screen flex items-center justify-center px-4
             bg-[url(https://i.pinimg.com/1200x/a0/50/40/a050401a6437cba929b52f0d5eb1438e.jpg)]
             bg-cover bg-center"
        >
            <div className="w-full max-w-md">

                {/* Card */}
                <div className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.25)]
                    px-10 py-12">

                    {/* Heading */}
                    <h2 className="text-2xl font-semibold text-center text-slate-800 tracking-tight">
                        Hello Again
                    </h2>
                    <p className="text-sm text-slate-500 text-center mt-2 mb-10">
                        Welcome back, you’ve been missed
                    </p>

                    {/* Form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        {/* Email */}
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email address"
                            className="w-full rounded-xl px-4 py-3.5 text-sm
                     bg-white border border-slate-200
                     focus:outline-none focus:ring-2 focus:ring-slate-800
                     placeholder-slate-400 transition"
                        />

                        {/* Password */}
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full rounded-xl px-4 py-3.5 text-sm
                       bg-white border border-slate-200
                       focus:outline-none focus:ring-2 focus:ring-slate-800
                       placeholder-slate-400 transition"
                            />
                            <span className="absolute right-4 top-3.5 text-slate-400 text-sm cursor-pointer select-none">
                                👁
                            </span>
                        </div>

                        {/* Forgot */}
                        <div className="text-right">
                            <span className="text-xs text-slate-500 hover:text-slate-700 cursor-pointer transition">
                                Forgot password?
                            </span>
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            className="w-full rounded-xl py-3.5 text-sm font-medium tracking-wide
                     bg-slate-900 text-white
                     hover:bg-slate-800 transition"
                        >
                            Sign In
                        </button>

                    </form>

                    {/* Signup Redirect */}
                    <p className="text-center text-sm text-slate-600 mt-6">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-medium text-emerald-700 hover:underline"
                        >
                            Register User
                        </Link>
                    </p>
                </div>
            </div>
        </div>


    );
};

export default Login;
