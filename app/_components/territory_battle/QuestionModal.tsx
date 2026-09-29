'use client';

import React, { useEffect } from 'react';
import { useQuestionSession } from './useQuestionSession';
import { QuestionCard } from './QuestionCard';
import { FiX, FiCheckCircle, FiAlertTriangle, FiArrowRight, FiShield } from 'react-icons/fi';

interface QuestionModalProps {
  isOpen: boolean;
  bankedBits: number;
  onBank: (earnedBits: number) => void;
  onClose: () => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  isOpen,
  bankedBits,
  onBank,
  onClose,
}) => {
  const {
    currentQuestion,
    unbankedBits,
    selectedOptionKey,
    isAnswered,
    isCorrect,
    sessionStatus,
    lostBitsAmount,
    answerQuestion,
    continueToNextQuestion,
    bankBits,
    resetSession,
  } = useQuestionSession();

  // Reset session when modal opens
  useEffect(() => {
    if (isOpen) {
      resetSession();
    }
  }, [isOpen, resetSession]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (sessionStatus === 'decision') {
          // Bank on escape if player already won bits
          handleBankAction();
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, sessionStatus]);

  if (!isOpen) return null;

  const handleOptionSelect = (key: 'A' | 'B' | 'C' | 'D') => {
    answerQuestion(key, () => {
      // Callback when session is lost
      onClose();
    });
  };

  const handleBankAction = () => {
    bankBits((earned) => {
      onBank(earned);
    });
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="question-modal-title"
    >
      <div className="relative w-full max-w-xl bg-zinc-950/95 border border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(250,204,21,0.12)] flex flex-col gap-4 select-none">
        {/* ============================================================== */}
        {/* Top Header: Session Status & Prominent Unbanked Bits           */}
        {/* ============================================================== */}
        <div className="flex items-center justify-between border-b border-zinc-805/80 pb-3">
          <div className="flex flex-col">
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em] text-yellow-400 font-bold">
              Bit Mining Protocol
            </span>
            <h2 id="question-modal-title" className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-zinc-300">
              Programming Challenge
            </h2>
          </div>

          {/* Safe Banked Bits Reference */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] sm:text-xs font-semibold text-zinc-400">
            <FiShield className="size-3 text-emerald-400" />
            <span>Banked: <strong className="text-zinc-200">{bankedBits}</strong></span>
          </div>

          {/* Close button (only active when not locked in loss animation) */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="w-7 h-7 rounded-full flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <FiX className="size-4" />
          </button>
        </div>

        {/* ============================================================== */}
        {/* Prominent Unbanked Bits Display (At Risk)                     */}
        {/* ============================================================== */}
        <div
          className={`flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border transition-all duration-300 ${
            unbankedBits > 0
              ? 'bg-linear-to-r from-amber-950/40 via-yellow-950/30 to-amber-950/40 border-yellow-400/50 shadow-[0_0_25px_rgba(250,204,21,0.2)]'
              : 'bg-zinc-900/60 border-zinc-800'
          }`}
        >
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className={`w-3 h-3 rounded-full ${unbankedBits > 0 ? 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.9)] animate-pulse' : 'bg-zinc-700'}`} />
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-yellow-400/90">
                Unbanked Bits
              </span>
              <span className="text-[10px] text-zinc-400">
                {unbankedBits > 0 ? 'At risk — bank or continue' : 'Answer correctly to earn bits'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xl sm:text-2xl font-black font-mono tracking-tight text-yellow-300 drop-shadow-[0_0_12px_rgba(250,204,21,0.5)]">
              +{unbankedBits}
            </span>
            <span className="text-xs font-bold text-yellow-400/80">BITS</span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* Question Card                                                  */}
        {/* ============================================================== */}
        <div className="py-1">
          <QuestionCard
            question={currentQuestion}
            selectedOptionKey={selectedOptionKey}
            isAnswered={isAnswered}
            isCorrect={isCorrect}
            onSelectOption={handleOptionSelect}
          />
        </div>

        {/* ============================================================== */}
        {/* Feedback / Action Phase (BANK vs CONTINUE)                      */}
        {/* ============================================================== */}
        {sessionStatus === 'decision' && (
          <div className="flex flex-col gap-2 pt-2 border-t border-zinc-800 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold px-1">
              <span className="flex items-center gap-1">
                <FiCheckCircle className="size-3.5" />
                Correct! Earned +{currentQuestion.reward} Bits!
              </span>
              <span className="text-zinc-400 text-[11px]">
                Total Unbanked: <strong className="text-yellow-300">+{unbankedBits} Bits</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-1">
              {/* BANK Button */}
              <button
                type="button"
                onClick={handleBankAction}
                className="group flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-xl bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 font-black text-xs sm:text-sm tracking-wide uppercase shadow-[0_0_20px_rgba(16,185,129,0.45)] hover:shadow-[0_0_25px_rgba(16,185,129,0.65)] active:scale-95 transition-all cursor-pointer"
              >
                <FiShield className="size-4 shrink-0 transition-transform group-hover:scale-110" />
                <span>Bank (+{unbankedBits} Bits)</span>
              </button>

              {/* CONTINUE Button */}
              <button
                type="button"
                onClick={continueToNextQuestion}
                className="group flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-yellow-400/50 hover:border-yellow-400 text-yellow-300 hover:text-yellow-200 font-extrabold text-xs sm:text-sm tracking-wide uppercase shadow-[0_0_15px_rgba(250,204,21,0.2)] hover:shadow-[0_0_20px_rgba(250,204,21,0.35)] active:scale-95 transition-all cursor-pointer"
              >
                <span>Continue (Risk Bits)</span>
                <FiArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* Incorrect Answer Lost Earnings Notice                          */}
        {/* ============================================================== */}
        {sessionStatus === 'lost' && (
          <div className="flex flex-col gap-2 pt-2 border-t border-zinc-800 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(244,63,94,0.3)]">
              <FiAlertTriangle className="size-4 text-rose-400 shrink-0" />
              <span>
                {lostBitsAmount > 0
                  ? `Incorrect! Lost ${lostBitsAmount} unbanked Bits!`
                  : 'Incorrect answer! Session ended.'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Return to Board
            </button>
          </div>
        )}

        {/* Idle Helper */}
        {sessionStatus === 'answering' && (
          <div className="text-center pt-1">
            <span className="text-[10px] sm:text-[11px] text-zinc-500">
              Select an answer. Correct answers accumulate unbanked Bits that can be secured with Bank.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
