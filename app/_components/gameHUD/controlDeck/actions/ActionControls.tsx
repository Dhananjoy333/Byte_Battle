'use client';

import React from 'react';
import { ActionButton } from './ActionButton';
import { SuperMeterBar } from './SuperMeterBar';
import { ActionAbility, SuperMeterState, ActionType } from '../../types';

interface ActionControlsProps {
    abilities: ActionAbility[];
    superMeter: SuperMeterState;
    onTriggerAction: (type: ActionType) => void;
}

export const ActionControls: React.FC<ActionControlsProps> = ({
    abilities,
    superMeter,
    onTriggerAction,
}) => {
    return (
        <section
            aria-label="Action Deck"
            className="flex flex-col items-center gap-3 p-3 sm:p-4 bg-neutral-950/85 backdrop-blur-md border-2 border-neutral-700/80 rounded-md shadow-[0_10px_30px_rgba(0,0,0,0.8)] min-w-[280px] sm:min-w-[320px] select-none"
        >
            {/* Super Meter Bar (Placed above action buttons) */}
            <SuperMeterBar superMeter={superMeter} />

            {/* Horizontal Row of 3 Circular Action Buttons */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 w-full">
                {abilities.map((ability) => (
                    <ActionButton
                        key={ability.type}
                        ability={ability}
                        onClick={() => onTriggerAction(ability.type)}
                    />
                ))}
            </div>
        </section>
    );
};
