"use client";

import Image from "next/image";
import { OpponentId } from "./modeData";

interface OpponentCardProps {
  id: OpponentId;
  title: string;
  description: string;
  image: string;
  isSelected: boolean;
  onSelect: () => void;
}

export default function OpponentCard({
  id,
  title,
  description,
  image,
  isSelected,
  onSelect,
}: OpponentCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={`group relative isolate block h-75 w-full overflow-hidden rounded-2xl text-left transition-all duration-200 cursor-pointer sm:h-85 lg:h-95 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-amber-400 ${
        isSelected
          ? "border-2 border-amber-400 shadow-[0_0_28px_rgba(251,191,36,0.35)] ring-1 ring-amber-400/50"
          : "border border-white/90 shadow-[0_10px_26px_rgba(0,0,0,0.10)] hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
      }`}
    >
      {/* Full-bleed artwork */}
      <Image
        src={image}
        alt={`${title} artwork`}
        fill
        sizes="(max-width: 768px) 100vw, 45vw"
        className="-z-20 select-none object-cover object-top transition-transform duration-700 group-hover:scale-105"
        draggable={false}
      />

      {/* Fade: strongest in the bottom-left where the text sits, dissolving toward the top and right */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: [
            "radial-gradient(ellipse 85% 65% at 0% 100%, rgba(255,255,255,0.97) 25%, rgba(255,255,255,0.80) 50%, rgba(255,255,255,0) 100%)",
            "linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.65) 18%, rgba(255,255,255,0) 45%)",
          ].join(", "),
        }}
      />

      {/* Gold corner brackets when selected */}
      {isSelected && (
        <>
          <span className="pointer-events-none absolute left-1.5 top-1.5 h-3 w-3 border-l-2 border-t-2 border-amber-400" />
          <span className="pointer-events-none absolute right-1.5 top-1.5 h-3 w-3 border-r-2 border-t-2 border-amber-400" />
          <span className="pointer-events-none absolute bottom-1.5 left-1.5 h-3 w-3 border-b-2 border-l-2 border-amber-400" />
          <span className="pointer-events-none absolute bottom-1.5 right-1.5 h-3 w-3 border-b-2 border-r-2 border-amber-400" />
        </>
      )}

      {/* Selection indicator (top right) */}
      <div className="absolute right-4 top-4 z-20">
        {isSelected ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-amber-500 text-white shadow-md ring-1 ring-amber-400">
            <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current" fill="none" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        ) : (
          <div className="h-8 w-8 rounded-full border-2 border-white/80 bg-white/50 shadow-inner backdrop-blur-sm" />
        )}
      </div>

      {/* Text block: bottom-left */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-4 p-5 sm:p-6">
        {/* Icon + chevron */}
        <div className="flex shrink-0 flex-col items-center">
          <div className="grid h-14 w-14 place-items-center rounded-xl bg-slate-900 text-white shadow-md sm:h-16 sm:w-16">
            {id === "pve" ? (
              <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current">
                <path d="M12 2a1 1 0 0 1 1 1v1h2a3 3 0 0 1 3 3v1h1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-1v5a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-5H5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h1V7a3 3 0 0 1 3-3h2V3a1 1 0 0 1 1-1zm-3 8a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-6 5a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H9z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-8 w-8 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
                <path d="M13 19l6-6" />
                <path d="M16 16l4 4" />
                <path d="M19 21l2-2" />
                <path d="M9.5 17.5L21 6V3h-3L6.5 14.5" />
                <path d="M11 19l-6-6" />
                <path d="M8 16l-4 4" />
                <path d="M5 21l-2-2" />
              </svg>
            )}
          </div>
          <svg viewBox="0 0 16 16" className="mt-1.5 h-4 w-4 text-slate-800" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6l4 4 4-4" />
          </svg>
        </div>

        {/* Divider */}
        <div aria-hidden className="h-16 w-px shrink-0 bg-slate-900/25 sm:h-20" />

        {/* Title + description (kept to ~70% width so the right side stays clear for the art) */}
        <div className="min-w-0 max-w-[70%]">
          <h3 className="text-3xl font-black uppercase leading-none tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-700 sm:text-sm">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}
