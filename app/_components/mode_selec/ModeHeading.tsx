"use client";

import { ModeItem } from "./modeData";

interface ModeHeadingProps {
  mode: ModeItem;
}

export default function ModeHeading({ mode }: ModeHeadingProps) {
  return (
    <div className="flex flex-col items-center text-center select-none">
      {/* Category Tag */}
      <div className="flex items-center justify-center gap-3 text-[11px] sm:text-xs 2xl:text-4xl font-bold tracking-[0.25em] text-slate-500 uppercase">
        {/* Left ornament */}
        <div className="flex items-center gap-2">
          <span className="h-px w-8 sm:w-12 2xl:w-24 bg-slate-700" />
          <span className="h-2 w-2 rotate-45 bg-slate-700 2xl:h-4 2xl:w-4" />
        </div>

        <span>GAME MODES</span>

        {/* Right ornament */}
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rotate-45 bg-slate-700 2xl:h-4 2xl:w-4" />
          <span className="h-px w-8 sm:w-12 2xl:w-24 bg-slate-700" />
        </div>
      </div>
      {/* Main Title with Cyber Corner Accents */}
      <div className="relative mt-2 inline-block px-6 py-1">
        {/* Corner Accents matching mode accent color */}
        <div
          className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 transition-colors duration-600"
          style={{ borderColor: mode.accent }}
        />
        <div
          className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 transition-colors duration-600"
          style={{ borderColor: mode.accent }}
        />
        <div
          className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 transition-colors duration-600"
          style={{ borderColor: mode.accent }}
        />
        <div
          className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 transition-colors duration-600"
          style={{ borderColor: mode.accent }}
        />

        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-black uppercase tracking-wider text-slate-900 leading-none drop-shadow-sm font-sans"
          style={{
            letterSpacing: "0.06em",
          }}
        >
          {mode.heading}
        </h1>
      </div>

      {/* Badge Command */}
      <div className="mt-3">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-[#070b14] px-3.5 py-1 text-xs 2xl:text-lg font-black tracking-widest text-white shadow-md">
          <span style={{ color: mode.accent }}>&gt;_</span>
          <span>{mode.badge.toUpperCase()}</span>
        </span>
      </div>

      {/* Description */}
      <p className="mt-2.5 max-w-xl text-xs sm:text-sm 2xl:text-lg text-slate-600 leading-relaxed">
        {mode.description}
      </p>
    </div>
  );
}
