'use client';

import React from 'react';
import { FloatingTextItem } from '../types';

interface ComboCounterProps {
    comboCount: number;
    floatingTexts: FloatingTextItem[];
}

export const ComboCounter: React.FC<ComboCounterProps> = ({ comboCount, floatingTexts }) => {
    return (
        <div className="absolute inset-0 pointer-events-none z-30 select-none overflow-hidden">
            {/* Combo Streak Counter (Left/Right side) */}
            {comboCount >= 2 && (
                <div className="absolute top-[28%] left-8 md:left-16 flex flex-col items-start animate-bounce">
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl sm:text-6xl md:text-7xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] font-mono">
                            {comboCount}
                        </span>
                        <span className="text-xl sm:text-2xl md:text-3xl font-black italic text-white uppercase tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                            HITS!
                        </span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold tracking-widest text-amber-300 uppercase px-2 py-0.5 bg-black/70 border border-amber-500/60 rounded">
                        {comboCount >= 5 ? 'GREAT STREAK! 🔥' : 'COMBO HIT!'}
                    </span>
                </div>
            )}

            {/* Floating Damage & Action Text Elements */}
            {floatingTexts.map((item) => {
                const isLeft = item.side === 'left';
                const isCenter = item.side === 'center';

                return (
                    <div
                        key={item.id}
                        className={`absolute transition-all duration-700 pointer-events-none animate-float-fade ${
                            isCenter
                                ? 'top-1/3 left-1/2 -translate-x-1/2'
                                : isLeft
                                ? 'top-[42%] left-[22%]'
                                : 'top-[42%] right-[22%]'
                        }`}
                        style={{
                            animation: 'floatUp 0.8s ease-out forwards',
                        }}
                    >
                        <span
                            className={`font-black font-mono tracking-wider drop-shadow-[0_4px_10px_rgba(0,0,0,1)] ${
                                item.type === 'critical'
                                    ? 'text-3xl sm:text-4xl text-amber-300 stroke-red-600 scale-125'
                                    : item.type === 'streak'
                                    ? 'text-xl sm:text-2xl text-cyan-300'
                                    : item.type === 'bonus'
                                    ? 'text-lg sm:text-xl text-emerald-400'
                                    : 'text-2xl sm:text-3xl text-rose-500'
                            }`}
                        >
                            {item.text}
                        </span>
                    </div>
                );
            })}

            {/* Inline Keyframes for Floating Popups */}
            <style jsx global>{`
                @keyframes floatUp {
                    0% {
                        opacity: 0;
                        transform: translateY(12px) scale(0.85);
                    }
                    25% {
                        opacity: 1;
                        transform: translateY(-6px) scale(1.15);
                    }
                    80% {
                        opacity: 0.9;
                        transform: translateY(-28px) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(-44px) scale(0.9);
                    }
                }
            `}</style>
        </div>
    );
};
