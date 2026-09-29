'use client';

import React from 'react';
import { Cell } from './types';
import { ConflictPhase } from './duelLogic';
import { P1_BASE, P2_BASE } from './territoryLogic';
import { FiShield, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

interface ChallengePromptProps {
  phase: ConflictPhase;
  cell: Cell | null;
  onAcceptAIChallenge: () => void;
  onRejectAIChallenge: () => void;
  onDismissFeedback: () => void;
}

export const ChallengePrompt: React.FC<ChallengePromptProps> = ({
  phase,
  cell,
  onAcceptAIChallenge,
  onRejectAIChallenge,
  onDismissFeedback,
}) => {
  if (
    phase !== 'waiting-for-ai' &&
    phase !== 'ai-rejected' &&
    phase !== 'ai-challenge-request' &&
    phase !== 'player-rejected'
  ) {
    return null;
  }

  const isTargetingP1Base =
    cell?.row === P1_BASE.row && cell?.col === P1_BASE.col;
  const isTargetingP2Base =
    cell?.row === P2_BASE.row && cell?.col === P2_BASE.col;

  const cellCoordText = cell
    ? isTargetingP1Base
      ? 'Your Base HQ (0, 0)'
      : isTargetingP2Base
      ? 'Enemy Base HQ'
      : `Cell (${cell.row}, ${cell.col})`
    : 'Target Cell';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md bg-zinc-950/95 border border-zinc-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col items-center text-center gap-4">
        {/* ============================================================== */}
        {/* 1. WAITING FOR AI RESPONSE                                     */}
        {/* ============================================================== */}
        {phase === 'waiting-for-ai' && (
          <>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.2)]">
              <FiShield className="size-6 animate-pulse" />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.25em] text-yellow-400">
                Cell Duel
              </span>
              <h3 className="text-base sm:text-lg font-black text-zinc-100 uppercase tracking-wide">
                Challenging {cellCoordText}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                {isTargetingP2Base
                  ? 'Assaulting opponent Headquarters! Seizing this cell wins the match.'
                  : 'You challenged the opponent for this cell.'}
              </p>
              <div className="flex items-center justify-center gap-2 mt-3 text-xs font-semibold text-yellow-300/90">
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
                <span>Waiting for opponent response...</span>
              </div>
            </div>
          </>
        )}

        {/* ============================================================== */}
        {/* 2. AI REJECTED FEEDBACK                                        */}
        {/* ============================================================== */}
        {phase === 'ai-rejected' && (
          <>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.35)]">
              <FiCheckCircle className="size-6" />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.25em] text-emerald-400">
                Opponent Rejected
              </span>
              <h3 className="text-base sm:text-lg font-black text-zinc-100 uppercase tracking-wide">
                Territory Captured!
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 mt-1">
                The opponent declined your duel challenge.
              </p>
              <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold text-xs mt-2">
                <span>+1 Bit refunded</span>
                <span className="text-zinc-400 text-[10px]">(Net challenge cost: 1 Bit)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onDismissFeedback}
              className="w-full mt-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.4)] active:scale-95 transition-all cursor-pointer"
            >
              Continue
            </button>
          </>
        )}

        {/* ============================================================== */}
        {/* 3. AI CHALLENGE REQUEST (P1 Defending)                         */}
        {/* ============================================================== */}
        {phase === 'ai-challenge-request' && (
          <>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-rose-500/10 border border-rose-500/40 text-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.35)]">
              <FiAlertTriangle className="size-6 animate-bounce" />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.25em] text-rose-400">
                Cell Duel Request
              </span>
              <h3 className="text-base sm:text-lg font-black text-zinc-100 uppercase tracking-wide">
                Opponent Has Challenged You!
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300">
                Player 2 is attempting to seize your territory at <strong className="text-yellow-400">{cellCoordText}</strong>.
              </p>

              {/* Special Base Under Attack Warning */}
              {isTargetingP1Base && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/80 text-rose-300 font-bold text-xs text-left animate-pulse">
                  <FiAlertTriangle className="size-4 shrink-0 text-rose-400" />
                  <span>⚠ BASE UNDER ATTACK — Rejecting this challenge will lose the match immediately!</span>
                </div>
              )}

              <p className="text-[11px] text-zinc-400">
                Accept to defend your cell in a duel, or reject to surrender it.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 w-full mt-2">
              <button
                type="button"
                onClick={onAcceptAIChallenge}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.4)] active:scale-95 transition-all cursor-pointer"
              >
                Accept Challenge
              </button>

              <button
                type="button"
                onClick={onRejectAIChallenge}
                className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-rose-500/40 text-rose-300 hover:text-rose-200 font-bold text-xs uppercase tracking-wider active:scale-95 transition-all cursor-pointer"
              >
                Reject Challenge
              </button>
            </div>
          </>
        )}

        {/* ============================================================== */}
        {/* 4. PLAYER REJECTED FEEDBACK                                    */}
        {/* ============================================================== */}
        {phase === 'player-rejected' && (
          <>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-zinc-900 border border-zinc-700 text-zinc-400">
              <FiShield className="size-6" />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.25em] text-rose-400">
                Territory Surrendered
              </span>
              <h3 className="text-base sm:text-lg font-black text-zinc-100 uppercase tracking-wide">
                Cell Captured by Opponent
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                You declined the challenge. <strong className="text-zinc-200">{cellCoordText}</strong> now belongs to Player 2.
              </p>
            </div>

            <button
              type="button"
              onClick={onDismissFeedback}
              className="w-full mt-2 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold text-xs uppercase tracking-wider active:scale-95 transition-all cursor-pointer"
            >
              Continue
            </button>
          </>
        )}
      </div>
    </div>
  );
};
