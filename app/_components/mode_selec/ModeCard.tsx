
"use client";

import Image from "next/image";
import { ReactNode } from "react";

interface Props {
  title: string;
  badge: string;
  description: string;
  tags: string[];
  image: string;
  accent: string;
  icon: ReactNode;
  tilt?: number;
  onSelect: () => void;
  onInfo: () => void;
}

const CLIP =
  "polygon(18px 0, calc(100% - 18px) 0, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0 calc(100% - 18px), 0 18px)";

export default function ModeCard({
  title,
  badge,
  description,
  tags = [],
  image,
  accent = "#22c55e",
  icon,
  tilt = 0,
  onSelect,
  onInfo,
}: Props) {
  const tint = (pct: number) =>
    `color-mix(in srgb, ${accent} ${pct}%, transparent)`;

  return (
    <article
      className="group relative flex h-full w-full min-w-0 flex-col transition-transform duration-300 ease-out hover:-translate-y-2"
      style={{
        filter: `drop-shadow(0 0 14px ${tint(25)}) drop-shadow(0 14px 24px rgba(15,23,42,0.12))`,
      }}
    >
      {/* Tilt wrapper keeps hover movement independent of rotation */}
      <div
        className="flex h-full w-full flex-1 flex-col"
        style={{
          transform: `rotate(${tilt}deg)`,
        }}
      >
        {/* Neon border */}
        <div
          className="h-full w-full flex-1 p-0.5"
          style={{
            clipPath: CLIP,
            background: `linear-gradient(160deg, ${accent}, ${tint(30)} 40%, ${accent})`,
          }}
        >
          {/* Card body */}
          <div
            className="relative flex h-full min-h-125 flex-col overflow-hidden bg-white/95 sm:min-h-130 backdrop-blur-md"
            style={{ clipPath: CLIP }}
          >
            {/* Artwork */}
            <div
              className="relative h-50 w-full shrink-0 overflow-hidden sm:h-55 lg:h-62.5"
              style={{
                background: `radial-gradient(circle at 50% 40%, ${tint(25)}, #f8fafc 80%)`,
              }}
            >
              <Image
                src={image}
                alt={`${title} character artwork`}
                fill
                sizes="(max-width: 767px) 100vw, (max-width: 1279px) 33vw, 25vw"
                draggable={false}
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />

              {/* Fade artwork into panel */}
              <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-white to-transparent" />

              {/* Info button */}
              <button
                type="button"
                onClick={onInfo}
                aria-label={`About ${title}`}
                className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full border border-slate-200/90 bg-white/85 text-sm font-bold text-slate-700 shadow-sm backdrop-blur transition hover:bg-slate-900 hover:text-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              >
                ?
              </button>
            </div>

            {/* Info panel */}
            <div className="relative -mt-4 flex flex-1 flex-col gap-3 px-4 pb-5 pt-4 sm:px-5">
              {/* Title and badge */}
              <div className="flex min-w-0 items-start gap-3">
                <div
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border-2 sm:h-14 sm:w-14"
                  style={{
                    borderColor: accent,
                    color: `color-mix(in srgb, ${accent} 85%, #090d16)`,
                    background: tint(14),
                    boxShadow: `0 2px 10px ${tint(30)}, inset 0 0 10px ${tint(15)}`,
                  }}
                >
                  <span className="h-7 w-7">{icon}</span>
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="wrap-break-word text-xl font-black uppercase italic leading-[0.95] tracking-tight text-slate-900 sm:text-2xl">
                    {title}
                  </h3>

                  <span
                    className="mt-2 inline-block max-w-full rounded-md border px-2.5 py-0.5 text-[10px] font-bold tracking-wide sm:text-[11px]"
                    style={{
                      borderColor: tint(60),
                      background: tint(12),
                      color: `color-mix(in srgb, ${accent} 85%, #090d16)`,
                    }}
                  >
                    {badge}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-[13px] leading-snug text-slate-600 sm:text-[13.5px]">
                {description}
              </p>

              {/* Tags */}
              <ul className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border px-2.5 py-0.5 text-[10px] font-semibold text-slate-700 sm:text-[11px]"
                    style={{
                      borderColor: tint(45),
                      background: tint(8),
                    }}
                  >
                    {tag}
                  </li>
                ))}
              </ul>

              {/* CTA stays at the bottom */}
              <button
                type="button"
                onClick={onSelect}
                className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl border-2 px-3 py-3 text-xs font-extrabold uppercase tracking-wider text-slate-900 transition-all duration-200 hover:brightness-105 active:scale-[0.98] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-slate-900 sm:text-sm cursor-pointer"
                style={{
                  borderColor: accent,
                  background: `linear-gradient(180deg, ${tint(35)}, ${tint(14)})`,
                  boxShadow: `0 4px 14px ${tint(30)}, inset 0 0 10px ${tint(15)}`,
                }}
              >
                Select mode

                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
