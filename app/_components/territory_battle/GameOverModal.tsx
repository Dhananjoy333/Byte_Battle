'use client';

import React from 'react';
import { MatchState } from './matchLogic';
import { FiAward, FiAlertTriangle, FiRotateCcw, FiLogOut } from 'react-icons/fi';

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300 select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-over-title"
    >
      <div
        className={`relative w-full max-w-md bg-zinc-950/95 border rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center gap-5 shadow-2xl animate-in zoom-in-95 duration-200 ${
          isP1Win
            ? 'border-emerald-500/60 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(16,185,129,0.35)]'
            : isP2Win
            ? 'border-rose-500/60 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(244,63,94,0.35)]'
            : 'border-yellow-500/60 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(250,204,21,0.35)]'
        }`}
      >
        {/* Emblem Icon */}
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
            isP1Win
              ? 'bg-emerald-500/15 border border-emerald-400/50 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)]'
              : isP2Win
              ? 'bg-rose-500/15 border border-rose-400/50 text-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.5)]'
              : 'bg-yellow-500/15 border border-yellow-400/50 text-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.5)]'
          }`}
        >
          {isP1Win ? (
            <FiAward className="size-8 animate-bounce" />
          ) : isP2Win ? (
            <FiAlertTriangle className="size-8" />
          ) : (
            <FiAward className="size-8" />
          )}
        </div>

        {/* Title & Subtitle */}
        <div className="flex flex-col gap-1">
          <span
            className={`text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.3em] ${
              isP1Win
                ? 'text-emerald-400'
                : isP2Win
                ? 'text-rose-400'
                : 'text-yellow-400'
            }`}
          >
            Match Complete
          </span>
          <h2
            id="game-over-title"
            className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-zinc-100"
          >
            {isP1Win ? 'VICTORY' : isP2Win ? 'DEFEAT' : 'DRAW'}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 mt-0.5">
            {isP1Win
              ? 'Territory secured.'
              : isP2Win
              ? 'Territory lost.'
              : 'Territory evenly contested.'}
          </p>
        </div>

        {/* End Reason Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-700/80 text-[11px] sm:text-xs font-bold font-mono uppercase tracking-wider text-zinc-300">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
          <span>
            {reason === 'base-captured'
              ? isP1Win
                ? 'BASE CAPTURED — Enemy HQ fallen'
                : 'BASE CAPTURED — Your HQ fallen'
              : 'TIME EXPIRED — Final territory count'}
          </span>
        </div>

        {/* Final Territory Score Breakdown */}
        <div className="grid grid-cols-2 gap-3 w-full p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
          <div className="flex flex-col items-center p-2.5 rounded-xl bg-zinc-950/60 border border-emerald-500/30">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400">
              You
            </span>
            <span className="text-lg sm:text-xl font-black text-zinc-100 mt-0.5">
              {p1CellCount} Cells
            </span>
          </div>

          <div className="flex flex-col items-center p-2.5 rounded-xl bg-zinc-950/60 border border-rose-500/30">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-rose-400">
              Opponent
            </span>
            <span className="text-lg sm:text-xl font-black text-zinc-100 mt-0.5">
              {p2CellCount} Cells
            </span>
          </div>
        </div>

        {/* Action Buttons: PLAY AGAIN & EXIT */}
        <div className="grid grid-cols-2 gap-3 w-full mt-1">
          <button
            type="button"
            onClick={onPlayAgain}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:via-yellow-300 hover:to-amber-400 text-zinc-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:shadow-[0_0_25px_rgba(250,204,21,0.6)] active:scale-95 transition-all cursor-pointer"
          >
            <FiRotateCcw className="size-4 shrink-0" />
            <span>Play Again</span>
          </button>

          <button
            type="button"
            onClick={onExit}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-600 text-zinc-200 font-extrabold text-xs sm:text-sm uppercase tracking-wider active:scale-95 transition-all cursor-pointer"
          >
            <FiLogOut className="size-4 shrink-0" />
            <span>Exit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
