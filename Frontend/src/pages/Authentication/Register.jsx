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
    <div className="h-screen w-full bg-[#0f2a22] relative overflow-auto">

        {/* ================= LOGO ================= */}

        {/* Desktop — Top Right */}
        <div className="hidden md:block absolute top-4 right-6 z-20">
            <Link
                to="/"
                className="text-white text-xl font-serif font-semibold tracking-tight hover:opacity-90 transition"
            >
                StoryFlix
            </Link>
        </div>

        {/* Mobile — Center Top */}
        <div className="md:hidden w-full flex justify-center pt-4 pb-3 sm:pb-2 z-20 relative">
            <Link
                to="/"
                className="text-white text-xl font-serif font-semibold tracking-tight"
            >
                StoryFlix
            </Link>
        </div>

        {/* ================= MAIN WRAPPER ================= */}
        <div className="h-full flex flex-col md:flex-row">

            {/* ================= LEFT — IMAGE (60%) ================= */}
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

            {/* ================= RIGHT — FORM (40%) ================= */}
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
                {/* FORM CARD */}
                <div className="w-full max-w-md bg-white rounded-2xl px-6 sm:px-8 py-8 shadow-lg">

                    {/* HEADER */}
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Create your account
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 mb-6">
                        Join a community of readers and writers shaping new worlds.
                    </p>

                    {/* FORM */}
                    <form className="space-y-4" onSubmit={handleSubmit}>

                        {/* USERNAME */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter Username"
                                className="
                                    w-full rounded-lg border border-gray-300
                                    px-4 py-2.5 text-sm
                                    focus:outline-none focus:ring-2 focus:ring-emerald-500
                                "
                            />
                        </div>

                        {/* EMAIL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email address"
                                className="
                                    w-full rounded-lg border border-gray-300
                                    px-4 py-2.5 text-sm
                                    focus:outline-none focus:ring-2 focus:ring-emerald-500
                                "
                            />
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className="
                                    w-full rounded-lg border border-gray-300
                                    px-4 py-2.5 text-sm
                                    focus:outline-none focus:ring-2 focus:ring-emerald-500
                                "
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                At least 6 characters long
                            </p>
                        </div>

                        {/* BUTTON */}
                        <button
                            type="submit"
                            className="
                                w-full bg-slate-900 text-white
                                rounded-lg py-3 text-sm font-medium
                                hover:bg-slate-800 transition
                            "
                        >
                            Create account
                        </button>
                    </form>

                    {/* LOGIN */}
                    <p className="text-center text-sm text-gray-600 mt-5">
                        Already have an account?{" "}
                        <Link
                            to="/"
                            className="text-emerald-600 font-medium hover:underline"
                        >
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
