'use client';

import React from 'react';
import { ActionAbility } from '../../types';

interface ActionButtonProps {
    ability: ActionAbility;
    actionPoints: number;
    onClick: () => void;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ ability, actionPoints, onClick }) => {
    const hasPoints = actionPoints >= ability.pointCost;
    const isSuperLocked = !ability.isReady && ability.type === 'ult' && ability.superCost > 0;
    const isOnCooldown = ability.currentCooldown > 0;
    const isAvailable = !isOnCooldown && hasPoints && !isSuperLocked;

    // Cooldown percentage for radial sweep
    const cooldownPercent = isOnCooldown
        ? (ability.currentCooldown / ability.cooldownTotal) * 100
        : 0;

    // Theme configuration based on action type (matching the reference image: Blue, Orange, Red)
    const getTheme = () => {
        switch (ability.type) {
            case 'light':
                return {
                    border: 'border-sky-400',
                    glow: 'shadow-[0_0_20px_rgba(56,189,248,0.7)]',
                    hoverGlow: 'hover:shadow-[0_0_30px_rgba(56,189,248,1)]',
                    bg: 'from-blue-950/90 via-sky-900/60 to-black',
                    accent: '#38bdf8',
                    textColor: 'text-sky-300',
                };
            case 'heavy':
                return {
                    border: 'border-orange-400',
                    glow: 'shadow-[0_0_20px_rgba(251,146,60,0.7)]',
                    hoverGlow: 'hover:shadow-[0_0_30px_rgba(251,146,60,1)]',
                    bg: 'from-orange-950/90 via-amber-900/60 to-black',
                    accent: '#fb923c',
                    textColor: 'text-orange-300',
                };
            case 'ult':
                return {
                    border: ability.isReady ? 'border-red-500 animate-pulse' : 'border-neutral-700',
                    glow: ability.isReady
                        ? 'shadow-[0_0_30px_rgba(239,68,68,0.9)] ring-2 ring-red-400/50'
                        : 'shadow-none',
                    hoverGlow: ability.isReady ? 'hover:shadow-[0_0_40px_rgba(239,68,68,1)]' : '',
                    bg: ability.isReady
                        ? 'from-red-950 via-rose-900/80 to-black'
                        : 'from-neutral-900 via-neutral-950 to-black',
                    accent: ability.isReady ? '#ef4444' : '#525252',
                    textColor: ability.isReady ? 'text-red-400' : 'text-neutral-500',
                };
        }
    };

    const theme = getTheme();

    // Custom SVG Icons
    const renderIcon = () => {
        if (ability.type === 'light') {
            // Punch Fist Icon
            return (
                <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-7 h-7 sm:w-8 sm:h-8 text-sky-200 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]"
                >
                    <path d="M7 6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1v1a2 2 0 0 1-2 2h-1.5a3 3 0 0 1-2.5-1.33A3 3 0 0 1 6 12V7a1 1 0 0 1 1-1zm2 1h4V6H9v1zm5 2H9v2h5V9zm-5 4h4v-1H9v1zm-2-5v3.5a1.5 1.5 0 0 0 1.5 1.5H9v-5H7z" />
                </svg>
            );
        }
        if (ability.type === 'heavy') {
            // Impact Fist with Shockwave
            return (
                <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-7 h-7 sm:w-8 sm:h-8 text-amber-200 drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]"
                >
                    <path d="M4 8l2-2 3 1v2H7L4 8zm16 0l-2-2-3 1v2h2l3-1zm-6-4h-4v2h4V4zm-5 6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1h1a2 2 0 0 1 2 2v3a3 3 0 0 1-3 3h-3a3 3 0 0 1-3-3v-6zm3 1h2v-1h-2v1zm-1 3h4v-1h-4v1zm0 3h4v-1h-4v1z" />
                </svg>
            );
        }
        // Ultimate Flame Icon
        return (
            <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className={`w-8 h-8 sm:w-9 sm:h-9 ${
                    ability.isReady
                        ? 'text-red-300 drop-shadow-[0_0_12px_rgba(239,68,68,1)] animate-pulse'
                        : 'text-neutral-600'
                }`}
            >
                <path d="M12 2c-.5 2-2 3.5-3.5 5.5-1.7 2.2-2.5 4.5-2.5 7 0 4.4 3.6 7.5 8 7.5s8-3.1 8-7.5c0-4-2.8-7.6-5-10.5-.5-.7-1.3-.2-1.2.6.2 2-.5 3.9-1.8 5.4C13.5 8 13.5 5 12 2zm0 18c-2.8 0-5-2-5-4.5 0-1.8.8-3.2 2-4.5 1-1.1 1.6-2.5 1.8-3.8 1.4 1.8 2.2 3.7 2.2 5.3 0 1.2-.5 2.2-1.3 3 .8.2 1.3.8 1.3 1.5 0 1.7-1.3 3-3 3z" />
            </svg>
        );
    };

    return (
        <div className="flex flex-col items-center gap-1 select-none">
            {/* Circular Action Button */}
            <button
                onClick={() => isAvailable && onClick()}
                disabled={!isAvailable}
                aria-label={ability.label}
                className={`relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-[2.5px] sm:border-[3px] bg-gradient-to-b ${theme.bg} ${theme.border} ${theme.glow} ${theme.hoverGlow} transition-all duration-150 ${
                    isAvailable
                        ? 'cursor-pointer active:scale-95 hover:scale-105'
                        : 'cursor-not-allowed opacity-80'
                }`}
            >
                {/* Icon */}
                <div className="relative z-10 flex items-center justify-center">
                    {renderIcon()}
                </div>

                {/* Cooldown Radial / Circular Overlay */}
                {isOnCooldown && (
                    <div className="absolute inset-0 rounded-full overflow-hidden flex items-center justify-center bg-black/75 z-20">
                        {/* Countdown digits */}
                        <span className="font-mono font-black text-sm sm:text-base text-white drop-shadow-md">
                            {ability.currentCooldown.toFixed(1)}s
                        </span>
                        {/* Radial cooldown mask */}
                        <div
                            className="absolute inset-0 bg-neutral-900/60 pointer-events-none"
                            style={{
                                clipPath: `polygon(50% 50%, 50% 0%, ${
                                    cooldownPercent > 12.5 ? '100% 0%,' : ''
                                } ${cooldownPercent > 37.5 ? '100% 100%,' : ''} ${
                                    cooldownPercent > 62.5 ? '0% 100%,' : ''
                                } ${cooldownPercent > 87.5 ? '0% 0%,' : ''} 50% 0%)`,
                            }}
                        />
                    </div>
                )}

                {/* Lock Overlay for Ultimate when Super is not ready */}
                {isSuperLocked && !isOnCooldown && (
                    <div className="absolute inset-0 rounded-full bg-black/85 flex flex-col items-center justify-center z-20 border border-neutral-800">
                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-5 h-5 text-neutral-500"
                        >
                            <path d="M12 2a4 4 0 0 0-4 4v4H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V6a4 4 0 0 0-4-4zm-2 4a2 2 0 1 1 4 0v4h-4V6zm2 9a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
                        </svg>
                        <span className="text-[9px] font-mono text-neutral-500 font-bold uppercase tracking-tighter mt-0.5">
                            SUPER REQ
                        </span>
                    </div>
                )}

                {/* Point Requirement Overlay when not enough points and not on cooldown */}
                {!hasPoints && !isOnCooldown && !isSuperLocked && (
                    <div className="absolute inset-0 rounded-full bg-black/80 flex flex-col items-center justify-center z-20 border border-neutral-800">
                        <span className="text-[10px] sm:text-xs font-mono font-black text-amber-400">
                            {ability.pointCost}P
                        </span>
                        <span className="text-[8px] font-mono text-neutral-400 uppercase font-bold tracking-tight">
                            NEED
                        </span>
                    </div>
                )}

                {/* Hotkey Tag Badge [Q], [W], [E] */}
                <div className="absolute -top-1 -right-1 z-30 px-1.5 py-0.5 bg-black text-[9px] sm:text-[10px] font-mono font-black rounded border border-neutral-600 text-neutral-200 shadow-sm">
                    {ability.hotkey}
                </div>

                {/* Point Cost Badge on Bottom Left */}
                <div
                    className={`absolute -bottom-1 -left-1 z-30 px-1.5 py-0.5 bg-black text-[9px] sm:text-[10px] font-mono font-black rounded border shadow-sm ${
                        hasPoints
                            ? 'border-amber-400/90 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                            : 'border-neutral-700 text-neutral-500'
                    }`}
                >
                    {ability.pointCost}P
                </div>
            </button>

            {/* Label Below Button: LIGHT / HEAVY / ULT */}
            <span
                className={`text-[11px] sm:text-xs font-black font-mono tracking-widest uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,1)] ${theme.textColor}`}
            >
                {ability.label}
            </span>
        </div>
    );
};
