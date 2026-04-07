import { Link } from "react-router-dom";

export default function StoryReelCard({ reel }) {
    return (
        <Link
            to={`/storeel/${reel._id}`}
            className="relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer group shrink-0 snap-center bg-[#050505] block shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(16,185,129,0.2)] ring-1 ring-white/5 hover:ring-emerald-500/40
            w-[28vw]
            sm:w-[22vw]
            md:w-[18vw]
            lg:w-[15vw]
            xl:w-[13vw]
            2xl:w-[11vw]
            max-w-[220px]
            min-w-[100px]"
        >
            {/* Background Image */}
            <img
                src={reel.reelCover}
                alt={reel.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover brightness-100 transition-all duration-700 group-hover:scale-105 group-hover:brightness-100"
            />

            {/* Top vignette */}
            {/* <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent pointer-events-none" /> */}

            {/* Bottom vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent pointer-events-none" />

            {/* Trailer Badge */}
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center gap-1 z-10">
                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_#10b981] animate-pulse" />
                <span className="text-[7px] sm:text-[8px] font-bold text-white uppercase tracking-widest opacity-90">Trailer</span>
            </div>

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="flex items-center justify-center
                    w-[18%] aspect-square
                    rounded-full bg-white/10 backdrop-blur-md border border-white/20
                    transition-all duration-400
                    group-hover:scale-125 group-hover:bg-emerald-500/25 group-hover:border-emerald-400/70 group-hover:shadow-[0_0_18px_rgba(16,185,129,0.45)]">
                    <svg xmlns="http://www.w3.org/2000/svg"
                        className="w-[45%] h-[45%] text-white group-hover:text-emerald-300 ml-[8%] transition-colors duration-300"
                        fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </div>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 w-full px-[8%] py-[6%] flex flex-col gap-0.5 z-10 transform transition-transform duration-500 group-hover:-translate-y-1">
                <div className="w-[20%] h-[2px] bg-emerald-400 rounded-full mb-1 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-75 shadow-[0_0_6px_#34d399]" />
                <h3 className="text-white font-semibold leading-tight line-clamp-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-[2.5vw] sm:text-[1.8vw] md:text-[1.4vw] lg:text-[1.1vw] xl:text-[1vw]">
                    {reel.title}
                </h3>
            </div>
        </Link>
    );
}