'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { Cell, CellOwner } from './types';
import { TerritoryQuestion, QuestionOption } from './data/questions';
import { FiClock, FiCheck, FiX, FiAward, FiAlertTriangle, FiZap } from 'react-icons/fi';

const IMAGEKIT_URL = process.env.NEXT_PUBLIC_IMAGEKIT_URL;

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

// Chamfered polygon for answer options (outer border)
const OPTION_OUTER_CLIP =
  'polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)';

// Chamfered polygon for answer options (inner content)
const OPTION_INNER_CLIP =
  'polygon(8.5px 0, calc(100% - 8.5px) 0, 100% 8.5px, 100% calc(100% - 8.5px), calc(100% - 8.5px) 100%, 8.5px 100%, 0 calc(100% - 8.5px), 0 8.5px)';

// Chamfered polygon for option badge [A, B, C, D]
const BADGE_CLIP =
  'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)';

// Chamfer polygon for action button
const ACTION_BTN_CLIP =
  'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)';

/**
 * Tokenizes and highlights prompt text: keywords or terms like `typeof NaN`,
 * `Promise`, `const`, `reduce`, `Map`, etc. are styled in bright arcade gold/yellow.
 */
function renderHighlightedPrompt(prompt: string): React.ReactNode {
  if (prompt.includes('`')) {
    const parts = prompt.split(/(`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <span key={i} className="text-yellow-400 font-mono font-bold tracking-tight">
            {part.slice(1, -1)}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  }

  const highlightRegex =
    /(typeof NaN|typeof\s+\w+|Promise\.resolve|Hash Table|Map|const|reduce|closure|sessionStorage|localStorage|Partial<T>|TypeError|O\(1\)|O\(n\)|O\(log n\)|O\(n²\))/g;

  const segments = prompt.split(highlightRegex);
  return segments.map((seg, i) => {
    if (seg.match(highlightRegex)) {
      return (
        <span key={i} className="text-yellow-400 font-mono font-bold tracking-tight">
          {seg}
        </span>
      );
    }
    return <span key={i}>{seg}</span>;
  });
}

/**
 * Syntax highlighter for code snippet lines
 */
function renderSyntaxHighlightedCode(code: string): React.ReactNode {
  const lines = code.split('\n');

  return lines.map((line, lineIdx) => {
    const tokenRegex =
      /(\/\/.*$)|(".*?"|'.*?'|`.*?`)|(\b(?:const|let|var|typeof|type|function|return|new|if|else|import|from|export)\b)|(\b(?:console|Promise|Partial|User|Map|Set|Math|Number|String|Array|Object)\b)|(\b(?:log|resolve|then|catch|reduce|map|filter|forEach|bind)\b)|(\b\d+\b)|([a-zA-Z_$][a-zA-Z0-9_$]*)|([^\s\w]+|\s+)/g;

    const tokens: React.ReactNode[] = [];
    let match: RegExpExecArray | null;
    let keyIdx = 0;

    while ((match = tokenRegex.exec(line)) !== null) {
      const [
        token,
        comment,
        stringLit,
        keyword,
        builtin,
        method,
        numberLit,
        identifier,
        other,
      ] = match;

      if (comment) {
        tokens.push(
          <span key={keyIdx++} className="text-zinc-500 italic">
            {token}
          </span>
        );
      } else if (stringLit) {
        tokens.push(
          <span key={keyIdx++} className="text-emerald-300 font-medium">
            {token}
          </span>
        );
      } else if (keyword) {
        tokens.push(
          <span key={keyIdx++} className="text-yellow-400 font-bold">
            {token}
          </span>
        );
      } else if (builtin) {
        tokens.push(
          <span key={keyIdx++} className="text-cyan-300 font-semibold">
            {token}
          </span>
        );
      } else if (method) {
        tokens.push(
          <span key={keyIdx++} className="text-sky-300">
            {token}
          </span>
        );
      } else if (numberLit) {
        tokens.push(
          <span key={keyIdx++} className="text-amber-300">
            {token}
          </span>
        );
      } else if (identifier) {
        tokens.push(
          <span key={keyIdx++} className="text-blue-100">
            {token}
          </span>
        );
      } else {
        tokens.push(
          <span key={keyIdx++} className="text-zinc-300">
            {other || token}
          </span>
        );
      }
    }

    return (
      <div key={lineIdx} className="leading-relaxed">
        {tokens}
      </div>
    );
  });
}

export const CellDuelModal: React.FC<CellDuelModalProps> = ({
  isOpen,
  cell,
  attacker,
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
  // Handle keyboard escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onFinishDuel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onFinishDuel]);

  if (!isOpen || !question || !cell) {
    return null;
  }

  const isP1Attacker = attacker === 'player1';
  const isP1Winner = winner === 'player1';

  // Format countdown mm:ss
  const formattedTime = `00:${timeLeft.toString().padStart(2, '0')}`;
  const isTimeCritical = timeLeft <= 3 && !isResolved;

  // Parse Category into Category + Subcategory if delimited by '//'
  const categoryParts = question.category.split('//').map((p) => p.trim());
  const mainCategory = categoryParts[0] || question.category;
  const subCategory = categoryParts[1] || '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Contest Match Cell Duel"
    >
      {/* ============================================================== */}
      {/* Main Composition Container                                    */}
      {/* Outer frame: 1202 x 908 (aspect ratio ~ 1.324)                */}
      {/* Scales proportionally, preserves visual integrity              */}
      {/* ============================================================== */}
      <div className="relative w-[min(96vw,840px)] 2xl:w-[min(94vw,980px)] aspect-1202/908 max-h-[96vh] flex items-center justify-center my-auto shrink-0 select-none">
        {/* ============================================================ */}
        {/* LAYER 0: Outer Frame (contest_match_frame.png)               */}
        {/* Contains the metallic frame, crown, CONTEST MATCH title      */}
        {/* ============================================================ */}
        <Image
          src={`${IMAGEKIT_URL}/territory_img/contest_match_frame.png`}
          alt="Contest Match Frame"
          fill
          priority
          sizes="(max-width: 1536px) 840px, 980px"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0"
        />
        {/* ============================================================ */}
        {/* LAYER 1: Dynamic Text Below "CONTEST MATCH"                  */}
        {/* Sits precisely inside the dark slot with red glowing line    */}
        {/* ============================================================ */}
        <div className="absolute z-10 top-[27.9%] inset-x-[15%] h-[4.5%] flex items-center justify-center pointer-events-none">
          <span className="font-mono font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[8.5px] min-[420px]:text-[10px] sm:text-xs md:text-sm text-zinc-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
            CONTESTING FOR THE CELL ({cell.row}, {cell.col})
          </span>
        </div>

        {/* ============================================================ */}
        {/* LAYER 2: VS Banner (vs_banner.png) + Player Info              */}
        {/* Sits directly below the contest description text             */}
        {/* ============================================================ */}
        <div className="absolute z-15 top-[33.2%] left-[10.5%] right-[10.5%] w-[79%] h-[9.8%]">
          {/* Banner Graphic Asset */}
          <Image
            src={`${IMAGEKIT_URL}/territory_img/vs_banner.png`}
            alt="Versus Banner"
            fill
            priority
            sizes="(max-width: 1536px) 680px, 800px"
            className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none"
          />

          {/* Player 1 (Blue Side - Left) */}
          <div className="absolute inset-y-0 left-0 w-[42%] flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-4 md:px-5">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)] shrink-0" />
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="font-sans translate-y-2 font-black uppercase tracking-wider text-[9px] min-[420px]:text-[10px] sm:text-xs md:text-sm text-cyan-300 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)] truncate">
                PLAYER 1 (YOU)
              </span>
              <span className="text-[7.5px] min-[420px]:text-[8.5px] sm:text-[10px] md:text-xs text-blue-200/90 font-medium truncate">
                {playerAnswer ? `Answered [${playerAnswer}]` : 'First to solve wins!'}
              </span>
            </div>
          </div>

          {/* Player 2 (Red Side - Right) */}
          <div className="absolute inset-y-0 right-0 w-[42%] flex items-center justify-end gap-1.5 sm:gap-2.5 px-3 sm:px-4 md:px-5">
            <div className="flex flex-col items-end min-w-0 leading-tight">
              <span className="font-sans font-black uppercase tracking-wider text-[9px] min-[420px]:text-[10px] sm:text-xs md:text-sm text-rose-400 drop-shadow-[0_0_6px_rgba(244,63,94,0.8)] truncate">
                PLAYER 2 (AI)
              </span>
              <div className="flex items-center gap-1 text-[7.5px] min-[420px]:text-[8.5px] sm:text-[10px] md:text-xs font-semibold truncate">
                {aiStatus === 'thinking' && (
                  <span className="inline-flex items-center gap-0.5 text-amber-300 font-mono">
                    <FiZap className="size-2.5 sm:size-3 animate-spin" />
                    THINKING...
                  </span>
                )}
                {aiStatus === 'wrong' && (
                  <span className="inline-flex items-center gap-0.5 text-rose-400 font-mono font-bold">
                    <FiX className="size-2.5 sm:size-3 stroke-3" />
                    WRONG ANSWER
                  </span>
                )}
                {aiStatus === 'correct' && (
                  <span className="inline-flex items-center gap-0.5 text-emerald-400 font-mono font-bold">
                    <FiCheck className="size-2.5 sm:size-3 stroke-3" />
                    CORRECT!
                  </span>
                )}
              </div>
            </div>
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)] shrink-0" />
          </div>
        </div>

        {/* ============================================================ */}
        {/* LAYER 3: Question Frame Asset (contest_question_layout.png)  */}
        {/* Sits directly below VS banner, frames the question & options */}
        {/* ============================================================ */}
        <div className="absolute z-20 top-[43.8%] left-[10.5%] right-[10.5%] w-[79%] h-[40.2%] pointer-events-none select-none">
          <Image
            src={`${IMAGEKIT_URL}/territory_img/contest_question_layout.png`}
            alt="Contest Question Frame"
            fill
            priority
            sizes="(max-width: 1536px) 680px, 800px"
            className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none"
          />
        </div>

        {/* ============================================================ */}
        {/* LAYER 4: Dynamic Question HTML Content & Answer Options      */}
        {/* Positioned inside contest_question_layout                    */}
        {/* ============================================================ */}
        <div className="absolute z-30 top-[43.8%] left-[10.5%] right-[10.5%] w-[79%] h-[40.2%] p-2 sm:p-3 md:p-3.5 flex flex-col justify-between overflow-hidden">
          {/* Top chamfer tabs: Category (left) & Timer (right) */}
          <div className="relative w-[90%] left-12 bottom-2 h-[18%] flex items-center justify-between shrink-0 pointer-events-none">
            {/* Category Tab (Top-Left cutout) */}
            <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 text-[8.5px] min-[420px]:text-[9.5px] sm:text-[11px] md:text-xs font-mono font-black uppercase tracking-wider text-yellow-400 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              <span>{mainCategory}</span>
              {subCategory && (
                <>
                  <span className="text-yellow-500 font-sans font-black">{'//'}</span>
                  <span className="text-zinc-200">{subCategory}</span>
                </>
              )}
            </div>

            {/* Countdown Timer Tab (Top-Right cutout) */}
            <div
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 font-mono font-black text-[11px] sm:text-xs md:text-sm tracking-wider transition-colors ${
                isTimeCritical
                  ? 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.8)] animate-pulse'
                  : 'text-amber-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]'
              }`}
            >
              <FiClock className="size-3 sm:size-3.5 stroke-[2.5] shrink-0" />
              <span>{formattedTime}</span>
            </div>
          </div>

          {/* Question Prompt & Code Snippet */}
          <div className="flex-1 min-h-0 flex flex-col justify-center gap-1 sm:gap-1.5 px-1 sm:px-2 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <h3 className="text-[10px] min-[420px]:text-[11px] sm:text-xs md:text-[13px] font-bold text-zinc-100 leading-snug drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
              {renderHighlightedPrompt(question.prompt)}
            </h3>

            {question.codeSnippet && (
              <div className="relative rounded-md bg-black/90 border border-red-500/30 px-2 sm:px-2.5 py-0.5 sm:py-1 font-mono text-[8.5px] min-[420px]:text-[9.5px] sm:text-[11px] md:text-xs text-zinc-100 overflow-x-auto shadow-inner">
                <pre className="whitespace-pre font-mono leading-tight">
                  {renderSyntaxHighlightedCode(question.codeSnippet)}
                </pre>
              </div>
            )}
          </div>

          {/* Answer Options: 2x2 Grid with Angular Chamfered Polygons */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mt-1 sm:mt-1.5 shrink-0">
            {question.options.map((opt: QuestionOption) => {
              const isSelected = playerAnswer === opt.key;
              const isThisCorrect = opt.key === question.correctAnswer;

              let outerBg =
                'bg-gradient-to-r from-red-500 via-amber-500 to-red-500 shadow-[0_0_8px_rgba(239,68,68,0.35)]';
              let innerBg = 'bg-gradient-to-b from-[#240608] to-[#120204] text-zinc-100';
              let badgeBorder = 'bg-red-500/80';
              let badgeInner = 'bg-[#1e0507] text-amber-300';
              let pixelColor = 'bg-red-500/70';

              if (!isResolved) {
                // Interactive / Idle state
                outerBg =
                  'bg-gradient-to-r from-red-600 via-amber-500 to-red-600 group-hover:from-amber-400 group-hover:via-yellow-400 group-hover:to-amber-400 shadow-[0_0_8px_rgba(239,68,68,0.3)] group-hover:shadow-[0_0_14px_rgba(250,204,21,0.6)]';
                innerBg =
                  'bg-gradient-to-b from-[#240608] to-[#120204] group-hover:from-[#350a0d] group-hover:to-[#1f0305] text-zinc-100 group-hover:text-yellow-200';
              } else {
                // Resolved state
                if (isThisCorrect) {
                  outerBg =
                    'bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.8)]';
                  innerBg = 'bg-gradient-to-b from-[#063e26] to-[#022214] text-emerald-100 font-semibold';
                  badgeBorder = 'bg-emerald-400';
                  badgeInner = 'bg-emerald-500 text-zinc-950 font-black';
                  pixelColor = 'bg-emerald-300';
                } else if (isSelected && !isThisCorrect) {
                  outerBg =
                    'bg-gradient-to-r from-rose-500 via-red-500 to-rose-500 shadow-[0_0_16px_rgba(244,63,94,0.8)]';
                  innerBg = 'bg-gradient-to-b from-[#480d1b] to-[#24040c] text-rose-100 font-semibold';
                  badgeBorder = 'bg-rose-400';
                  badgeInner = 'bg-rose-500 text-white font-black';
                  pixelColor = 'bg-rose-300';
                } else {
                  outerBg = 'bg-zinc-800/60 opacity-50';
                  innerBg = 'bg-zinc-950/90 text-zinc-500 opacity-60';
                  badgeBorder = 'bg-zinc-800';
                  badgeInner = 'bg-zinc-900 text-zinc-600';
                  pixelColor = 'bg-zinc-800';
                }
              }

              return (
                <button
                  key={opt.key}
                  type="button"
                  disabled={isResolved}
                  onClick={() => onSelectOption(opt.key)}
                  className={`group relative  w-full h-8 sm:h-9 md:h-10 p-[1.5px] transition-all duration-150 select-none flex flex-col ${
                    !isResolved ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default'
                  }`}
                  style={{
                    clipPath: OPTION_OUTER_CLIP,
                  }}
                >
                  {/* Outer Chamfer Border */}
                  <div className={`w-full h-full flex-1 flex flex-col ${outerBg} transition-colors duration-150`}>
                    {/* Inner Chamfer Content */}
                    <div
                      className={`w-full h-full flex-1 ${innerBg} flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 relative transition-colors duration-150`}
                      style={{
                        clipPath: OPTION_INNER_CLIP,
                      }}
                    >
                      {/* Pixel Corner Accents */}
                      <div className="absolute top-0.5 left-2 flex gap-0.5 pointer-events-none">
                        <span className={`w-0.5 h-0.5 ${pixelColor}`} />
                        <span className={`w-0.5 h-0.5 ${pixelColor}`} />
                      </div>
                      <div className="absolute top-0.5 right-2 flex gap-0.5 pointer-events-none">
                        <span className={`w-0.5 h-0.5 ${pixelColor}`} />
                        <span className={`w-0.5 h-0.5 ${pixelColor}`} />
                      </div>

                      {/* Chamfered Option Key Badge [A, B, C, D] */}
                      <div
                        className={`w-4 h-4 sm:w-5 sm:h-5 md:w-5.5 md:h-5.5 p-px shrink-0 self-center ${badgeBorder} flex items-center justify-center transition-colors duration-150`}
                        style={{
                          clipPath: BADGE_CLIP,
                        }}
                      >
                        <div
                          className={`w-full h-full ${badgeInner} flex items-center justify-center font-mono font-black text-[9px] sm:text-[10px] md:text-xs`}
                          style={{
                            clipPath: BADGE_CLIP,
                          }}
                        >
                          {isResolved && isThisCorrect ? (
                            <FiCheck className="size-2.5 sm:size-3 stroke-3" />
                          ) : isResolved && isSelected && !isThisCorrect ? (
                            <FiX className="size-2.5 sm:size-3 stroke-3" />
                          ) : (
                            opt.key
                          )}
                        </div>
                      </div>

                      {/* Option Text */}
                      <span className="flex-1 min-w-0 text-left text-[9.5px] min-[420px]:text-[10.5px] sm:text-xs md:text-[12.5px] font-semibold tracking-tight leading-tight truncate">
                        {opt.text}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ========================================================== */}
          {/* Duel Resolution Overlay (Victory / Defeat)                 */}
          {/* ========================================================== */}
          {isResolved && (
            <div className="absolute inset-x-2 inset-y-2 z-40 rounded-xl bg-black/95 backdrop-blur-md border border-yellow-500/50 p-3 sm:p-4 flex flex-col items-center justify-center gap-2 sm:gap-2.5 animate-in fade-in zoom-in-95 duration-200 shadow-[0_0_30px_rgba(0,0,0,0.95)]">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 ${
                  isP1Winner
                    ? 'bg-emerald-500 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.8)]'
                    : 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.8)]'
                }`}
              >
                {isP1Winner ? <FiAward className="size-4 sm:size-5" /> : <FiAlertTriangle className="size-4 sm:size-5" />}
              </div>

              <div className="flex flex-col items-center text-center">
                <span className="text-xs sm:text-sm md:text-base font-black uppercase tracking-wider text-zinc-100">
                  {isP1Winner
                    ? isP1Attacker
                      ? 'VICTORY! Territory Claimed'
                      : 'VICTORY! Territory Defended'
                    : isP1Attacker
                    ? 'DEFEAT! Challenge Failed'
                    : 'DEFEAT! Territory Lost'}
                </span>
                <span className="text-[10px] sm:text-xs text-zinc-300 mt-0.5 max-w-sm">
                  {resolutionReason}
                </span>
              </div>

              <button
                type="button"
                onClick={onFinishDuel}
                className={`py-1.5 sm:py-2 px-5 sm:px-6 font-black text-[10px] sm:text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all cursor-pointer ${
                  isP1Winner
                    ? 'bg-linear-to-r from-emerald-500 via-teal-400 to-emerald-500 text-zinc-950 shadow-[0_0_15px_rgba(52,211,153,0.5)]'
                    : 'bg-linear-to-r from-zinc-800 to-zinc-900 hover:from-zinc-700 hover:to-zinc-800 text-zinc-100 border border-zinc-600'
                }`}
                style={{
                  clipPath: ACTION_BTN_CLIP,
                }}
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
