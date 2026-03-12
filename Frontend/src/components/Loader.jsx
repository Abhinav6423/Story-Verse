import React from "react";

const Loader = ({ text = "Opening Preface..." }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0b1412] text-emerald-400">

      {/* INLINED STYLES FOR PERFORMANCE 
        (Keeps the component self-contained and prevents global CSS pollution)
      */}
      <style>{`
        .book-loader {
          --b: 26px; /* thickness */
          --c: #34d399; /* emerald-400 */
          width: 60px;
          height: 60px;
          position: relative;
        }
        .book-loader:before, .book-loader:after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--c);
          opacity: 0.15; /* Base dim pages */
          border-radius: 4px;
        }
        .book-loader:after {
          opacity: 0; /* The flipping page starts invisible */
        }
        
        .book-page {
          width: 100%;
          height: 100%;
          position: relative;
          perspective: 150px;
        }

        .book-page:before, .book-page:after {
          content: "";
          position: absolute;
          width: 50%;
          height: 100%;
          background: var(--c);
          left: 50%;
          transform-origin: left;
          animation: flip 1s infinite ease-in-out;
          border-radius: 0 4px 4px 0;
        }
        
        .book-page:after {
          /* The second page flips slightly delayed for depth */
          animation-delay: -0.5s;
          background: #10b981; /* emerald-500 (darker back) */
          opacity: 0.8; 
        }

        @keyframes flip {
          0%, 100% { transform: rotateY(0deg);  }
          50%      { transform: rotateY(-180deg); }
        }
      `}</style>

      {/* === ANIMATION CONTAINER === */}
      <div className="book-loader">
        <div className="book-page"></div>
      </div>

      {/* === TEXT WITH GRADIENT PULSE === */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <p className="text-sm font-medium tracking-[0.2em] uppercase animate-pulse text-emerald-300/80">
          {text}
        </p>

        {/* Decorative line */}
        <div className="h-[2px] w-12 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
      </div>
    </div>
  );
};

export default Loader;