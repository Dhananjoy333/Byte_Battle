'use client';

import React from 'react';
import { ActionButton } from './ActionButton';
import { SuperMeterBar } from './SuperMeterBar';
import { ActionAbility, SuperMeterState, ActionType } from '../../types';

interface ActionControlsProps {
    abilities: ActionAbility[];
    superMeter: SuperMeterState;
    actionPoints: number;
    onTriggerAction: (type: ActionType) => void;
}

export const ActionControls: React.FC<ActionControlsProps> = ({
    abilities,
    superMeter,
    actionPoints,
    onTriggerAction,
}) => {
    return (
        <section
            aria-label="Action Deck"
            className="flex flex-col items-center gap-2.5 p-2.5 sm:p-3.5 bg-neutral-950/90 backdrop-blur-md border-2 border-neutral-700/80 rounded-md shadow-[0_10px_30px_rgba(0,0,0,0.8)] min-w-[280px] sm:min-w-[320px] select-none"
        >
            {/* Header: Action Points Counter */}
            <div className="w-full flex items-center justify-between px-3 py-1 bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-700/80 rounded shadow-inner">
                <div className="flex items-center gap-1.5">
                    <span className="text-amber-400 text-xs sm:text-sm drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]">⚡</span>
                    <span className="text-[10px] sm:text-xs font-mono font-black text-neutral-200 tracking-wider uppercase">
                        ACTION POINTS
                    </span>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-base sm:text-lg font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.9)]">
                        {actionPoints}
                    </span>
                    <span className="text-[9px] font-mono text-neutral-400 font-bold uppercase">
                        PTS
                    </span>
                </div>
            </div>

            {/* Super Meter Bar */}
            <SuperMeterBar superMeter={superMeter} />

            {/* Horizontal Row of 3 Circular Action Buttons */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 w-full pt-1">
                {abilities.map((ability) => (
                    <ActionButton
                        key={ability.type}
                        ability={ability}
                        actionPoints={actionPoints}
                        onClick={() => onTriggerAction(ability.type)}
                    />
                ))}
            </div>
        </section>
    );
};
