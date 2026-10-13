"use client";

import React, { forwardRef } from "react";
import ModeHeading from "./ModeHeading";
import OpponentCard from "./OpponentCard";
import DifficultyCard from "./DifficultyCard";
import {
  ModeItem,
  OpponentId,
  DifficultyId,
  OPPONENTS,
  DIFFICULTIES,
} from "./modeData";

interface ModeSetupStageProps {
  mode: ModeItem;
  selectedOpponent: OpponentId;
  selectedDifficulty: DifficultyId;
  onSelectOpponent: (id: OpponentId) => void;
  onSelectDifficulty: (id: DifficultyId) => void;
  onContinue: () => void;
  onBackToModes?: () => void;
  headingRef: React.RefObject<HTMLDivElement | null>;
  opponentsContainerRef: React.RefObject<HTMLDivElement | null>;
  difficultiesContainerRef: React.RefObject<HTMLDivElement | null>;
  continueBtnRef: React.RefObject<HTMLDivElement | null>;
}

export const ModeSetupStage = forwardRef<HTMLDivElement, ModeSetupStageProps>(
  function ModeSetupStage(
    {
      mode,
      selectedOpponent,
      selectedDifficulty,
      onSelectOpponent,
      onSelectDifficulty,
      onContinue,
      onBackToModes,
      headingRef,
      opponentsContainerRef,
      difficultiesContainerRef,
      continueBtnRef,
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        className="w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto flex flex-col items-center px-4 py-2 select-none"
      >
        {/* 1. Mode Heading */}
        <div ref={headingRef} className="w-full will-change-transform">
          <ModeHeading mode={mode} />
        </div>

        {/* 2. Choose Opponent Section */}
        <section className="w-full mt-6 sm:mt-8">
          <div className="flex items-center justify-center gap-3 text-[11px] sm:text-xs 2xl:text-lg font-bold tracking-[0.25em] text-slate-500 uppercase">
            {/* Left ornament */}
            <div className="flex items-center gap-2">
              <span className="h-px w-8 sm:w-12 2xl:w-14 bg-slate-700" />
              <span className="h-2 w-2 rotate-45 bg-slate-700" />
            </div>

            <span>CHOOSE OPPONENT</span>

            {/* Right ornament */}
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rotate-45 bg-slate-700" />
              <span className="h-px w-8 sm:w-12 2xl:w-14 bg-slate-700" />
            </div>
          </div>

          <div
            ref={opponentsContainerRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6 will-change-transform"
          >
            {OPPONENTS.map((opp) => (
              <div key={opp.id} data-opponent-card className="will-change-transform">
                <OpponentCard
                  id={opp.id}
                  title={opp.title}
                  description={opp.description}
                  image={opp.image}
                  isSelected={selectedOpponent === opp.id}
                  onSelect={() => onSelectOpponent(opp.id)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* 3. Select Difficulty Section */}
        <section className="w-full mt-5 sm:mt-7">
          <div className="flex items-center justify-center gap-3 text-[11px] sm:text-xs 2xl:text-lg font-bold tracking-[0.25em] text-slate-500 uppercase">
            {/* Left ornament */}
            <div className="flex items-center gap-2">
              <span className="h-px w-8 sm:w-12 2xl:w-14 bg-slate-700" />
              <span className="h-2 w-2 rotate-45 bg-slate-700" />
            </div>

            <span>SELECT DIFFICULTY</span>

            {/* Right ornament */}
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rotate-45 bg-slate-700" />
              <span className="h-px w-8 sm:w-12 2xl:w-14 bg-slate-700" />
            </div>
          </div>

          <div
            ref={difficultiesContainerRef}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6 will-change-transform"
          >
            {DIFFICULTIES.map((diff) => (
              <div key={diff.id} data-difficulty-card className="will-change-transform">
                <DifficultyCard
                  id={diff.id}
                  title={diff.title}
                  description={diff.description}
                  accent={diff.accent}
                  bars={diff.bars}
                  isSelected={selectedDifficulty === diff.id}
                  onSelect={() => onSelectDifficulty(diff.id)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* 4. Continue Button and Back Navigation */}
        <div
          ref={continueBtnRef}
          className="mt-6 sm:mt-8 flex flex-col items-center gap-3 will-change-transform"
        >
          <button
            type="button"
            onClick={onContinue}
            className="group relative flex items-center justify-center gap-2 rounded-xl border-2 border-amber-400 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-400 px-10 sm:px-14 py-3 sm:py-3.5 text-sm sm:text-base font-black uppercase tracking-widest text-slate-900 shadow-[0_4px_24px_rgba(245,158,11,0.45)] transition-all duration-200 hover:brightness-105 hover:scale-[1.02] active:scale-[0.98] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
          >
            {/* Cyber Corner Accents on Button */}
            <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-amber-500" />
            <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-amber-500" />
            <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-amber-500" />
            <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-amber-500" />

            <span>CONTINUE</span>
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 stroke-current transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          {onBackToModes && (
            <button
              type="button"
              onClick={onBackToModes}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-slate-900 transition-colors cursor-pointer py-1"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Back to Game Modes</span>
            </button>
          )}
        </div>
      </div>
    );
  }
);

ModeSetupStage.displayName = "ModeSetupStage";

export default ModeSetupStage;
