'use client';

import React from 'react';

interface AnswerTimerBarProps {
    progress: number; // 0 to 100
    multiplier: number; // 2.0, 1.5, 1.0
}

export const AnswerTimerBar: React.FC<AnswerTimerBarProps> = ({ progress, multiplier }) => {
    const clampedProgress = Math.max(0, Math.min(100, progress));

    const getBarColor = () => {
        if (clampedProgress > 50) return 'from-cyan-400 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]';
        if (clampedProgress > 25) return 'from-amber-400 to-yellow-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]';
        return 'from-rose-500 to-red-600 shadow-[0_0_10px_rgba(244,63,94,0.8)] animate-pulse';
    };

    return (
        <div className="w-full flex flex-col gap-1 select-none">
            {/* Top info row: Speed bonus status */}
            <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono">
                <span className="text-neutral-400 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    TURN TIMER
                </span>
                <span
                    className={`font-black tracking-wider ${
                        multiplier >= 2.0
                            ? 'text-cyan-300 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]'
                            : multiplier >= 1.5
                            ? 'text-amber-300'
                            : 'text-neutral-400'
                    }`}
                >
                    SPEED BONUS x{multiplier.toFixed(1)}
                </span>
            </div>

            {/* Timer Progress Bar */}
            <div className="relative h-2 sm:h-2.5 w-full bg-black/80 rounded-[2px] p-[1px] border border-neutral-700/80 overflow-hidden">
                <div
                    className={`h-full bg-gradient-to-r transition-all duration-100 ease-linear ${getBarColor()}`}
                    style={{ width: `${clampedProgress}%` }}
                />
            </div>
        </div>
    );
};
