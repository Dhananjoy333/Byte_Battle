'use client';

import React from 'react';

interface MatchTimerProps {
    timeLeft: number;
    isTimeOver?: boolean;
}

export const MatchTimer: React.FC<MatchTimerProps> = ({ timeLeft, isTimeOver = false }) => {
    const isCritical = timeLeft <= 10 && !isTimeOver;
    const formattedDigits = isTimeOver
        ? '00'
        : Math.max(0, Math.min(99, timeLeft)).toString().padStart(2, '0');

    return (
        <div className="relative flex flex-col items-center justify-center select-none mx-1 sm:mx-3">
            {/* Hexagonal / Faceted Arcade Timer Outer Frame */}
            <div
                className={`relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-neutral-950 border-2 sm:border-[3px] ${
                    isCritical
                        ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)] animate-pulse'
                        : isTimeOver
                        ? 'border-neutral-600'
                        : 'border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                } transition-all duration-200`}
                style={{
                    clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
                }}
            >
                {/* Inner Border Layer */}
                <div
                    className="absolute inset-[3px] sm:inset-[4px] bg-gradient-to-b from-neutral-900 to-black flex items-center justify-center"
                    style={{
                        clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
                    }}
                >
                    {/* Metallic Horizontal Trim Lines */}
                    <div className="absolute top-1 left-3 right-3 h-[1px] bg-amber-200/40 pointer-events-none" />
                    <div className="absolute bottom-1 left-3 right-3 h-[1px] bg-amber-500/20 pointer-events-none" />

                    {/* Timer Digits */}
                    <span
                        className={`text-2xl sm:text-3xl md:text-4xl font-black font-mono tracking-tighter ${
                            isCritical
                                ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,1)] scale-110'
                                : isTimeOver
                                ? 'text-neutral-500'
                                : 'text-amber-300 drop-shadow-[0_2px_8px_rgba(251,191,36,0.8)]'
                        } transition-transform duration-100`}
                    >
                        {formattedDigits}
                    </span>
                </div>
            </div>

            {/* Time Over Notification Banner below timer if expired */}
            {isTimeOver && (
                <div className="absolute -bottom-5 px-2 py-0.5 bg-red-600 text-white font-mono text-[9px] sm:text-[10px] font-bold tracking-widest uppercase border border-red-300 shadow-md">
                    TIME OVER
                </div>
            )}
        </div>
    );
};
