'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FighterState } from '../types';

interface FighterCardProps {
    fighter: FighterState;
    isMirrored?: boolean; // True for player 2 / right side
}

export const FighterCard: React.FC<FighterCardProps> = ({ fighter, isMirrored = false }) => {
    const [lagHp, setLagHp] = useState(fighter.currentHp);

    // Fighting game ghost bar lag effect (yellow trailing health drop)
    useEffect(() => {
        if (fighter.currentHp < lagHp) {
            const timer = setTimeout(() => {
                setLagHp(fighter.currentHp);
            }, 600);
            return () => clearTimeout(timer);
        } else {
            setLagHp(fighter.currentHp);
        }
    }, [fighter.currentHp, lagHp]);

    const hpPercentage = Math.max(0, Math.min(100, (fighter.currentHp / fighter.maxHp) * 100));
    const lagHpPercentage = Math.max(0, Math.min(100, (lagHp / fighter.maxHp) * 100));
    const isCritical = fighter.currentHp <= 25 && fighter.currentHp > 0;

    return (
        <div
            className={`flex items-center gap-2.5 sm:gap-3.5 select-none ${
                isMirrored ? 'flex-row-reverse' : 'flex-row'
            }`}
        >
            {/* Fighter Portrait with Arcade Pixel Frame */}
            <div className="relative group">
                <div
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-neutral-900 border-2 sm:border-[3px] ${
                        fighter.isHurt
                            ? 'border-red-500 scale-95 brightness-150'
                            : 'border-neutral-400/90 shadow-[0_0_12px_rgba(0,0,0,0.8)]'
                    } overflow-hidden rounded-xs transition-transform duration-100`}
                >
                    <Image
                        src={fighter.portraitUrl}
                        alt={fighter.name}
                        fill
                        priority
                        className={`object-cover ${isMirrored ? 'scale-x-[-1]' : ''} ${
                            fighter.isHurt ? 'animate-pulse contrast-150' : ''
                        }`}
                    />

                    {/* Hurt Red Flash Overlay */}
                    {fighter.isHurt && (
                        <div className="absolute inset-0 bg-red-600/40 animate-ping pointer-events-none" />
                    )}

                    {/* Subtle Scanline Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />

                    {/* Corner Pixel Accents */}
                    <span className="absolute top-0 left-0 w-1 h-1 bg-white" />
                    <span className="absolute top-0 right-0 w-1 h-1 bg-white" />
                    <span className="absolute bottom-0 left-0 w-1 h-1 bg-white" />
                    <span className="absolute bottom-0 right-0 w-1 h-1 bg-white" />
                </div>
            </div>

            {/* Health Bar, Name, Title, and Round Dots */}
            <div className={`flex flex-col flex-1 min-w-[140px] sm:min-w-[200px] md:min-w-[280px] lg:min-w-[340px] ${
                isMirrored ? 'items-end' : 'items-start'
            }`}>
                {/* Fighter Name & Title */}
                <div
                    className={`flex items-baseline gap-2 mb-1 leading-none ${
                        isMirrored ? 'flex-row-reverse text-right' : 'flex-row text-left'
                    }`}
                >
                    <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-wider text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-mono">
                        {fighter.name}
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold tracking-widest text-red-500 uppercase drop-shadow-[0_0_6px_rgba(239,68,68,0.6)] hidden xs:inline-block font-sans">
                        {fighter.title}
                    </span>
                </div>

                {/* Main Health Bar Container */}
                <div className="relative w-full h-5 sm:h-6 md:h-7 bg-black/90 p-[2px] sm:p-[3px] border-2 border-neutral-300/80 shadow-[0_0_10px_rgba(0,0,0,0.9)] rounded-[2px]">
                    {/* Interior Bar Track */}
                    <div className="relative w-full h-full bg-neutral-950 overflow-hidden flex">
                        {/* Segmented Grid Lines in Background */}
                        <div className="absolute inset-0 z-10 flex justify-between pointer-events-none opacity-30">
                            {[...Array(9)].map((_, i) => (
                                <div key={i} className="w-[1px] h-full bg-black" />
                            ))}
                        </div>

                        {/* Mirrored or Normal alignment */}
                        <div
                            className={`relative h-full w-full flex ${
                                isMirrored ? 'justify-start flex-row-reverse' : 'justify-start'
                            }`}
                        >
                            {/* Lag Damage Ghost Bar (Yellow/Orange) */}
                            <div
                                className="absolute top-0 bottom-0 bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-500 ease-out"
                                style={{
                                    width: `${lagHpPercentage}%`,
                                    [isMirrored ? 'right' : 'left']: 0,
                                }}
                            />

                            {/* Active Health Bar (Neon Green or Critical Red) */}
                            <div
                                className={`relative h-full transition-all duration-200 ease-out ${
                                    isCritical
                                        ? 'bg-gradient-to-r from-red-600 via-rose-500 to-red-400 animate-pulse'
                                        : 'bg-gradient-to-b from-[#7bf15e] via-[#22c55e] to-[#15803d]'
                                } shadow-[0_0_8px_rgba(34,197,94,0.7)]`}
                                style={{
                                    width: `${hpPercentage}%`,
                                }}
                            >
                                {/* Top Gloss Highlight Line */}
                                <div className="absolute top-0 left-0 right-0 h-[25%] bg-white/40 pointer-events-none" />
                            </div>
                        </div>

                        {/* Numeric HP readout */}
                        <div
                            className={`absolute inset-0 z-20 flex items-center px-2 text-[10px] sm:text-xs font-mono font-black text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,1)] ${
                                isMirrored ? 'justify-start' : 'justify-end'
                            }`}
                        >
                            {fighter.currentHp} / {fighter.maxHp}
                        </div>
                    </div>

                    {/* Chamfered Edge Accents */}
                    <div
                        className={`absolute -top-1 ${
                            isMirrored ? '-right-1' : '-left-1'
                        } w-1.5 h-1.5 bg-neutral-200`}
                    />
                </div>

                {/* Round Win Diamond Dots */}
                <div
                    className={`flex items-center gap-1.5 sm:gap-2 mt-1.5 ${
                        isMirrored ? 'flex-row-reverse' : 'flex-row'
                    }`}
                >
                    {[...Array(fighter.maxRounds || 2)].map((_, idx) => {
                        const isWon = idx < fighter.roundsWon;
                        return (
                            <div
                                key={idx}
                                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rotate-45 border transition-all duration-300 ${
                                    isWon
                                        ? 'bg-amber-400 border-amber-200 shadow-[0_0_8px_#f59e0b] scale-110'
                                        : 'bg-neutral-900/90 border-neutral-500/70 shadow-inner'
                                }`}
                                title={isWon ? `Round ${idx + 1} Won` : `Round ${idx + 1}`}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
