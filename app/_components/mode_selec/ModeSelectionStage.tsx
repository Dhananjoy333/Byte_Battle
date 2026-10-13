"use client";

import React, { forwardRef } from "react";
import Image from "next/image";
import ModeCard from "./ModeCard";
import { MODES, ModeId } from "./modeData";

interface ModeSelectionStageProps {
  onSelectMode: (id: ModeId) => void;
  headerRef: React.RefObject<HTMLDivElement | null>;
  cardsContainerRef: React.RefObject<HTMLDivElement | null>;
}

const IMAGEKIT_URL = process.env.NEXT_PUBLIC_IMAGEKIT_URL;

export const ModeSelectionStage = forwardRef<HTMLDivElement, ModeSelectionStageProps>(
  function ModeSelectionStage({ onSelectMode, headerRef, cardsContainerRef }, ref) {
    return (
      <div ref={ref} className="w-full flex flex-col items-center">
        {/* Header: Title and subtitle */}
        <header ref={headerRef} className="text-center will-change-transform">
          <Image
            src={`${IMAGEKIT_URL}/mode_selec_img/choose_mode_title.png`}
            alt="Choose Your Battlefield"
            width={1600}
            height={800}
            priority
            className="w-full max-w-5xl 2xl:max-w-6xl h-auto"
          />

          <p className="mt-4 text-sm 2xl:text-lg text-slate-700 sm:text-base font-medium">
            Different challenges. Same arena. Prove your coding skills.
          </p>
        </header>

        {/* Cards: offset right on large screens so the hero character in the bg stays visible */}
        <section
          ref={cardsContainerRef}
          className="mt-12 2xl:-translate-x-26 grid w-full grid-cols-1 justify-items-center gap-8 md:grid-cols-3 lg:mt-14 lg:w-[78%] lg:self-end lg:gap-6 will-change-transform"
        >
          {MODES.map((mode, i) => (
            <div
              key={mode.id}
              className={`w-full ${i === 1 ? "md:translate-y-3" : ""}`}
            >
              <div
                data-mode-card
                className="w-full flex justify-center h-full will-change-transform"
              >
                <ModeCard
                  {...mode}
                  onSelect={() => onSelectMode(mode.id)}
                  onInfo={() => console.log("Info:", mode.id)}
                />
              </div>
            </div>
          ))}
        </section>
      </div>
    );
  }
);

ModeSelectionStage.displayName = "ModeSelectionStage";

export default ModeSelectionStage;
