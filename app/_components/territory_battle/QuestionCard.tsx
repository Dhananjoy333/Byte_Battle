'use client';

import React from 'react';
import { TerritoryQuestion, QuestionOption } from './data/questions';
import { FiCheck, FiX } from 'react-icons/fi';

interface QuestionCardProps {
  question: TerritoryQuestion;
  selectedOptionKey: 'A' | 'B' | 'C' | 'D' | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
  onSelectOption: (key: 'A' | 'B' | 'C' | 'D') => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOptionKey,
  isAnswered,
  isCorrect,
  onSelectOption,
}) => {
  return (
    <div className="w-full flex flex-col gap-3 select-none">
      {/* Category & Reward Badges */}
      <div className="flex items-center justify-between gap-2">
        <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider bg-zinc-800/80 text-yellow-300 border border-yellow-400/30">
          {question.category}
        </span>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
          +{question.reward} Bits
        </span>
      </div>

      {/* Question Prompt */}
      <h3 className="text-sm sm:text-base md:text-lg font-bold text-zinc-100 leading-snug">
        {question.prompt}
      </h3>

      {/* Code Snippet if present */}
      {question.codeSnippet && (
        <div className="relative rounded-xl bg-black/70 border border-zinc-800 p-3 sm:p-3.5 font-mono text-xs sm:text-sm text-cyan-300 overflow-x-auto shadow-inner">
          <pre className="whitespace-pre-wrap font-mono">{question.codeSnippet}</pre>
        </div>
      )}

      {/* Options Grid (A, B, C, D) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 mt-1">
        {question.options.map((opt: QuestionOption) => {
          const isSelected = selectedOptionKey === opt.key;
          const isThisCorrect = opt.key === question.correctAnswer;

          let optionStyle =
            'relative flex items-center gap-3 p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-[background-color,border-color,color] duration-75 select-none';
          if (!isAnswered) {
            // Idle / answering state
            optionStyle +=
              ' bg-zinc-900/85 hover:bg-zinc-800/90 border-zinc-800 hover:border-yellow-400/50 hover:text-yellow-200 text-zinc-200 cursor-pointer active:scale-[0.98] shadow-sm';
          } else {
            // Post-answer state
            if (isThisCorrect) {
              // Always show correct answer in green
              optionStyle +=
                ' bg-emerald-950/90 border-emerald-400 text-emerald-200 shadow-[0_0_16px_rgba(52,211,153,0.5)] font-semibold';
            } else if (isSelected && !isThisCorrect) {
              // Selected wrong answer in red
              optionStyle +=
                ' bg-rose-950/90 border-rose-500 text-rose-200 shadow-[0_0_16px_rgba(244,63,94,0.5)] font-semibold';
            } else {
              // Unselected other answers
              optionStyle += ' bg-zinc-950/50 border-zinc-850 text-zinc-500 opacity-60 cursor-default';
            }
          }

          return (
            <button
              key={opt.key}
              type="button"
              disabled={isAnswered}
              onClick={() => onSelectOption(opt.key)}
              className={optionStyle}
            >
              {/* Option Key Badge (A, B, C, D) */}
              <span
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center font-bold font-mono text-xs sm:text-sm shrink-0 border ${!isAnswered
                    ? 'bg-zinc-800 border-zinc-700 text-zinc-300'
                    : isThisCorrect
                      ? 'bg-emerald-500 border-emerald-300 text-zinc-950 font-black'
                      : isSelected
                        ? 'bg-rose-500 border-rose-300 text-zinc-950 font-black'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                  }`}
              >
                {isAnswered && isThisCorrect ? (
                  <FiCheck className="size-3.5 sm:size-4 stroke-[3]" />
                ) : isAnswered && isSelected ? (
                  <FiX className="size-3.5 sm:size-4 stroke-[3]" />
                ) : (
                  opt.key
                )}
              </span>

              {/* Option text */}
              <span className="flex-1 leading-snug">{opt.text}</span>
            </button>
          );
        })}
      </div>

      {/* Brief Explanation if answered */}
      {isAnswered && question.explanation && (
        <div
          className={`p-2.5 rounded-lg border text-[11px] sm:text-xs leading-relaxed animate-in fade-in duration-200 ${isCorrect
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
            }`}
        >
          <span className="font-bold mr-1">
            {isCorrect ? '✓ Correct:' : '✗ Solution:'}
          </span>
          {question.explanation}
        </div>
      )}
    </div>
  );
};
