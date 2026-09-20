'use client';

import React from 'react';
import { FighterCard } from './FighterCard';
import { MatchTimer } from './MatchTimer';
import { FighterState } from '../types';

interface TopBarProps {
    player: FighterState;
    opponent: FighterState;
    timeLeft: number;
    isTimeOver?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
    player,
    opponent,
    timeLeft,
    isTimeOver = false,
}) => {
    return (
        <header className="relative w-full max-w-7xl mx-auto px-2 sm:px-4 pt-2 sm:pt-3 flex items-start justify-between z-30 select-none">
            {/* Player 1 (Left Fighter) */}
            <div className="flex-1 max-w-[44%]">
                <FighterCard fighter={player} isMirrored={false} />
            </div>

            {/* Match Timer (Center) */}
            <div className="flex-shrink-0 z-10 pt-1">
                <MatchTimer timeLeft={timeLeft} isTimeOver={isTimeOver} />
            </div>

            {/* Player 2 (Right Fighter) */}
            <div className="flex-1 max-w-[44%]">
                <FighterCard fighter={opponent} isMirrored={true} />
            </div>
        </header>
    );
};
