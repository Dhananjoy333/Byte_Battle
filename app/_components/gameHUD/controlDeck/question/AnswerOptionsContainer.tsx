'use client';

import React from 'react';
import { TriviaOption } from '../../types';

interface AnswerOptionsContainerProps {
    options: TriviaOption[];
    selectedKey: string | null;
    correctKey?: string | null;
    isAnswered: boolean;
    onSelectOption: (key: 'A' | 'B' | 'C' | 'D') => void;
}

export const AnswerOptionsContainer: React.FC<AnswerOptionsContainerProps> = ({
    options,
    selectedKey,
    correctKey,
    isAnswered,
    onSelectOption,
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full select-none">
            {options.map((option) => {
                const isSelected = selectedKey === option.key;
                const isCorrect = isAnswered && correctKey === option.key;
                const isWrong = isAnswered && isSelected && correctKey !== option.key;

                let stateClasses =
                    'bg-neutral-900/90 border-neutral-700/80 text-neutral-200 hover:bg-neutral-800 hover:border-neutral-500 hover:text-white';

                if (isCorrect) {
                    stateClasses =
                        'bg-emerald-950/90 border-emerald-400 text-emerald-200 shadow-[0_0_12px_rgba(52,211,153,0.6)] animate-pulse';
                } else if (isWrong) {
                    stateClasses =
                        'bg-rose-950/90 border-rose-500 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.6)]';
                } else if (isSelected) {
                    stateClasses =
                        'bg-cyan-950/90 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.5)]';
                }

                return (
                    <button
                        key={option.key}
                        onClick={() => !isAnswered && onSelectOption(option.key)}
                        disabled={isAnswered}
                        className={`group relative flex items-center gap-2.5 p-2 sm:p-2.5 rounded border transition-all duration-150 text-left ${stateClasses} ${
                            isAnswered ? 'cursor-default' : 'cursor-pointer active:scale-[0.98]'
                        }`}
                    >
                        {/* Hotkey Badge [A], [B], [C], [D] */}
                        <span
                            className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-xs font-mono text-xs font-black border transition-colors ${
                                isCorrect
                                    ? 'bg-emerald-500 text-black border-emerald-300'
                                    : isWrong
                                    ? 'bg-rose-600 text-white border-rose-400'
                                    : isSelected
                                    ? 'bg-cyan-400 text-black border-cyan-200'
                                    : 'bg-black/60 text-neutral-400 border-neutral-700 group-hover:border-neutral-400 group-hover:text-white'
                            }`}
                        >
                            {option.key}
                        </span>

                        {/* Option Text */}
                        <span className="text-xs sm:text-sm font-medium flex-1 truncate">
                            {option.text}
                        </span>

                        {/* Status Icon Indicator */}
                        {isCorrect && (
                            <span className="text-emerald-400 font-bold text-sm">✓</span>
                        )}
                        {isWrong && (
                            <span className="text-rose-400 font-bold text-sm">✗</span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};
