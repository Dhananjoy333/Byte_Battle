'use client';

import React, { useEffect, useCallback } from 'react';
import { useQuestionSession } from './useQuestionSession';
import { QuestionCard } from './QuestionCard';
import { FiX, FiCheckCircle, FiAlertTriangle, FiArrowRight, FiShield } from 'react-icons/fi';
import Image from 'next/image';

interface QuestionModalProps {
  isOpen: boolean;
  bankedBits: number;
  onBank: (earnedBits: number) => void;
  onClose: () => void;
}

// Chamfer polygon for action buttons (Bank & Continue)
const ACTION_BTN_CLIP =
  'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)';

// Chamfer polygon for question_layout container (clips black corners of the layout asset)
const QUESTION_LAYOUT_CLIP =
  'polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px)';

export const QuestionModal: React.FC<QuestionModalProps> = ({
  isOpen,
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
    nextReward,
    answerQuestion,
    continueToNextQuestion,
    bankBits,
    resetSession,
  } = useQuestionSession();

  const handleBankAction = useCallback(() => {
    bankBits((earned) => {
      onBank(earned);
    });
  }, [bankBits, onBank]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleOptionSelect = useCallback(
    (key: 'A' | 'B' | 'C' | 'D') => {
      answerQuestion(key, () => {
        onClose();
      });
    },
    [answerQuestion, onClose]
  );

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
          handleBankAction();
        } else {
          handleClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, sessionStatus, handleBankAction, handleClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/30 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="question-modal-title"
    >
      {/* ============================================================== */}
      {/* Main Composition Container                                    */}
      {/* Uses aspect ratio 1.14 (720 / 632) matching reference design   */}
      {/* ============================================================== */}
      <div
        className="relative w-[min(94vw,700px)] 2xl:w-[min(94vw,760px)] aspect-720/700 max-h-[94vh] flex items-center justify-center my-auto shrink-0 select-none"
      >
        {/* ============================================================ */}
        {/* LAYER 1: Outer Decorative Frame (question_outer_layer.png)   */}
        {/* ============================================================ */}
        <Image
          src="/territory_img/question_outer_layer.png"
          alt="Programming Challenge Frame"
          width={760}
          height={667}
          priority
          className="
    absolute
    left-1/2
    top-1/2
    -translate-x-1/2
    -translate-y-1/2
    w-full
    h-full
    object-fill
    pointer-events-none
    select-none
    z-10
    2xl:scale-[1.5]
  "
        />

        {/* ============================================================ */}
        {/* Top-Right Red Close Button [X]                                */}
        {/* ============================================================ */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute z-40 top-[6.6%] 2xl:-top-[8.6%] -right-[2%] 2xl:-right-[28.8%] w-[6.4%] 2xl:w-[15.4%] h-[6.2%] 2xl:h-[15.2%] min-w-7 min-h-7 max-w-15 max-h-15 flex items-center justify-center bg-linear-to-b from-[#b91c1c] via-[#991b1b] to-[#7f1d1d] hover:from-[#dc2626] hover:to-[#991b1b] border-2 border-yellow-400 rounded-md sm:rounded-lg text-white shadow-[0_0_12px_rgba(239,68,68,0.7),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:shadow-[0_0_18px_rgba(250,204,21,0.85)] active:scale-95 transition-all cursor-pointer"
        >
          <FiX className="w-3/4 h-3/4 stroke-3" />
        </button>

        {/* ============================================================ */}
        {/* Top Header: PROGRAMMING CHALLENGE + Sub-Pill                 */}
        {/* ============================================================ */}
        <div className="absolute z-20 top-[33%] 2xl:top-[18.2%] inset-x-[16%] flex flex-col items-center pointer-events-none">
          <h2
            id="question-modal-title"
            className="font-zentry font-black -translate-y-24 italic uppercase tracking-wider text-center text-sm sm:text-lg md:text-xl lg:text-3xl 2xl:text-5xl text-transparent bg-clip-text bg-linear-to-b from-white via-[#fff9c4] to-[#f59e0b] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]"
          >
            PROGRAMMING CHALLENGE
          </h2>

          {/* Cyan Sub-Pill: ANSWER CORRECTLY TO EARN BITS! */}
          <div className="mt-1 sm:mt-1.5 px-3 sm:px-4 py-0.5 rounded-full bg-linear-to-r from-[#031d4f] via-[#052b6e] to-[#031d4f] border border-cyan-400/80 shadow-[0_0_10px_rgba(6,182,212,0.4)] flex items-center justify-center lg:-translate-y-21 2xl:-translate-y-18">
            <span className="text-[7.5px] sm:text-[9.5px] md:text-[10.5px] 2xl:text-[15px] font-bold uppercase tracking-[0.16em] text-cyan-200">
              ANSWER CORRECTLY TO EARN BITS!
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Unbanked Bits Box (Inside cream parchment above layout)      */}
        {/* ============================================================ */}
        <div className="absolute z-20 top-[32.8%] 2xl:top-[26.8%] 2xl:left-[6.5%] lg:w-[68%] 2xl:h-[8.8%] 2xl:w-[90%] min-h-11 px-3 sm:px-4 flex items-center justify-between rounded-lg sm:rounded-xl bg-linear-to-r from-[#0a1738] via-[#0c1f4e] to-[#0a1738] border border-blue-500/60 shadow-[0_0_15px_rgba(37,99,235,0.25)]">
          {/* Left: 3D Gold Cube + Text */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]">
              <svg viewBox="0 0 32 32" className="w-full h-full">
                <path d="M16 3 L29 10.5 L16 18 L3 10.5 Z" fill="#fde047" stroke="#fef08a" strokeWidth="0.8" />
                <path d="M3 10.5 L16 18 L16 30 L3 22.5 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="0.8" />
                <path d="M16 18 L29 10.5 L29 22.5 L16 30 Z" fill="#ca8a04" stroke="#a16207" strokeWidth="0.8" />
              </svg>
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-wider text-amber-400">
                UNBANKED BITS
              </span>
            </div>
          </div>

          {/* Right: +{unbankedBits} BITS */}
          <div className="flex items-baseline gap-1">
            <span className="font-mono font-black text-base sm:text-xl md:text-2xl text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
              +{unbankedBits}
            </span>
            <span className="text-[9.5px] sm:text-xs font-black text-yellow-500 tracking-wider">
              BITS
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* LAYER 2: Inner Question Layout Asset                         */}
        {/* Sits precisely between unbanked bits and helper footer       */}
        {/* ============================================================ */}
        <div
          className="absolute top-[40%] 2xl:top-[37.0%] left-[15.2%] 2xl:left-[3.2%] w-[70%] h-[40%] 2xl:w-[95.6%] 2xl:h-[60.8%] pointer-events-none select-none z-12 overflow-hidden"
          style={{
            clipPath: QUESTION_LAYOUT_CLIP,
          }}
        >
          <Image
            src="/territory_img/question_layout.png"
            alt="Question Layout Frame"
            fill
            priority
            sizes="(max-width: 1536px) 600px, 650px"
            className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none"
          />
        </div>

        {/* ============================================================ */}
        {/* LAYER 3: Dynamic Question HTML Content                       */}
        {/* Positioned directly inside question_layout.png               */}
        {/* ============================================================ */}
        <div
  className="
    absolute

    top-[40%]
    left-[17%]
    w-[65%]
    h-[36%]

    2xl:top-[36.5%]
    2xl:left-[7.2%]
    2xl:w-[85.6%]
    2xl:h-[49.5%]

    z-20
    p-1.5 sm:p-2.5 md:p-3
    flex flex-col
    overflow-y-auto
    [scrollbar-width:none]
    [&::-webkit-scrollbar]:hidden
  "
>
          <QuestionCard
            question={currentQuestion}
            selectedOptionKey={selectedOptionKey}
            isAnswered={isAnswered}
            isCorrect={isCorrect}
            onSelectOption={handleOptionSelect}
          />
        </div>

        {/* ============================================================ */}
        {/* Dynamic Footer (Helper Pill / Action Phase / Lost Notice)    */}
        {/* Sits on the cream parchment below question_layout            */}
        {/* ============================================================ */}
        <div className="absolute z-20 lg:w-[40%] 2xl:w-[80%] lg:top-[80%] lg:left-[30%] 2xl:top-[86.8%] 2xl:left-[9.5%]  right-[9.5%] h-[5.6%] min-h-7.5 sm:min-h-8.5 flex items-center justify-center rounded-lg">
          {/* Decision state: Bank vs Continue */}
          {sessionStatus === 'decision' && (
            <div className="w-ful lg:bg-black/80 lg:rounded-2xl 2xl:bg-black/0 h-full flex items-center justify-between gap-2 animate-in fade-in duration-150">

              <div className="flex items-center gap-2 sm:gap-3 flex-1 sm:flex-initial justify-end w-full sm:w-auto h-full">
                {/* Bank button */}
                <button
                  type="button"
                  onClick={handleBankAction}
                  className="flex-1 sm:flex-initial h-full px-2.5 sm:px-4 md:px-5 flex items-center justify-center gap-1 sm:gap-1.5 bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 font-black text-[9px] min-[400px]:text-[10px] sm:text-xs md:text-sm uppercase tracking-wide shadow-[0_0_15px_rgba(16,185,129,0.5)] active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                  style={{
                    clipPath: ACTION_BTN_CLIP,
                  }}
                >
                  <FiShield className="size-3 2xl:size-3.5 stroke-[2.5] shrink-0" />
                  <span>Bank (+{unbankedBits} Bits)</span>
                </button>

                {/* Continue / Risk It button */}
                <button
                  type="button"
                  onClick={continueToNextQuestion}
                  className="flex-1 sm:flex-initial lg:w-57.5 2xl:w-65 h-full px-2 sm:px-3.5 md:px-5 flex items-center justify-center gap-1 sm:gap-1.5 bg-linear-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-amber-400 text-zinc-950 font-black text-[8px] min-[400px]:text-[9.5px] sm:text-xs 2xl:text-sm uppercase tracking-wide shadow-[0_0_15px_rgba(250,204,21,0.5)] active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                  style={{
                    clipPath: ACTION_BTN_CLIP,
                  }}
                >
                  <span>RISK IT AND EARN +{nextReward} BITS</span>
                  <FiArrowRight className="size-3 sm:size-3.5 stroke-[2.5] shrink-0" />
                </button>
              </div>
            </div>
          )}

          {/* Lost state */}
          {sessionStatus === 'lost' && (
            <div className="w-full h-full flex items-center justify-between gap-2 px-3 sm:px-4 rounded-xl bg-linear-to-r from-rose-950/80 via-red-950/70 to-rose-950/80 border border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.35)] animate-in fade-in duration-150">
              <div className="flex items-center gap-1.5 text-rose-300 font-bold text-[9.5px] sm:text-xs md:text-sm">
                <FiAlertTriangle className="size-3.5 text-rose-400 shrink-0" />
                <span>
                  {lostBitsAmount > 0
                    ? `Incorrect! Lost ${lostBitsAmount} unbanked Bits!`
                    : 'Incorrect answer! Session ended.'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="px-2.5 sm:px-3.5 py-0.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold text-[9px] sm:text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
              >
                Return to Board
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
