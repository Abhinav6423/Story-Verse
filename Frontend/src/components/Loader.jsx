import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1412]/80 backdrop-blur-sm">

      {/* GLOW */}
      <div className="absolute h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />

      {/* LOADER */}
      <div className="relative flex flex-col items-center gap-4">

        {/* OUTER RING */}
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-[3px] border-emerald-500/20" />
          <div className="absolute inset-0 rounded-full border-[3px] border-emerald-500 border-t-transparent animate-spin" />
        </div>

        {/* TEXT */}
        <p className="text-sm tracking-wide text-emerald-400 font-medium animate-pulse">
          Loading story...
        </p>
      </div>
    </div>
  );
};

export default Loading;
