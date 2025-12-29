import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/Authcontext.js";
import { loginUser } from "../../Api-calls/login.js";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader.jsx";
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

    if (loading) {
        return <Loader />
    }

    return (
        <div className="h-screen w-full bg-[#0f2a22] relative overflow-hidden">

            {/* ================= LOGO ================= */}

            {/* Desktop — Top Right */}
            <div className="hidden md:block absolute top-4 right-6 z-20 pb-3 sm:pb-2">
                <Link
                    to="/"
                    className="text-white text-xl font-serif font-semibold tracking-tight hover:opacity-90 transition"
                >
                    StoryFlix
                </Link>
            </div>

            {/* Mobile — Center Top */}
            <div className="md:hidden w-full flex justify-center pt-4 pb-2 z-20 relative">
                <Link
                    to="/"
                    className="text-white text-xl font-serif font-semibold tracking-tight"
                >
                    StoryFlix
                </Link>
            </div>

            {/* ================= MAIN WRAPPER ================= */}
            <div className="h-full flex flex-col md:flex-row">

                {/* ================= LEFT — IMAGE ================= */}
                <div
                    className="
                    w-full
                    hidden
                    md:flex
                    md:basis-[60%]
                    h-56
                    md:h-full
                    px-4 py-2
                "
                >
                    <img
                        src="https://i.pinimg.com/736x/70/4e/a9/704ea9e793e0e7e27117acfb7dc4d38e.jpg"
                        alt="Library"
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>

                {/* ================= RIGHT — FORM ================= */}
                <div
                    className="
                    w-full
                    basis-[60%]
                    md:basis-[40%]
                    flex
                    items-center
                    justify-center
                    px-4
                "
                >
                    <div className="w-full max-w-md bg-white rounded-2xl px-6 sm:px-8 py-8 shadow-lg">

                        {/* HEADER */}
                        <h2 className="text-2xl font-semibold text-gray-900 text-center">
                            Hello Again
                        </h2>
                        <p className="text-sm text-gray-500 text-center mt-2 mb-8">
                            Welcome back, you’ve been missed
                        </p>

                        {/* FORM */}
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                className="
                                w-full rounded-lg border border-gray-300
                                px-4 py-2.5 text-sm
                                focus:outline-none focus:ring-2 focus:ring-emerald-500
                            "
                            />

                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="
                                    w-full rounded-lg border border-gray-300
                                    px-4 py-2.5 text-sm
                                    focus:outline-none focus:ring-2 focus:ring-emerald-500
                                "
                                />
                                <span className="absolute right-4 top-2.5 text-gray-400 cursor-pointer select-none">
                                    👁
                                </span>
                            </div>

                            <div className="text-right">
                                <span className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer">
                                    Forgot password?
                                </span>
                            </div>

                            <button
                                type="submit"
                                className="
                                w-full bg-slate-900 text-white
                                rounded-lg py-3 text-sm font-medium
                                hover:bg-slate-800 transition
                            "
                            >
                                Sign In
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-600 mt-6">
                            Don&apos;t have an account?{" "}
                            <Link
                                to="/register"
                                className="text-emerald-600 font-medium hover:underline"
                            >
                                Register User
                            </Link>
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );

    


};

export default Login;
