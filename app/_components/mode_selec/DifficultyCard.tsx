"use client";

import { DifficultyId } from "./modeData";

interface DifficultyCardProps {
  id: DifficultyId;
  title: string;
  description: string;
  accent: string;
  bars: number;
  isSelected: boolean;
  onSelect: () => void;
}

export default function DifficultyCard({
  title,
  description,
  accent,
  bars,
  isSelected,
  onSelect,
}: DifficultyCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={`group relative flex w-full items-center justify-between overflow-hidden rounded-2xl p-4 sm:p-5 text-left transition-all duration-200 cursor-pointer focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-amber-400 ${
        isSelected
          ? "border-2 border-amber-400 bg-white shadow-[0_0_22px_rgba(251,191,36,0.3)] ring-1 ring-amber-400/50"
          : "border border-white/90 bg-white/90 shadow-[0_6px_18px_rgba(0,0,0,0.05)] hover:border-slate-300 hover:shadow-md hover:bg-white"
      }`}
    >
      {/* Decorative Gold Corner Lines when Selected */}
      {isSelected && (
        <>
          <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-amber-400 pointer-events-none" />
          <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-amber-400 pointer-events-none" />
          <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-amber-400 pointer-events-none" />
        </>
      )}

      {/* Top Right Checkmark Badge if selected */}
      {isSelected && (
        <div className="absolute right-2.5 top-2.5 z-20">
          <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-amber-500 text-white shadow-md border border-white">
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 stroke-current"
              fill="none"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 pr-2">
        {/* Diamond Icon */}
        <div
          className="relative grid h-8 w-8 sm:h-9 sm:w-9 shrink-0 place-items-center rounded-md rotate-45 shadow-sm transition-transform duration-200 group-hover:scale-105"
          style={{ backgroundColor: accent }}
        >
          {/* Inner plus icon counter-rotated */}
          <div className="-rotate-45 text-white">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current stroke-current" strokeWidth="1">
              <path d="M12 4v16m-8-8h16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Text Content */}
        <div className="min-w-0 flex-1">
          <h4 className="text-sm sm:text-base font-black uppercase tracking-tight text-slate-900 leading-tight">
            {title}
          </h4>
          <p className="mt-0.5 text-[11px] sm:text-xs text-slate-600 leading-snug line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* 3-Bar Signal Level Indicator */}
      <div className="flex items-end gap-1 shrink-0 ml-2 self-center">
        {[1, 2, 3].map((barIndex) => {
          const isFilled = barIndex <= bars;
          const barHeight =
            barIndex === 1 ? "h-3" : barIndex === 2 ? "h-4.5" : "h-6";

          return (
            <div
              key={barIndex}
              className={`w-1.5 sm:w-2 rounded-xs transition-colors duration-200 ${barHeight} ${
                isFilled
                  ? isSelected
                    ? "bg-amber-400"
                    : "bg-slate-700"
                  : "bg-slate-200"
              }`}
            />
          );
        })}
      </div>
    </button>
  );
}
