import React from "react";
import hero from "../../Assets/hero.png";
import person1 from "../../Assets/person1.png";
import person2 from "../../Assets/person2.png";
import phone1 from "../../Assets/phone.png";
import phone2 from "../../Assets/phone2.png";
import discoverStories from "../../Assets/discoverStories.png";
import { Flame, Pencil, User, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
    return (
        <div className="min-h-screen text-white overflow-hidden bg-[#133F31]">
            {/* HERO */}
            <div
                className="relative w-full  h-screen bg-cover bg-center overflow-hidden"
                style={{ backgroundImage: `url(${hero})` }}
            >
                {/* Navbar */}
                <nav className="flex items-center justify-between px-6 md:px-8 py-6">
                    <h1 className="text-lg font-semibold tracking-wide">
                        Story<span className="font-light">Flix</span>
                    </h1>
                    <Link to={"/register"}>
                        <button className="px-4 py-2 text-sm rounded-full bg-emerald-500/90 hover:bg-emerald-500 transition">
                            Go to app →
                        </button>
                    </Link>
                </nav>

                {/* Hero Content */}
                <section className="  flex flex-col items-center text-center px-4 sm:px-6 mt-6 md:mt-2 pb-28 md:pb-40">

                    {/* LEFT CHARACTER */}
                    <img
                        src={person1}
                        alt="Reader"
                        className="
        absolute
        -left-4 sm:left-8 lg:left-12
        bottom-36 sm:bottom-10 lg:bottom-40
        w-44 sm:w-52 lg:w-72
        opacity-90
        pointer-events-none
      "
                    />

                    {/* RIGHT CHARACTER */}
                    <img
                        src={person2}
                        alt="Writer"
                        className="
         absolute
        -right-9 sm:right-8 lg:right-12
        bottom-36 sm:bottom-10 lg:bottom-40
        w-64 sm:w-64 lg:w-72
        opacity-90
        pointer-events-none
      "
                    />

                    {/* Tag */}
                    <span className="mb-6 px-4 py-1.5 rounded-full text-xs border border-emerald-500/30">
                        Built for readers and writers
                    </span>

                    {/* Heading */}
                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif leading-tight max-w-3xl">
                        Read and write short <br />
                        stories, all in{" "}
                        <span className="italic text-emerald-400 relative">
                            one place
                            <svg
                                className="absolute -bottom-3 left-0 w-full"
                                viewBox="0 0 200 20"
                                fill="none"
                            >
                                <path
                                    d="M5 15 C40 5, 160 5, 195 15"
                                    stroke="#34d399"
                                    strokeWidth="2"
                                />
                            </svg>
                        </span>
                        .
                    </h2>

                    {/* Subheading */}
                    <p className="mt-6 max-w-xl text-gray-400 text-sm sm:text-base">
                        Discover original short stories from emerging writers, save your
                        favorites, and publish your own stories in a clean, easy-to-use
                        reading experience.
                    </p>

                    {/* CTA Buttons */}
                    <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link to={"/login"}>
                            <button className="w-full sm:w-auto px-6 py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-gray-200 transition">
                                Publish a Story →
                            </button>
                        </Link>
                        <Link to={"/login"}>
                            <button className="w-full sm:w-auto px-6 py-3 rounded-full border border-white/20 text-sm hover:bg-white/5 transition">
                                Read a Story →
                            </button>
                        </Link>
                    </div>
                </section>
            </div>


            {/* MID SECTION */}
            <section className="px-4 sm:px-6 md:px-20  ">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-14">
                    <div className="flex justify-center md:justify-end">
                        <div className="rounded-[2.5rem] md:rounded-[3rem]  md:p-6 shadow-2xl max-w-xs sm:max-w-sm md:max-w-lg w-full">
                            <img src={phone1} className="w-full h-auto" alt="Phone" />
                        </div>
                    </div>

                    <div className="text-center md:text-left max-w-md md:max-w-lg mx-auto md:mx-0">
                        <h3 className="text-3xl md:text-5xl font-serif">
                            A platform built <br />
                            around <span className="italic text-emerald-400">stories</span>.
                        </h3>
                        <p className="mt-6 text-gray-400 text-sm sm:text-base leading-relaxed">
                            A simple modern platform where short stories are easy to publish,
                            easy to discover and enjoyable to read.
                        </p>
                        <Link to={"/login"}>
                            <button className="mt-8 px-6 py-3 rounded-full bg-emerald-500/90 text-sm">
                                Explore stories →
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* BOTH SIDES */}
            <section className="px-4 sm:px-6 md:px-20 py-14 text-center">
                <h2 className="text-3xl md:text-4xl font-serif">
                    Both Sides of the <span className="italic text-emerald-400">Story</span>
                </h2>

                <div
                    className="
    mt-12 md:mt-5
     
    rounded-[2rem] md:rounded-[2.5rem]
    shadow-2xl
    overflow-hidden
    aspect-[5/5] md:aspect-auto
  "
                >
                    <img
                        src={phone2}
                        alt="Story UI"
                        className="
      w-full
      h-full
      object-cover 
      md:object-cover
    "
                    />
                </div>


                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {[
                        { icon: Flame, title: "Discover & Read" },
                        { icon: Pencil, title: "Write & Shape Your Story" },
                        { icon: User, title: "Publish & Reach Readers" }
                    ].map(({ icon: Icon, title }) => (
                        <div
                            key={title}
                            className="bg-[#0F2F25] rounded-3xl px-6 sm:px-8 py-8 md:py-10 text-center"
                        >
                            <div className="flex justify-center mb-6">
                                <div className="w-12 h-12 rounded-full bg-white text-emerald-600 flex items-center justify-center">
                                    <Icon size={22} />
                                </div>
                            </div>
                            <h4 className="font-serif font-bold text-xl sm:text-2xl mb-3">
                                {title}
                            </h4>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Built to support readers and writers with a clean, focused
                                storytelling experience.
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="px-4 sm:px-6 md:px-20 py-12  text-center" style={{ backgroundImage: `url(${discoverStories})` }} >
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif">
                    Discover stories.
                    <br />
                    <span className="italic text-emerald-400">Share yours</span>.
                </h2>
                <p className="mt-6 text-gray-400 text-sm sm:text-base">
                    Join readers and writers discovering <br />great stories every day.
                </p>
                <Link to={"/login"}>
                    <button className="mt-6 w-full sm:w-auto px-10 py-4 rounded-full bg-white text-black text-sm">
                        Go to app →
                    </button>
                </Link>
            </section>

            {/* FOOTER */}
            <footer className="px-6 md:px-20 py-14 bg-[#0A1614] border-t border-white/10">
                {/* Top (Logo + Home) */}
                <div className="flex flex-col items-center text-center">
                    <h3 className="text-3xl italic font-serif">StoryFlix</h3>
                    <p className="text-xs text-gray-400 mt-2">Home</p>
                </div>

                {/* Middle (Follow us) */}
                <div className="mt-10 flex justify-center">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>Follow us on:</span>
                        <div className="w-7 h-7 flex items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                            <Instagram size={23} />
                        </div>
                    </div>
                </div>

                {/* Bottom (Policies) */}
                <div className="mt-10 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
                    <span className="cursor-pointer hover:text-white transition">
                        Privacy policy
                    </span>
                    <span className="cursor-pointer hover:text-white transition">
                        Terms of conditions
                    </span>
                </div>
            </footer>

        </div>
    );
};

export default Landing;
