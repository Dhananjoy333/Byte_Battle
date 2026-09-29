'use client';

import React from 'react';
import { Cell, CellOwner } from './types';
import { TerritoryQuestion, QuestionOption } from './data/questions';
import { FiClock, FiCheck, FiX, FiShield, FiZap, FiAward, FiAlertTriangle } from 'react-icons/fi';

interface CellDuelModalProps {
  isOpen: boolean;
  cell: Cell | null;
  attacker: CellOwner;
  defender: CellOwner;
  question: TerritoryQuestion | null;
  timeLeft: number;
  aiStatus: 'thinking' | 'correct' | 'wrong';
  playerAnswer: 'A' | 'B' | 'C' | 'D' | null;
  isResolved: boolean;
  winner: CellOwner | null;
  resolutionReason: string;
  onSelectOption: (key: 'A' | 'B' | 'C' | 'D') => void;
  onFinishDuel: () => void;
}

export const CellDuelModal: React.FC<CellDuelModalProps> = ({
  isOpen,
  cell,
  attacker,
  defender,
  question,
  timeLeft,
  aiStatus,
  playerAnswer,
  isResolved,
  winner,
  resolutionReason,
  onSelectOption,
  onFinishDuel,
}) => {
  if (!isOpen || !question || !cell) {
    return null;
  }

  const isP1Attacker = attacker === 'player1';
  const isP1Winner = winner === 'player1';

  // Format countdown mm:ss
  const formattedTime = `00:${timeLeft.toString().padStart(2, '0')}`;
  const isTimeCritical = timeLeft <= 3 && !isResolved;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-lg animate-in fade-in duration-200 select-none overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Cell Duel Combat"
    >
      <div className="relative w-full max-w-2xl bg-zinc-950/95 border border-yellow-500/30 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_40px_rgba(250,204,21,0.15)] flex flex-col gap-4.5 my-auto">
        {/* ============================================================== */}
        {/* Top Header: Cyber Duel Title, Contested Cell & Countdown       */}
        {/* ============================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
              <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.3em] text-yellow-400">
                Territory Battle // Cell Duel
              </span>
            </div>
            <h2 className="text-base sm:text-xl font-black uppercase tracking-wider text-zinc-100 mt-0.5">
              Contested: Cell ({cell.row}, {cell.col})
            </h2>
            <span className="text-[11px] text-zinc-400">
              {isP1Attacker
                ? 'You are attacking Player 2 territory'
                : 'You are defending against Player 2 challenge'}
            </span>
          </div>

          {/* Large Countdown Timer */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all ${
              isTimeCritical
                ? 'bg-rose-950/80 border-rose-500 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-pulse'
                : 'bg-zinc-900/90 border-zinc-700/80 text-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.2)]'
            }`}
          >
            <FiClock className="size-4 sm:size-5 shrink-0" />
            <span className="text-xl sm:text-2xl font-black font-mono tracking-tight">
              {formattedTime}
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* Versus Matchup Bar (Player 1 vs Player 2)                      */}
        {/* ============================================================== */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-zinc-900/70 border border-zinc-800">
          {/* Player 1 Card */}
          <div className="flex flex-col items-start gap-1 p-2.5 rounded-xl bg-zinc-950/60 border border-emerald-500/30">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400">
                Player 1 (You)
              </span>
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-zinc-300">
              {playerAnswer
                ? `Answered [${playerAnswer}]`
                : 'First to solve wins!'}
            </span>
          </div>

          {/* Player 2 Card (AI) */}
          <div className="flex flex-col items-end gap-1 p-2.5 rounded-xl bg-zinc-950/60 border border-rose-500/30">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-rose-400">
                Player 2 (AI)
              </span>
              <span className="w-2 h-2 rounded-full bg-rose-400" />
            </div>
            <div className="flex items-center gap-1.5">
              {aiStatus === 'thinking' && (
                <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-mono font-bold text-amber-400">
                  <FiZap className="size-3 animate-spin" />
                  THINKING...
                </span>
              )}
              {aiStatus === 'wrong' && (
                <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-mono font-bold text-rose-400">
                  <FiX className="size-3" />
                  WRONG ANSWER
                </span>
              )}
              {aiStatus === 'correct' && (
                <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-mono font-bold text-emerald-400">
                  <FiCheck className="size-3" />
                  CORRECT!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* The Programming Duel Question                                  */}
        {/* ============================================================== */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider bg-zinc-800 text-yellow-300 border border-yellow-400/30">
              {question.category}
            </span>
            <span className="text-[10px] sm:text-xs text-zinc-400 font-semibold">
              First correct answer claims territory
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-zinc-100 leading-snug">
            {question.prompt}
          </h3>

          {question.codeSnippet && (
            <div className="relative rounded-xl bg-black/80 border border-zinc-800 p-3 font-mono text-xs text-cyan-300 overflow-x-auto shadow-inner">
              <pre className="whitespace-pre-wrap font-mono">{question.codeSnippet}</pre>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* Answer Options (A, B, C, D)                                   */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
          {question.options.map((opt: QuestionOption) => {
            const isSelected = playerAnswer === opt.key;
            const isThisCorrect = opt.key === question.correctAnswer;

            let optionStyle =
              'relative flex items-center gap-3 p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all duration-150 select-none';

            if (!isResolved) {
              optionStyle +=
                ' bg-zinc-900/85 hover:bg-zinc-800/90 border-zinc-800 hover:border-yellow-400/50 hover:text-yellow-200 text-zinc-200 cursor-pointer active:scale-[0.98] shadow-sm';
            } else {
              if (isThisCorrect) {
                optionStyle +=
                  ' bg-emerald-950/90 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(52,211,153,0.4)] font-semibold';
              } else if (isSelected && !isThisCorrect) {
                optionStyle +=
                  ' bg-rose-950/90 border-rose-500 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.4)] font-semibold';
              } else {
                optionStyle += ' bg-zinc-950/50 border-zinc-850 text-zinc-500 opacity-50 cursor-default';
              }
            }

            return (
              <button
                key={opt.key}
                type="button"
                disabled={isResolved}
                onClick={() => onSelectOption(opt.key)}
                className={optionStyle}
              >
                <span
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center font-bold font-mono text-xs sm:text-sm shrink-0 border ${
                    !isResolved
                      ? 'bg-zinc-800 border-zinc-700 text-zinc-300'
                      : isThisCorrect
                      ? 'bg-emerald-500 border-emerald-300 text-zinc-950 font-black'
                      : isSelected
                      ? 'bg-rose-500 border-rose-300 text-zinc-950 font-black'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                  }`}
                >
                  {isResolved && isThisCorrect ? (
                    <FiCheck className="size-3.5 sm:size-4 stroke-[3]" />
                  ) : isResolved && isSelected ? (
                    <FiX className="size-3.5 sm:size-4 stroke-[3]" />
                  ) : (
                    opt.key
                  )}
                </span>
                <span className="flex-1 leading-snug">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* Duel Result Banner (Victory / Defeat)                           */}
        {/* ============================================================== */}
        {isResolved && (
          <div
            className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in zoom-in-95 duration-200 ${
              isP1Winner
                ? 'bg-emerald-950/80 border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.35)]'
                : 'bg-rose-950/80 border-rose-500/60 shadow-[0_0_30px_rgba(244,63,94,0.35)]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  isP1Winner
                    ? 'bg-emerald-500 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.8)]'
                    : 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.8)]'
                }`}
              >
                {isP1Winner ? <FiAward className="size-5" /> : <FiAlertTriangle className="size-5" />}
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-black uppercase tracking-wider text-zinc-100">
                  {isP1Winner
                    ? isP1Attacker
                      ? 'VICTORY! Territory Claimed'
                      : 'VICTORY! Territory Defended'
                    : isP1Attacker
                    ? 'DEFEAT! Challenge Failed'
                    : 'DEFEAT! Territory Lost'}
                </span>
                <span className="text-xs text-zinc-300">
                  {resolutionReason}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onFinishDuel}
              className={`w-full sm:w-auto py-2.5 px-6 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all cursor-pointer ${
                isP1Winner
                  ? 'bg-emerald-400 hover:bg-emerald-300 text-zinc-950 shadow-[0_0_15px_rgba(52,211,153,0.5)]'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-600'
              }`}
            >
              Return to Board
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
