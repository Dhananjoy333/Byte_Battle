'use client';

import React from 'react';
import Image from 'next/image';
import { MatchState } from './logic/matchLogic';
import { FiRotateCcw, FiLogOut, FiClock, FiTarget, FiAward } from 'react-icons/fi';

const IMAGEKIT_URL = process.env.NEXT_PUBLIC_IMAGEKIT_URL;

interface GameOverModalProps {
  isOpen: boolean;
  matchState: MatchState;
  onPlayAgain: () => void;
  onExit: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  matchState,
  onPlayAgain,
  onExit,
}) => {
  if (!isOpen || matchState.status !== 'finished') {
    return null;
  }

  const { result, reason, p1CellCount, p2CellCount } = matchState;
  const isP1Win = result === 'p1-win';
  const isP2Win = result === 'p2-win';
  const isDraw = result === 'draw';

  // Determine outcome title and styling based on actual game state
  const outcomeTitle = isP1Win ? 'VICTORY' : isP2Win ? 'DEFEAT' : 'DRAW';

  const supportingText = isP1Win
    ? 'Territory Secured'
    : isP2Win
    ? reason === 'base-captured'
      ? 'HQ Fallen — Opponent Secured Victory'
      : 'Opponent Secured More Territory'
    : 'Neither player secured victory.';

  // Match ending reason description and icon
  const endReasonLabel =
    reason === 'base-captured'
      ? isP1Win
        ? 'BASE CAPTURED — ENEMY HQ FALLEN'
        : isP2Win
        ? 'BASE CAPTURED — YOUR HQ FALLEN'
        : 'BASE CAPTURED'
      : reason === 'time-expired'
      ? 'TIME EXPIRED — FINAL TERRITORY COUNT'
      : 'MATCH CONCLUDED';

  const renderReasonIcon = () => {
    if (reason === 'base-captured') {
      return (
        <FiTarget className="size-2.5 min-[440px]:size-3 sm:size-3.5 text-rose-400 shrink-0" />
      );
    }
    if (reason === 'time-expired') {
      return (
        <FiClock className="size-2.5 min-[440px]:size-3 sm:size-3.5 text-amber-400 shrink-0" />
      );
    }
    return (
      <FiAward className="size-2.5 min-[440px]:size-3 sm:size-3.5 text-yellow-400 shrink-0" />
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-300 select-none overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-over-title"
    >
      {/* Main Composition Container matching result_layout.png (1671 x 941, ~1.7758 aspect ratio) */}
      <div className="relative w-[min(96vw,calc(88vh*1.7758),1550px)] aspect-1671/941 my-auto shrink-0 select-none flex items-center justify-center">
        {/* Layer 0: Frame Background Image (result_layout.png) */}
        <Image
          src={`${IMAGEKIT_URL}/territory_img/result_layout.png`}
          alt="Match Results Frame"
          width={1680}
          height={941}
          priority
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-0"
        />

        {/* Layer 1: Central Modal Content Overlay positioned inside the dark scoreboard area */}
        <div className="absolute top-[28.5%] bottom-[23.5%] left-[22.5%] right-[22.5%] z-10 flex flex-col items-center justify-between text-center py-1 sm:py-2 px-1">
          {/* Top Section: Status Label + Outcome Heading + Supporting Subtitle + Reason Badge */}
          <div className="flex flex-col items-center gap-0.5 min-[440px]:gap-1 sm:gap-1.5 w-full">
            {/* Status Label */}
            <span className="text-[7.5px] min-[440px]:text-[8.5px] min-[540px]:text-[9.5px] sm:text-[11px] md:text-xs font-mono font-black uppercase tracking-[0.25em] text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
              • MATCH COMPLETE •
            </span>

            {/* Outcome Heading */}
            <h2
              id="game-over-title"
              className={`font-zentry font-black uppercase tracking-wider text-xl min-[440px]:text-2xl min-[540px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-none select-none ${
                isP1Win
                  ? 'text-transparent bg-clip-text bg-linear-to-b from-[#fffbe8] via-[#fbbf24] to-[#d97706] drop-shadow-[0_4px_10px_rgba(245,158,11,0.5)] [text-shadow:0_2px_0_#b45309,0_4px_8px_rgba(0,0,0,0.8)]'
                  : isP2Win
                  ? 'text-transparent bg-clip-text bg-linear-to-b from-[#ffe4e6] via-[#f43f5e] to-[#be123c] drop-shadow-[0_4px_10px_rgba(244,63,94,0.5)] [text-shadow:0_2px_0_#881337,0_4px_8px_rgba(0,0,0,0.8)]'
                  : 'text-transparent bg-clip-text bg-linear-to-b from-[#e0f2fe] via-[#38bdf8] to-[#0284c7] drop-shadow-[0_4px_10px_rgba(56,189,248,0.5)] [text-shadow:0_2px_0_#075985,0_4px_8px_rgba(0,0,0,0.8)]'
              }`}
            >
              {outcomeTitle}
            </h2>

            {/* Supporting Subtitle with Decorative Lines */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 w-full">
              <div
                className={`h-[1.5px] w-4 min-[440px]:w-6 sm:w-10 bg-linear-to-r from-transparent ${
                  isP1Win
                    ? 'to-amber-400'
                    : isP2Win
                    ? 'to-rose-400'
                    : 'to-cyan-400'
                }`}
              />
              <span
                className={`text-[7px] min-[440px]:text-[8px] min-[540px]:text-[9px] sm:text-xs md:text-sm font-semibold tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] ${
                  isP1Win
                    ? 'text-amber-200/95'
                    : isP2Win
                    ? 'text-rose-200/95'
                    : 'text-cyan-200/95'
                }`}
              >
                {supportingText}
              </span>
              <div
                className={`h-[1.5px] w-4 min-[440px]:w-6 sm:w-10 bg-linear-to-l from-transparent ${
                  isP1Win
                    ? 'to-amber-400'
                    : isP2Win
                    ? 'to-rose-400'
                    : 'to-cyan-400'
                }`}
              />
            </div>

            {/* Match End Reason Badge */}
            <div className="mt-0.5 inline-flex items-center gap-1 min-[440px]:gap-1.5 sm:gap-2 px-2 min-[440px]:px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-[#070e1c]/90 border border-zinc-700/80 shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
              {renderReasonIcon()}
              <span className="text-[6.5px] min-[440px]:text-[7.5px] min-[540px]:text-[8.5px] sm:text-[10px] md:text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">
                {endReasonLabel}
              </span>
            </div>
          </div>

          {/* Scoreboard Section: YOU (cyan) vs OPPONENT (rose) */}
          <div className="w-full flex items-center justify-center gap-1.5 min-[440px]:gap-2 sm:gap-3 px-1 my-auto">
            {/* Left Card: YOU */}
            <div className="flex-1 max-w-[45%] rounded-md min-[440px]:rounded-lg sm:rounded-xl bg-[#06152b]/85 border border-cyan-400/50 sm:border-2 shadow-[0_0_15px_rgba(6,182,212,0.25),inset_0_0_12px_rgba(6,182,212,0.1)] flex flex-col items-center justify-center py-1 min-[440px]:py-1.5 sm:py-2 md:py-2.5 px-1 min-[440px]:px-2">
              <span className="text-[7.5px] min-[440px]:text-[8.5px] min-[540px]:text-[9.5px] sm:text-xs md:text-sm font-mono font-black uppercase tracking-widest text-cyan-400">
                YOU
              </span>
              <span className="text-lg min-[440px]:text-xl min-[540px]:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-none my-0.5 sm:my-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                {p1CellCount}
              </span>
              <span className="text-[6.5px] min-[440px]:text-[7.5px] min-[540px]:text-[8.5px] sm:text-[10px] md:text-xs font-mono font-bold uppercase tracking-wider text-cyan-400/90">
                CELLS
              </span>
            </div>

            {/* Center Separator: Glowing diamond + subtle VS divider */}
            <div className="flex flex-col items-center justify-center shrink-0 px-0.5 min-[440px]:px-1 sm:px-2 gap-0.5">
              <span className="text-yellow-400 text-xs min-[440px]:text-sm sm:text-base md:text-lg lg:text-xl drop-shadow-[0_0_8px_rgba(250,204,21,0.9)] select-none">
                ✦
              </span>
              <span className="text-[6.5px] min-[440px]:text-[7.5px] sm:text-[9px] font-mono font-black text-zinc-400 uppercase tracking-widest">
                VS
              </span>
            </div>

            {/* Right Card: OPPONENT */}
            <div className="flex-1 max-w-[45%] rounded-md min-[440px]:rounded-lg sm:rounded-xl bg-[#260815]/85 border border-rose-500/50 sm:border-2 shadow-[0_0_15px_rgba(244,63,94,0.25),inset_0_0_12px_rgba(244,63,94,0.1)] flex flex-col items-center justify-center py-1 min-[440px]:py-1.5 sm:py-2 md:py-2.5 px-1 min-[440px]:px-2">
              <span className="text-[7.5px] min-[440px]:text-[8.5px] min-[540px]:text-[9.5px] sm:text-xs md:text-sm font-mono font-black uppercase tracking-widest text-rose-400">
                OPPONENT
              </span>
              <span className="text-lg min-[440px]:text-xl min-[540px]:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-none my-0.5 sm:my-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                {p2CellCount}
              </span>
              <span className="text-[6.5px] min-[440px]:text-[7.5px] min-[540px]:text-[8.5px] sm:text-[10px] md:text-xs font-mono font-bold uppercase tracking-wider text-rose-400/90">
                CELLS
              </span>
            </div>
          </div>

          {/* Action Buttons: PLAY AGAIN & EXIT */}
          <div className="w-full flex items-center justify-center gap-1.5 min-[440px]:gap-2 sm:gap-3 md:gap-4 px-1 sm:px-2">
            {/* Play Again (Primary Action) */}
            <button
              type="button"
              onClick={onPlayAgain}
              className="flex-1 max-w-[46%] flex items-center justify-center gap-1 min-[440px]:gap-1.5 sm:gap-2 py-1 min-[440px]:py-1.5 sm:py-2 md:py-2.5 px-2 min-[440px]:px-3 sm:px-5 rounded-md min-[440px]:rounded-lg sm:rounded-xl bg-linear-to-r from-amber-400 via-yellow-400 to-amber-400 hover:from-amber-300 hover:via-yellow-300 hover:to-amber-300 active:scale-95 text-zinc-950 font-black text-[7.5px] min-[440px]:text-[8.5px] min-[540px]:text-[9.5px] sm:text-xs md:text-sm uppercase tracking-wider shadow-[0_0_18px_rgba(250,204,21,0.5)] hover:shadow-[0_0_26px_rgba(250,204,21,0.7)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <FiRotateCcw className="size-2.5 min-[440px]:size-3 sm:size-3.5 md:size-4 shrink-0 stroke-[2.5]" />
              <span className="truncate">PLAY AGAIN</span>
            </button>

            {/* Exit (Secondary Action) */}
            <button
              type="button"
              onClick={onExit}
              className="flex-1 max-w-[46%] flex items-center justify-center gap-1 min-[440px]:gap-1.5 sm:gap-2 py-1 min-[440px]:py-1.5 sm:py-2 md:py-2.5 px-2 min-[440px]:px-3 sm:px-5 rounded-md min-[440px]:rounded-lg sm:rounded-xl bg-zinc-900/90 hover:bg-zinc-800/90 active:scale-95 border border-zinc-700/80 hover:border-zinc-500 text-zinc-200 hover:text-white font-extrabold text-[7.5px] min-[440px]:text-[8.5px] min-[540px]:text-[9.5px] sm:text-xs md:text-sm uppercase tracking-wider shadow-[0_4px_12px_rgba(0,0,0,0.6)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
            >
              <FiLogOut className="size-2.5 min-[440px]:size-3 sm:size-3.5 md:size-4 shrink-0" />
              <span className="truncate">EXIT</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
