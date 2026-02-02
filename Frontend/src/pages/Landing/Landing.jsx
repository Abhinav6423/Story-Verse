import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  BookOpen, Feather, Heart, Bookmark, 
  Sparkles, Layers, Shield, Zap, Github, ArrowRight, Menu, X
} from "lucide-react";

// Assets
import phone1 from "../../Assets/person1.png";   
import phone2 from "../../Assets/phone2.png";
import logo from "../../Assets/logo.png";
import discoverStories from "../../Assets/discoverStories.png";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const Landing = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Responsive Check
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    handleResize(); // Init
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // CONFIG: Hero Fan Cards
  // We dynamically adjust 'x' and 'rotate' based on screen size
  const getCardConfig = (side, index) => {
    const isLeft = side === "left";
    const dir = isLeft ? -1 : 1;

    // Spacing multipliers
    let xStep = 140; // Desktop default
    let rotStep = 12; // Desktop rotation

    if (isTablet) {
      xStep = 100;
      rotStep = 10;
    } else if (isMobile) {
      xStep = 55; // Tighter on mobile
      rotStep = 8;
    }

    // Positions: Inner (idx 0) -> Outer (idx 2)
    // We want the inner cards closer to 0
    const xBase = (index + 1) * xStep * dir;
    const rotBase = (index + 1) * rotStep * dir;
    const yBase = (index + 1) * (isMobile ? 15 : 40); // Cascading down effect

    return { x: xBase, y: yBase, rotate: rotBase };
  };

  const leftCards = [
    { title: "Abyss", genre: "Horror", color: "from-slate-900 to-black", delay: 0.1 }, 
    { title: "Last Echo", genre: "Sci-Fi", color: "from-emerald-900 to-gray-900", delay: 0.2 },
    { title: "Velvet", genre: "Romance", color: "from-emerald-700 to-green-900", delay: 0.3 },
  ];

  const rightCards = [
    { title: "Neon City", genre: "Cyberpunk", color: "from-teal-900 to-cyan-950", delay: 0.3 },
    { title: "Woods", genre: "Fantasy", color: "from-green-800 to-emerald-950", delay: 0.2 },
    { title: "Solaris", genre: "Space", color: "from-emerald-600 to-teal-900", delay: 0.1 },
  ];

  return (
    <div className="min-h-screen bg-[#020504] text-white font-sans overflow-x-hidden selection:bg-emerald-500/30">
      
      {/* ================= NAVBAR ================= */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#020504]/80 backdrop-blur-xl border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Preface Logo" className="w-8 h-8 md:w-9 md:h-9 object-contain" />
            <span className="font-serif text-xl md:text-2xl font-bold tracking-tight text-white">Preface</span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
             <a href="https://github.com/Abhinav6423/Story-Verse" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition">
                <Github size={18} />
                <span>Star on GitHub</span>
             </a>
             <div className="h-6 w-[1px] bg-white/10"></div>
             <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition">
                Log In
             </Link>
             <Link to="/register">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                >
                  Start Writing
                </motion.button>
             </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
             {menuOpen ? <X /> : <Menu />}
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {menuOpen && (
           <motion.div 
             initial={{ opacity: 0, height: 0 }}
             animate={{ opacity: 1, height: "auto" }}
             className="md:hidden bg-[#020504] border-b border-white/10 overflow-hidden"
           >
              <div className="flex flex-col p-6 gap-4">
                  <Link to="/login" className="text-gray-300">Log In</Link>
                  <Link to="/register" className="text-emerald-400 font-bold">Start Writing</Link>
                  <a href="https://github.com" className="text-gray-400 text-sm">GitHub</a>
              </div>
           </motion.div>
        )}
      </motion.nav>

      {/* ================= HERO SECTION (STORY UNIVERSE) ================= */}
      <header className="relative pt-32 md:pt-44 pb-24 px-4 md:px-6 overflow-hidden flex flex-col items-center text-center">
        
        {/* Animated Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: "spring" }}
          className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6 md:mb-8"
        >
          <Sparkles size={12} className="text-emerald-400 animate-pulse" /> 
          The Story Universe Platform
        </motion.div>

        {/* Headline */}
        <motion.h1 
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="text-4xl md:text-7xl lg:text-8xl font-serif font-medium leading-[1.1] mb-6 md:mb-8 relative z-20 max-w-5xl"
        >
          Your personal universe <br />
          of <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200">
            short fiction
          </span>.
        </motion.h1>

        {/* Subhead */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-base md:text-lg text-gray-400 max-w-xl md:max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed relative z-20"
        >
          A clean, focused alternative to cluttered platforms. 
          Preface helps indie creators publish stories and readers curate 
          personal collections—distraction free.
        </motion.p>

        {/* Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 mb-20 md:mb-32 relative z-20 w-full sm:w-auto px-4"
        >
          <Link to="/register" className="w-full sm:w-auto">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-[#020504] font-bold text-lg hover:bg-gray-100 transition shadow-[0_0_40px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2"
            >
              <Feather size={20} /> Create a Story
            </motion.button>
          </Link>
          <a href="#features" className="w-full sm:w-auto">
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/10 text-gray-300 backdrop-blur-sm transition font-medium"
            >
              Explore Features
            </motion.button>
          </a>
        </motion.div>

        {/* --- HERO ANIMATION: THE FULLER FAN --- */}
        <div className="relative w-full max-w-[1400px] h-[400px] md:h-[700px] flex justify-center items-center perspective-[1000px]">
            
            {/* Left Cards (3 Layers) */}
            {leftCards.slice(0).reverse().map((card, i) => { // Reverse so inner renders last (on top)
                const index = leftCards.length - 1 - i;
                const config = getCardConfig("left", index);
                return (
                  <motion.div
                    key={`left-${i}`}
                    initial={{ x: 0, rotate: 0, opacity: 0, scale: 0.8 }}
                    animate={{ x: config.x, rotate: config.rotate, opacity: 1, scale: 1 }}
                    transition={{ delay: card.delay, duration: 1.2, type: "spring", stiffness: 40 }}
                    className={`
                      absolute 
                      top-16 md:top-32
                      w-28 h-44 md:w-48 md:h-80 lg:w-56 lg:h-96 
                      rounded-xl md:rounded-2xl 
                      bg-gradient-to-br ${card.color}
                      shadow-2xl border border-white/5
                      flex flex-col justify-end p-3 md:p-5 origin-bottom-right
                    `}
                    style={{ zIndex: 10 - index }}
                  >
                    <BookOpen className="mb-auto opacity-40 text-emerald-200 w-4 h-4 md:w-6 md:h-6" />
                    <h4 className="font-serif font-bold text-sm md:text-xl text-white leading-tight">{card.title}</h4>
                    <p className="text-[8px] md:text-[10px] text-white/50 uppercase tracking-widest mt-1 md:mt-2">{card.genre}</p>
                  </motion.div>
                );
            })}

            {/* Right Cards (3 Layers) */}
            {rightCards.map((card, i) => {
                const config = getCardConfig("right", i);
                return (
                  <motion.div
                    key={`right-${i}`}
                    initial={{ x: 0, rotate: 0, opacity: 0, scale: 0.8 }}
                    animate={{ x: config.x, rotate: config.rotate, opacity: 1, scale: 1 }}
                    transition={{ delay: card.delay, duration: 1.2, type: "spring", stiffness: 40 }}
                    className={`
                      absolute 
                      top-16 md:top-32
                      w-28 h-44 md:w-48 md:h-80 lg:w-56 lg:h-96 
                      rounded-xl md:rounded-2xl 
                      bg-gradient-to-br ${card.color}
                      shadow-2xl border border-white/5
                      flex flex-col justify-end p-3 md:p-5 origin-bottom-left
                    `}
                    style={{ zIndex: 10 - i }} 
                  >
                    <Layers className="mb-auto opacity-40 text-emerald-200 w-4 h-4 md:w-6 md:h-6" />
                    <h4 className="font-serif font-bold text-sm md:text-xl text-white leading-tight">{card.title}</h4>
                    <p className="text-[8px] md:text-[10px] text-white/50 uppercase tracking-widest mt-1 md:mt-2">{card.genre}</p>
                  </motion.div>
                );
            })}

            {/* Central Phone - LARGE & RESPONSIVE */}
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="relative z-20 mt-10 md:mt-0"
            >
               <motion.div
                  animate={{ y: [-15, 15, -15] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
               >
                  <div className="absolute inset-0 bg-emerald-500/20 blur-[60px] md:blur-[120px] rounded-full -z-10"></div>
                  
                  <img 
                    src={phone1} 
                    alt="Preface Mobile App" 
                    className="
                      w-[240px] md:w-[480px] lg:w-[550px] 
                      drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] md:drop-shadow-[0_30px_60px_rgba(0,0,0,0.9)] 
                      rounded-[2rem] md:rounded-[3.5rem]
                      
                    "
                  />
               </motion.div>
            </motion.div>
        </div>
      </header>

      {/* ================= DIVIDER ================= */}
      <div className="relative z-20 -mt-20 h-24 md:h-40 w-full bg-gradient-to-t from-[#051210] to-transparent pointer-events-none"></div>

      {/* ================= PROBLEM / SOLUTION GRID ================= */}
      <section id="features" className="py-20 md:py-24 bg-[#051210] relative px-4 md:px-6">
         <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="max-w-7xl mx-auto"
         >
            <div className="text-center mb-16 md:mb-20">
               <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-serif mb-4 md:mb-6">Designed for Focus.</motion.h2>
               <motion.p variants={fadeInUp} className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
                  Traditional platforms are noisy and cluttered. Preface is built for ownership and clarity.
               </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {/* Card 1 */}
               <motion.div 
                 variants={fadeInUp}
                 whileHover={{ y: -10, transition: { duration: 0.3 } }}
                 className="bg-[#0A1F1B] p-6 md:p-8 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-all group"
               >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6">
                     <Feather size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">For Writers</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                     No more fighting algorithms. Create your personal story universe with a clean editor.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-2">
                     <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>Clean Editor</li>
                     <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>Draft → Publish</li>
                  </ul>
               </motion.div>

               {/* Card 2 */}
               <motion.div 
                 variants={fadeInUp}
                 whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.3 } }}
                 className="bg-[#0E2A25] p-6 md:p-8 rounded-3xl border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)] relative overflow-hidden"
               >
                  <div className="absolute top-0 right-0 p-4 opacity-20">
                     <Sparkles size={80} className="text-emerald-400 animate-pulse" />
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white mb-6">
                     <BookOpen size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">For Readers</h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                     Experience distraction-free reading. Curate your own library with collections.
                  </p>
                  <ul className="text-sm text-gray-400 space-y-2">
                     <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-white rounded-full"></div>No Ads</li>
                     <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-white rounded-full"></div>Personal Collections</li>
                  </ul>
               </motion.div>

               {/* Card 3 */}
               <motion.div 
                 variants={fadeInUp}
                 whileHover={{ y: -10, transition: { duration: 0.3 } }}
                 className="bg-[#0A1F1B] p-6 md:p-8 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-all group"
               >
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6">
                     <Shield size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">Secure & Modern</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                     Built on a robust MERN stack with JWT authentication. Scalable and secure.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-2">
                     <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>JWT Auth</li>
                     <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>Fast Performance</li>
                  </ul>
               </motion.div>
            </div>
         </motion.div>
      </section>

      {/* ================= VISUAL SHOWCASE ================= */}
      <section className="py-24 md:py-32 px-6 bg-[#020504] relative">
         <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16"
         >
            <div className="md:w-1/2">
               <div className="inline-block p-3 rounded-2xl bg-white/5 mb-6 border border-white/10">
                  <Layers className="text-emerald-400" size={24} />
               </div>
               <h2 className="text-3xl md:text-5xl font-serif mb-6 leading-tight">
                  Organize your <br/> <span className="text-emerald-400 italic">Story Universe.</span>
               </h2>
               <p className="text-base md:text-lg text-gray-400 mb-8 leading-relaxed">
                  Preface isn't just for reading—it's for collecting. 
                  Create custom lists, track what you've read, and build a library that reflects your taste.
               </p>
               
               <div className="flex flex-col gap-4">
                  {[
                     { icon: Heart, text: "Like and appreciate indie creators" },
                     { icon: Bookmark, text: "Save stories for later offline reading" },
                     { icon: Zap, text: "Instant load times with optimized React UI" }
                  ].map((item, i) => (
                     <motion.div 
                        whileHover={{ x: 10 }}
                        key={i} 
                        className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-emerald-500/10 transition-colors cursor-default"
                     >
                        <item.icon className="text-emerald-400" size={20} />
                        <span className="text-sm font-medium text-gray-300">{item.text}</span>
                     </motion.div>
                  ))}
               </div>
            </div>

            <div className="md:w-1/2 relative w-full">
               <div className="absolute inset-0 bg-emerald-500/20 blur-[120px] rounded-full"></div>
               <motion.img 
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.5 }}
                  src={phone2} 
                  alt="Preface Web Dashboard" 
                  className="relative z-10 w-full rounded-xl shadow-2xl border border-white/10"
               />
            </div>
         </motion.div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="relative py-24 md:py-32 flex items-center justify-center text-center px-6 overflow-hidden bg-[#020504]">
        <div className="absolute inset-0 z-0 opacity-20 mix-blend-screen">
            <img src={discoverStories} alt="Background" className="w-full h-full object-cover grayscale" />
        </div>
        <div className="absolute inset-0 bg-gradient-radial from-[#020504]/50 to-[#020504] z-10"></div>

        <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="relative z-20 max-w-3xl"
        >
            <h2 className="text-4xl md:text-7xl font-serif mb-8 text-white">
                Stories shape how <br/>
                <span className="italic text-emerald-500">humans think.</span>
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <Link to="/register" className="w-full sm:w-auto">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-12 py-5 rounded-full bg-emerald-600 text-white text-lg font-bold hover:bg-emerald-500 transition shadow-[0_0_30px_rgba(16,185,129,0.3)] w-full sm:w-auto"
                  >
                        Join the Beta
                  </motion.button>
               </Link>
               <a href="https://preface.vercel.app" target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                  <motion.button 
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
                    whileTap={{ scale: 0.95 }}
                    className="px-12 py-5 rounded-full border border-white/10 text-white text-lg font-medium backdrop-blur-sm transition w-full sm:w-auto"
                  >
                        View Live Demo
                  </motion.button>
               </a>
            </div>
        </motion.div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#010302] pt-20 pb-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 md:gap-0">
               <div className="flex items-center gap-3">
                  <img src={logo} alt="logo" className="w-10 h-10 opacity-80" />
                  <span className="font-serif text-3xl font-bold tracking-tight text-white">Preface</span>
               </div>
               <div className="flex gap-6 text-sm text-gray-500">
                  <a href="#" className="hover:text-emerald-400 transition">About</a>
                  <a href="#" className="hover:text-emerald-400 transition">GitHub</a>
                  <a href="#" className="hover:text-emerald-400 transition">Privacy</a>
               </div>
            </div>

            <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
               <p>© 2026 Preface. Built by Abhinav Pandey.</p>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span>Systems Operational</span>
               </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;