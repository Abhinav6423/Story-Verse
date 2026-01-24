import React from "react";
import { Link } from "react-router-dom";
import { Flame, Pencil, User, Instagram, BookOpen } from "lucide-react";

// Assets
import hero from "../../Assets/hero.png";
import person1 from "../../Assets/person1.png";
import person2 from "../../Assets/person2.png";
import phone1 from "../../Assets/phone.png";
import phone2 from "../../Assets/phone2.png";
import discoverStories from "../../Assets/discoverStories.png";
import logo from "../../Assets/logo.png";
import phone2Small from "../../Assets/phone2small.png";

const Landing = () => {
    return (
        <div className="min-h-screen text-white bg-[#133F31] font-sans overflow-x-hidden selection:bg-emerald-500/30">

            {/* ================= HERO SECTION ================= */}
            <header
                className="relative w-full min-h-screen bg-cover bg-center flex flex-col overflow-hidden"
                style={{ backgroundImage: `url(${hero})` }}
            >
                {/* Navbar */}
                <nav className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 py-6 flex items-center justify-between z-50">
                    <img src={logo} alt="StoryFlix Logo" className="w-24 sm:w-28 md:w-32 object-contain" />
                    <Link to="/register">
                        <button className="px-5 py-2.5 text-sm font-medium rounded-full bg-emerald-500 hover:bg-emerald-400 text-white transition-all shadow-lg shadow-emerald-900/20 active:scale-95">
                            Go to app →
                        </button>
                    </Link>
                </nav>

                {/* Hero Content Wrapper */}
                <div className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-20 pb-20 pt-10">

                    {/* Badge */}
                    <span className="
                        inline-block mb-6 px-4 py-1.5 rounded-full 
                        bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-sm
                        text-xs sm:text-sm font-medium text-emerald-100 tracking-wide
                        animate-in fade-in slide-in-from-top-4 duration-700
                    ">
                        Built for readers and writers
                    </span>

                    {/* Headline */}
                    <h1 className="
                        text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 
                        font-serif font-medium leading-[1.1] tracking-tight
                        max-w-4xl mx-auto drop-shadow-lg
                        animate-in fade-in zoom-in-95 duration-700 delay-100
                    ">
                        Read and write short <br className="hidden sm:block" />
                        stories, all in{" "}
                        <span className="relative whitespace-nowrap text-emerald-400 italic">
                            one place
                            {/* Underline SVG */}
                            <svg className="absolute -bottom-2 sm:-bottom-4 left-0 w-full h-3 sm:h-4 text-emerald-500" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00025 7.00005C55.0347 2.3855 136.219 -3.07847 197.999 5.00005" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
                        </span>.
                    </h1>

                    {/* Subhead */}
                    <p className="
                        mt-6 sm:mt-8 max-w-xl mx-auto 
                        text-gray-200 text-base sm:text-lg md:text-xl leading-relaxed font-light
                        animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200
                        drop-shadow-md
                    ">
                        Discover original short stories from emerging writers, save your favorites, and publish your own in a clean, focused space.
                    </p>

                    {/* Buttons */}
                    <div className="
                        mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto
                        animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300
                    ">
                        <Link to="/login" className="w-full sm:w-auto">
                            <button className="w-full px-8 py-3.5 rounded-full bg-white text-[#133F31] font-semibold hover:bg-gray-100 transition shadow-xl active:scale-95">
                                Publish a Story
                            </button>
                        </Link>
                        <Link to="/login" className="w-full sm:w-auto">
                            <button className="w-full px-8 py-3.5 rounded-full border border-white/30 hover:bg-white/10 backdrop-blur-sm transition active:scale-95">
                                Read Stories
                            </button>
                        </Link>
                    </div>
                </div>

                {/* --- RESPONSIVE GRAPHICS (Hidden on Mobile/Tab, Visible on Desktop) --- */}

                {/* Left Character (Reader) */}
                <img
                    src={person1}
                    alt="Reader"
                    className="
                        hidden lg:block 
                        absolute bottom-45 lg:bottom-60 left-0 xl:left-10
                        w-64 xl:w-80 2xl:w-96
                        opacity-90 z-0
                        pointer-events-none select-none
                        animate-in fade-in slide-in-from-left-8 duration-1000
                    "
                />

                {/* Right Character (Writer) */}
                <img
                    src={person2}
                    alt="Writer"
                    className="
                        hidden lg:block 
                        absolute bottom-45 lg:bottom-60 right-0 xl:right-10
                        w-64 xl:w-80 2xl:w-96
                        opacity-90 z-0
                        pointer-events-none select-none
                        animate-in fade-in slide-in-from-right-8 duration-1000
                    "
                />

                {/* Gradient Fade at bottom */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#133F31] via-[#133F31]/80 to-transparent pointer-events-none z-10" />
            </header>


            {/* ================= FEATURE: PLATFORM ================= */}
            <section className="py-20 lg:py-32 px-6 relative overflow-hidden bg-[#133F31]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Phone Image */}
                    <div className="relative order-2 md:order-1 flex justify-center md:justify-end group">
                        <div className="absolute inset-0 bg-emerald-500/20 blur-[80px] rounded-full pointer-events-none" />
                        <img
                            src={phone1}
                            alt="Mobile App Interface"
                            loading="lazy"
                            className="
                                relative z-10 w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[450px] 
                                drop-shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]
                            "
                        />
                    </div>

                    {/* Text Content */}
                    <div className="text-center md:text-left order-1 md:order-2">
                        <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-2xl mb-6 text-emerald-400">
                            <BookOpen size={32} />
                        </div>
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif leading-tight">
                            A platform built <br />
                            around <span className="italic text-emerald-400">stories</span>.
                        </h2>
                        <p className="mt-6 text-lg text-gray-300 max-w-md mx-auto md:mx-0 leading-relaxed">
                            A simple modern platform where short stories are easy to publish, easy to discover, and enjoyable to read on any device.
                        </p>
                        <Link to="/login" className="inline-block mt-8">
                            <button className="px-8 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition shadow-lg shadow-emerald-900/30">
                                Explore stories →
                            </button>
                        </Link>
                    </div>
                </div>
            </section>


            {/* ================= FEATURE: DUAL UI ================= */}
            <section className="py-20 bg-[#0F2F25]/50 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-12">
                        Both Sides of the <span className="italic text-emerald-400">Story</span>
                    </h2>

                    {/* Dual Device Showcase */}
                    <div className="relative max-w-5xl mx-auto mb-20 group">
                        {/* Desktop Image */}
                        <img
                            src={phone2}
                            alt="Desktop Interface"
                            loading="lazy"
                            className="hidden md:block w-full rounded-2xl shadow-2xl border border-white/5 transition-transform duration-500 group-hover:scale-[1.01]"
                        />
                        {/* Mobile Image (Small Screens) */}
                        <img
                            src={phone2Small}
                            alt="Mobile Interface"
                            loading="lazy"
                            className="block md:hidden w-full rounded-[2rem] shadow-2xl border border-white/5"
                        />
                    </div>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        {[
                            { icon: Flame, title: "Discover & Read", desc: "Find trending stories curated just for you." },
                            { icon: Pencil, title: "Write & Shape", desc: "Powerful editor tools to bring your ideas to life." },
                            { icon: User, title: "Publish & Grow", desc: "Build an audience and get feedback instantly." }
                        ].map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="bg-[#133F31] border border-white/5 rounded-3xl p-8 hover:bg-[#1a4f3e] transition duration-300 group">
                                <div className="w-14 h-14 mx-auto bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                    <Icon size={28} />
                                </div>
                                <h4 className="font-serif font-bold text-xl mb-3 text-white">{title}</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* ================= FINAL CTA ================= */}
            <section
                className="relative py-24 md:py-32 px-6 text-center bg-cover bg-center flex flex-col items-center justify-center border-t border-white/5"
                style={{ backgroundImage: `url(${discoverStories})` }}
            >
                {/* Overlay for readability */}
                <div className="absolute inset-0 bg-[#0A1614]/70 backdrop-blur-[2px]" />

                <div className="relative z-10 max-w-3xl">
                    <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif leading-tight mb-6">
                        Discover stories. <br />
                        <span className="italic text-emerald-400">Share yours</span>.
                    </h2>
                    <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-xl mx-auto">
                        Join thousands of readers and writers shaping new worlds every day.
                    </p>
                    <Link to="/login">
                        <button className="px-10 py-4 rounded-full bg-white text-[#0A1614] text-lg font-bold hover:bg-gray-100 transition shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95">
                            Get Started Now →
                        </button>
                    </Link>
                </div>
            </section>


            {/* ================= FOOTER ================= */}
            <footer className="bg-[#0A1614] border-t border-white/10 pt-16 pb-8 px-6">
                <div className="max-w-7xl mx-auto flex flex-col items-center">

                    {/* Brand */}
                    <div className="mb-8 text-center">
                        <h3 className="text-3xl font-serif italic tracking-wide text-white">StoryFlix</h3>
                        <p className="text-sm text-gray-500 mt-2">Where stories live.</p>
                    </div>

                    {/* Socials */}
                    <div className="flex gap-4 mb-12">
                        <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-emerald-500 hover:text-white text-gray-400 transition-all">
                            <Instagram size={20} />
                        </a>
                    </div>

                    {/* Links */}
                    <div className="w-full flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 border-t border-white/5 pt-8 gap-4">
                        <p>&copy; {new Date().getFullYear()} StoryFlix. All rights reserved.</p>
                        <div className="flex gap-6">
                            <Link to="#" className="hover:text-emerald-400 transition">Privacy Policy</Link>
                            <Link to="#" className="hover:text-emerald-400 transition">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;