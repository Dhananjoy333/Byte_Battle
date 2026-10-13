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

// Chamfered polygon CSS for option outer border (chamfer corners)
const OPTION_OUTER_CLIP =
  'polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)';

// Chamfered polygon CSS for option inner background (inset 1.5px)
const OPTION_INNER_CLIP =
  'polygon(8.5px 0, calc(100% - 8.5px) 0, 100% 8.5px, 100% calc(100% - 8.5px), calc(100% - 8.5px) 100%, 8.5px 100%, 0 calc(100% - 8.5px), 0 8.5px)';

// Chamfered polygon CSS for option key badge [A, B, C, D]
const BADGE_CLIP =
  'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)';

/**
 * Tokenizes and highlights prompt text: keywords or terms like `typeof NaN`,
 * `Promise`, `const`, `reduce`, `Map`, etc. are styled in bright arcade gold/yellow.
 */
function renderHighlightedPrompt(prompt: string): React.ReactNode {
  // If prompt already uses backticks, e.g. `typeof NaN`
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

  // Common keywords / patterns to highlight
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
    // Regex matching comments, strings, keywords, method calls, numbers
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

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOptionKey,
  isAnswered,
  onSelectOption,
}) => {
  // Parse Category into Category + Subcategory if delimited by '//'
  const categoryParts = question.category.split('//').map((p) => p.trim());
  const mainCategory = categoryParts[0] || question.category;
  const subCategory = categoryParts[1] || '';

  return (
    <div className="relative w-full h-full min-h-0 flex flex-col justify-between select-none">
      {/* ============================================================== */}
      {/* 1. Category Tab (Overlaid on Top-Left chamfer cutout)          */}
      {/* ============================================================== */}
      <div
        className="absolute -top-1 sm:-top-1.5 2xl:top-2.5 left-0 sm:left-1 2xl:left-3 h-6 sm:h-7.5 md:h-8.5 flex items-center px-2 sm:px-3 text-[9px] sm:text-[11px] md:text-xs lg:text-[10px] font-mono font-black uppercase tracking-wider text-cyan-200 pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
      >
        <span>{mainCategory}</span>
        {subCategory && (
          <>
            <span className="text-yellow-400 mx-1 sm:mx-1.5 font-sans font-black">{'//'}</span>
            <span>{subCategory}</span>
          </>
        )}
      </div>

      {/* ============================================================== */}
      {/* 2. Reward Badge (Overlaid on Top-Right chamfer cutout)         */}
      {/* ============================================================== */}
      <div
        className="absolute -top-1 sm:-top-1.5 2xl:top-3 right-0 sm:right-1 lg:-right-3 2xl:-right-3 h-6 sm:h-7.5 md:h-8 flex items-center justify-end px-2 sm:px-3 font-mono font-black text-[11px] sm:text-xs md:text-sm tracking-wide text-cyan-300 pointer-events-none drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
      >
        +{question.reward} BITS
      </div>

      {/* ============================================================== */}
      {/* 3. Question Prompt & Code Snippet Content Area                 */}
      {/* Sits comfortably below the top tabs (margin-top: ~28px)        */}
      {/* ============================================================== */}
      <div className="mt-4 sm:mt-6 md:mt-7 lg:mt-10 2xl:mt-20 flex flex-col gap-1 sm:gap-2">
        {/* Question Prompt */}
        <h3 className="text-xs sm:text-sm md:text-sm 2xl:text-base font-bold text-white leading-snug drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
          {renderHighlightedPrompt(question.prompt)}
        </h3>

        {/* Code Snippet (if available) */}
        {question.codeSnippet && (
          <div className="relative lg:w-[80%] 2xl:w-full rounded-md sm:rounded-lg bg-[#04091a]/95 border border-blue-500/40 px-2 sm:px-3 py-1 sm:py-1.5 font-mono text-[9.5px] sm:text-xs md:text-[12px] text-zinc-100 overflow-x-auto shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)]">
            <pre className="whitespace-pre font-mono leading-tight">
              {renderSyntaxHighlightedCode(question.codeSnippet)}
            </pre>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 4. Answer Options 2x2 Grid (Chamfered Polygons)                */}
      {/* ============================================================== */}
      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-2.5 mt-1.5 sm:mt-2">
        {question.options.map((opt: QuestionOption) => {
          const isSelected = selectedOptionKey === opt.key;
          const isThisCorrect = opt.key === question.correctAnswer;

          // Compute outer border polygon gradient & glow
          let outerBg =
            'bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.35)]';
          let innerBg = 'bg-gradient-to-b from-[#0b1b3d] to-[#061026] text-zinc-100';
          let badgeBorder = 'bg-cyan-400/80';
          let badgeInner = 'bg-[#071330] text-cyan-200';
          let pixelColor = 'bg-cyan-400/70';

          if (!isAnswered) {
            // Idle state: outer hover transitions
            outerBg =
              'bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 group-hover:from-cyan-300 group-hover:via-sky-400 group-hover:to-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.35)] group-hover:shadow-[0_0_14px_rgba(6,182,212,0.7)]';
            innerBg =
              'bg-gradient-to-b from-[#0b1b3d] to-[#061026] group-hover:from-[#102756] group-hover:to-[#09183b] text-zinc-100 group-hover:text-white';
          } else {
            // Post-answer state
            if (isThisCorrect) {
              outerBg =
                'bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.8)]';
              innerBg = 'bg-gradient-to-b from-[#063e26] to-[#022214] text-emerald-100 font-semibold';
              badgeBorder = 'bg-emerald-400';
              badgeInner = 'bg-emerald-500 text-zinc-950';
              pixelColor = 'bg-emerald-300';
            } else if (isSelected && !isThisCorrect) {
              outerBg =
                'bg-gradient-to-r from-rose-500 via-red-500 to-rose-500 shadow-[0_0_16px_rgba(244,63,94,0.8)]';
              innerBg = 'bg-gradient-to-b from-[#480d1b] to-[#24040c] text-rose-100 font-semibold';
              badgeBorder = 'bg-rose-400';
              badgeInner = 'bg-rose-500 text-white';
              pixelColor = 'bg-rose-300';
            } else {
              // Dim other non-selected options
              outerBg = 'bg-zinc-700/60 opacity-50';
              innerBg = 'bg-zinc-900/90 text-zinc-500 opacity-60';
              badgeBorder = 'bg-zinc-700';
              badgeInner = 'bg-zinc-900 text-zinc-600';
              pixelColor = 'bg-zinc-700';
            }
          }

          return (
            <button
              key={opt.key}
              type="button"
              disabled={isAnswered}
              onClick={() => onSelectOption(opt.key)}
              className={`roup relative min-h-8.5 sm:min-h-10 lg:min-h-9 min-[1440px]:min-h-12 p-px sm:p-0.5 transition-all duration-150 select-none flex flex-col ${
                !isAnswered ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default'
              }`}
              style={{
                clipPath: OPTION_OUTER_CLIP,
              }}
            >
              {/* Outer Border Layer */}
              <div className={`w-full h-full flex-1 flex flex-col ${outerBg} transition-colors duration-150`}>
                {/* Inner Chamfered Content Layer */}
                <div
                  className={`w-full h-full flex-1 ${innerBg} flex items-center gap-1.5 sm:gap-2.5 md:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 relative transition-colors duration-150`}
                  style={{
                    clipPath: OPTION_INNER_CLIP,
                  }}
                >
                  {/* Pixel Corner Accents (Subtle 2-pixel dots in corners) */}
                  <div className="absolute top-1 left-2.5 flex gap-0.5 pointer-events-none">
                    <span className={`w-0.5 h-0.5 ${pixelColor}`} />
                    <span className={`w-0.5 h-0.5 ${pixelColor}`} />
                  </div>
                  <div className="absolute top-1 right-2.5 flex gap-0.5 pointer-events-none">
                    <span className={`w-0.5 h-0.5 ${pixelColor}`} />
                    <span className={`w-0.5 h-0.5 ${pixelColor}`} />
                  </div>
                  <div className="absolute bottom-1 left-2.5 flex gap-0.5 pointer-events-none">
                    <span className={`w-0.5 h-0.5 ${pixelColor}`} />
                    <span className={`w-0.5 h-0.5 ${pixelColor}`} />
                  </div>
                  <div className="absolute bottom-1 right-2.5 flex gap-0.5 pointer-events-none">
                    <span className={`w-0.5 h-0.5 ${pixelColor}`} />
                    <span className={`w-0.5 h-0.5 ${pixelColor}`} />
                  </div>

                  {/* Chamfered Option Key Badge [A, B, C, D] */}
                  <div
                    className={`w-5 h-5 sm:w-5 sm:h-5 2xl:w-7 2xl:h-7 p-px shrink-0 self-center ${badgeBorder} flex items-center justify-center transition-colors duration-150`}
                    style={{
                      clipPath: BADGE_CLIP,
                    }}
                  >
                    <div
                      className={`w-full h-full ${badgeInner} flex items-center justify-center font-mono font-black text-[10px] sm:text-xs md:text-sm`}
                      style={{
                        clipPath: BADGE_CLIP,
                      }}
                    >
                      {isAnswered && isThisCorrect ? (
                        <FiCheck className="size-3 sm:size-3.5 md:size-4 stroke-3" />
                      ) : isAnswered && isSelected && !isThisCorrect ? (
                        <FiX className="size-3 sm:size-3.5 md:size-4 stroke-3" />
                      ) : (
                        opt.key
                      )}
                    </div>
                  </div>

                  {/* Option Text */}
                  <span className="flex-1 min-w-0 text-left text-[11px] sm:text-xs md:text-sm font-semibold tracking-tight sm:tracking-normal leading-snug sm:leading-snug wrap-break-word">
                    {opt.text}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
