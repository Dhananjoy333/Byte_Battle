'use client';

import React from 'react';
import { SuperMeterState } from '../../types';

interface SuperMeterBarProps {
    superMeter: SuperMeterState;
}

export const SuperMeterBar: React.FC<SuperMeterBarProps> = ({ superMeter }) => {
    const value = Math.max(0, Math.min(100, superMeter.value));
    const isFull = superMeter.isFull || value >= 100;

    return (
        <div className="w-full flex flex-col gap-1 select-none">
            {/* Header info */}
            <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono font-black">
                <span className="flex items-center gap-1.5 text-amber-400">
                    <span
                        className={`w-2 h-2 rounded-full ${
                            isFull ? 'bg-red-500 animate-ping' : 'bg-amber-400'
                        }`}
                    />
                    SUPER METER
                </span>
                <span
                    className={`tracking-wider ${
                        isFull
                            ? 'text-red-400 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,1)]'
                            : 'text-neutral-400'
                    }`}
                >
                    {isFull ? '★ MAX READY! [E] ★' : `${Math.round(value)}%`}
                </span>
            </div>

            {/* Segmented Super Meter Bar (3 Blocks: LV1, LV2, MAX) */}
            <div className="relative h-4 sm:h-5 w-full bg-black/90 p-[2px] border-2 border-neutral-700 rounded-[2px] shadow-[0_0_12px_rgba(0,0,0,0.8)] flex gap-1">
                {[0, 1, 2].map((segmentIndex) => {
                    const segmentMin = segmentIndex * 33.33;
                    const segmentMax = (segmentIndex + 1) * 33.33;
                    const segmentProgress = Math.max(
                        0,
                        Math.min(1, (value - segmentMin) / (segmentMax - segmentMin))
                    );

                    const isSegmentFull = segmentProgress >= 1;

                    return (
                        <div
                            key={segmentIndex}
                            className="relative flex-1 h-full bg-neutral-950 overflow-hidden border border-neutral-800"
                        >
                            {/* Fill bar */}
                            <div
                                className={`h-full transition-all duration-200 ease-out ${
                                    isFull
                                        ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 animate-pulse'
                                        : isSegmentFull
                                        ? 'bg-gradient-to-r from-blue-600 via-cyan-400 to-amber-300'
                                        : 'bg-gradient-to-r from-blue-800 to-cyan-500'
                                }`}
                                style={{ width: `${segmentProgress * 100}%` }}
                            />

                            {/* Segment Level Label */}
                            <div className="absolute inset-0 flex items-center justify-center font-mono text-[9px] font-black text-white/80 pointer-events-none drop-shadow-sm">
                                {segmentIndex === 2 ? 'MAX' : `LV${segmentIndex + 1}`}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
