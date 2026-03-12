import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Bookmark, Clock, ChevronRight,
  Play, LayoutList, Github, Twitter, Menu, X
} from "lucide-react";
import TownForgets from "../../Assets/TownForgets.png";
import MinuteEats from "../../Assets/MinuteEats.jpg";
import Grammar from "../../Assets/Grammar.png";
import eightMinutes from "../../Assets/eightMinutes.png";
import { Link } from 'react-router-dom'
import logo from "../../Assets/logo.png";
import Bg from "../../Assets/Bg.jpg";
// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const Landing = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Assuming exploreStories array exists in your scope...
  const exploreStories = [
    { title: "The Town that Forgets", genre: "Crime Thriller", time: "8 min read", cover: TownForgets },
    { title: "The Minute that eats itself", genre: "Horror", time: "11 min read", cover: MinuteEats },
    { title: "The Grammar of Dissapearing", genre: "Psychological", time: "9 min read", cover: Grammar },
    { title: "Eight Minutes", genre: "Sci-Fi", time: "12 min read", cover: eightMinutes },
  ];

  return (
    <div className="min-h-screen bg-[#020604] text-white font-sans overflow-x-hidden selection:bg-emerald-500/30 selection:text-white">

      {/* ================= NAVBAR ================= */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#020604]/90 backdrop-blur-xl py-3 md:py-4 border-b border-white/5 shadow-2xl' : 'bg-transparent py-4 md:py-6'} px-4 sm:px-6 md:px-12`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3 group cursor-pointer z-50">
            <img src={logo} alt="logo" className="w-12 md:w-19" />

          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#explore" className="text-white/60 hover:text-white transition">Explore</a>
            <a href="#library" className="text-white/60 hover:text-white transition">Library</a>
            <Link to='/login'>
              <button className="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-colors">
                Sign In
              </button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden z-50 cursor-pointer text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-[#020604] border-b border-white/10 p-6 flex flex-col gap-6 shadow-2xl md:hidden"
            >
              <a href="#explore" onClick={() => setMenuOpen(false)} className="text-lg font-medium text-white/80 hover:text-emerald-400">Explore</a>
              <a href="#library" onClick={() => setMenuOpen(false)} className="text-lg font-medium text-white/80 hover:text-emerald-400">Library</a>
              <Link to={'/login'}>
                <button className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors">
                  Sign In
                </button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ================= HERO ================= */}

      <header className="relative min-h-[75svh] md:min-h-[80vh] lg:min-h-[100vh] flex items-center px-4 sm:px-6 md:px-10 lg:px-12 pt-24 md:pt-0 overflow-hidden bg-[#02060463]">

        {/* ===== Book Cover Background ===== */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <img
            src={Bg}
            alt="Story Covers Background"
            className="w-full h-full object-cover opacity-70 md:opacity-100 blur-[1px] brightness-100"
          />
        </div>

        {/* Glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-emerald-600/20 blur-[120px] md:blur-[150px] rounded-full pointer-events-none z-0"></div>

        {/* ===== Netflix-Style Cinematic Overlays ===== */}
        {/* 1. Strong fade from Left to Right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#020604] via-[#020604]/50 to-transparent z-0" />
        {/* 2. Seamless fade from Bottom to Top (blends section into the rest of the page) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020604] via-[#020604]/40 to-transparent z-0" />

        {/* ===== Hero Content ===== */}
        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col justify-center items-start mt-8 md:mt-0">

          {/* The Content Block - Takes 100% on mobile, 75% on tablet, 60% on desktop */}
          <div className="w-full max-w-[100%] sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl flex flex-col items-start text-left">

            <motion.h1
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-medium leading-[1.05] tracking-tight mb-4 md:mb-6"
            >
              Stories that <br className="hidden sm:block" />
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 drop-shadow-lg">
                stay with you.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/70 max-w-[90%] md:max-w-[85%] mb-8 md:mb-10 font-light leading-relaxed"
            >
              Finish a story in one sitting.
              Remember it forever.
              <br />
              <span className="text-emerald-700 font-bold">10,000+</span> readers discovering stories every week
            </motion.p>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pr-4 sm:pr-0"
            >
              <Link to={'/login'}>
                <button className="w-full sm:w-auto px-8 md:px-10 py-4 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 font-bold text-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                  Start Reading <ChevronRight size={20} />
                </button>
              </Link>

              <Link to={'/register'}>
                <button className="w-full sm:w-auto px-8 md:px-10 py-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-md text-lg font-medium text-white/90">
                  Explore Stories
                </button>
              </Link>
            </motion.div>

          </div>
        </div>
      </header>

      {/* ================= MICRO STORY ================= */}
      <section className="py-20 md:py-32 relative flex justify-center px-4 sm:px-6 border-y border-white/5 bg-[#030A06]">
        <div className="max-w-3xl text-center">

          <BookOpen className="mx-auto text-emerald-500/40 mb-6 md:mb-8 w-8 h-8 md:w-10 md:h-10 drop-shadow-md" />

          <blockquote className="font-serif text-xl sm:text-2xl md:text-4xl italic text-white/90 mb-6 md:mb-8 leading-relaxed">
            "At 3:17 AM, Aarav Kapoor’s phone buzzed in the dark. The message was simple: YOU FORGOT WHAT YOU DID. He stared at the sender’s number for a long time. It was his own."
          </blockquote>

          {/* ===== STORY TITLE SECTION ===== */}
          <div className="flex flex-col items-center justify-center gap-2 mb-8 md:mb-10">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent mb-2"></div>
            <span className="text-xs md:text-xs font-bold tracking-[0.3em] uppercase text-emerald-400/70">
              Featured Story
            </span>
            <h3 className="font-serif text-lg md:text-2xl text-white/95 tracking-wide drop-shadow-lg">
              You Forgot What You Did
            </h3>
          </div>

          <Link to={'/login'}>
            <button className="text-sm md:text-base font-bold tracking-widest uppercase text-teal-400 hover:text-teal-300 flex items-center justify-center gap-2 mx-auto transition-colors group">
              Read this story <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>

        </div>
      </section>

      {/* ================= STORIES GRID ================= */}
      <section id="explore" className="py-20 md:py-32 px-4 sm:px-6 md:px-12 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center md:text-left mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-3 md:mb-4">Trending Now</h2>
            <p className="text-white/50 text-sm md:text-base">Immerse yourself in our most captivating reads.</p>
          </div>

          {/* Responsive Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {exploreStories.map((story, i) => (
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp} custom={i} key={i}
                className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-[4/5] sm:aspect-[2/3] bg-[#050F0A] shadow-xl"
              >
                <img
                  src={story.cover}
                  alt={story.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 md:opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020604] via-[#020604]/50 to-transparent" />

                <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end transform transition-transform duration-300 md:group-hover:-translate-y-2">
                  <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-teal-400 mb-2">
                    {story.genre}
                  </p>
                  <h3 className="font-serif text-xl md:text-2xl font-bold mb-2 md:mb-3 leading-tight text-white drop-shadow-md">
                    {story.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs md:text-sm text-white/70 mb-4 md:mb-5">
                    <Clock size={14} /> {story.time}
                  </div>

                  {/* Button stays visible on mobile, reveals on hover on desktop */}
                  <div className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 md:absolute md:bottom-6 md:left-6 md:right-6 md:translate-y-4 md:group-hover:translate-y-0 relative bottom-0">
                    <Link to={'/login'}>
                      <button className="w-full py-3 rounded-lg bg-white text-black font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                        <Play size={14} className="fill-black" /> Read Story
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-20 md:py-32 px-4 sm:px-6 md:px-12 bg-[#030A06] border-y border-white/5 relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-teal-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-[#050F0A] p-6 md:p-8 rounded-2xl border border-white/5">
            <LayoutList className="text-emerald-400 mb-4 md:mb-6 w-8 h-8 md:w-10 md:h-10" />
            <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">Chapter Navigation</h3>
            <p className="text-white/60 text-sm md:text-base leading-relaxed">
              Stories are seamlessly divided. Jump between chapters with a clean, unobtrusive index.
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-[#050F0A] p-6 md:p-8 rounded-2xl border border-white/5">
            <BookOpen className="text-teal-400 mb-4 md:mb-6 w-8 h-8 md:w-10 md:h-10" />
            <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">Smooth Typography</h3>
            <p className="text-white/60 text-sm md:text-base leading-relaxed">
              Large, highly readable typography combined with a distraction-free cinematic layout.
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-[#050F0A] p-6 md:p-8 rounded-2xl border border-white/5 sm:col-span-2 md:col-span-1">
            <Bookmark className="text-emerald-400 mb-4 md:mb-6 w-8 h-8 md:w-10 md:h-10" />
            <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">Your Library</h3>
            <p className="text-white/60 text-sm md:text-base leading-relaxed">
              Never lose a great story. Save favorites and pick up exactly where you left off.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="relative py-24 md:py-40 text-center px-4 sm:px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-[radial-gradient(circle,_rgba(16,185,129,0.1)_0%,_transparent_60%)] pointer-events-none"></div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="relative z-10">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold mb-6 md:mb-10 leading-tight">
            Your next favorite <br className="hidden sm:block" />
            <span className="italic text-emerald-400">story is waiting.</span>
          </h2>
          <Link to="/register">
            <button className="w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-lg md:text-xl font-bold hover:scale-105 transition-transform shadow-[0_0_40px_rgba(16,185,129,0.3)]">
              Start Reading Free
            </button>
          </Link>
        </motion.div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#010302] py-12 md:py-16 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0">

          <div className="flex items-center gap-2 opacity-60">
            <BookOpen size={20} md:size={24} />
            <span className="font-serif text-lg md:text-xl font-bold tracking-widest">PREFACE</span>
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm text-white/40">
            <a href="#explore" className="hover:text-emerald-400 transition-colors">Explore</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">About</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms</a>
          </div>

          <div className="flex gap-5 text-white/40">
            <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
            <a href="https://github.com/Abhinav6423/Story-Verse" target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><Github size={20} /></a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-10 md:mt-12 text-center text-xs text-white/30 pt-8 border-t border-white/5">
          <p>Designed & Built by Abhinav Pandey.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;