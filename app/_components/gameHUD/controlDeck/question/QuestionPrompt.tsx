'use client';

import React from 'react';
import { TriviaQuestion } from '../../types';

interface QuestionPromptProps {
    question: TriviaQuestion;
}

export const QuestionPrompt: React.FC<QuestionPromptProps> = ({ question }) => {
    return (
        <div className="flex flex-col gap-1.5 w-full select-none">
            {/* Category / Topic Badge */}
            <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] sm:text-xs font-mono font-black uppercase tracking-wider text-cyan-300 bg-cyan-950/80 border border-cyan-500/50 rounded-xs shadow-[0_0_8px_rgba(6,182,212,0.3)]">
                    {question.category}
                </span>
                <span className="text-[10px] font-mono text-neutral-400">
                    BYTE BATTLE TRIVIA
                </span>
            </div>

            {/* Main Question Text */}
            <h2 className="text-sm sm:text-base md:text-lg font-bold text-neutral-100 leading-snug drop-shadow-sm font-sans">
                {question.prompt}
            </h2>

            {/* Optional Code Snippet Container */}
            {question.codeSnippet && (
                <div className="mt-1 bg-black/80 rounded border border-neutral-700/80 p-2 font-mono text-xs text-amber-200/90 overflow-x-auto">
                    <pre className="text-[11px] leading-relaxed">
                        <code>{question.codeSnippet}</code>
                    </pre>
                </div>
            )}
        </div>
    );
};
