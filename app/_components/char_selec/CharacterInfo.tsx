import React from 'react';
import { SegmentedProgressRing } from './SegmentedProgressRing';

export interface CharacterStats {
    power: number;
    accel: number;
    speed: number;
}

interface CharacterInfoProps {
    role: string;
    name: string;
    description: string;
    stats: CharacterStats;
    onAddClick?: () => void;
}

export const CharacterInfo: React.FC<CharacterInfoProps> = ({
                                                                role,
                                                                name,
                                                                description,
                                                                stats,
                                                                onAddClick,
                                                            }) => {
    return (
        <div className="relative flex flex-col items-start max-w-xl select-none">
            {/* Ghost/Watermark Role Header */}
            <span className="text-7xl font-black tracking-wider text-white/10 uppercase select-none pointer-events-none -mb-6">
                {role}
            </span>

            {/* Main Name & Action Button */}
            <div className="flex items-center gap-5">
                <h1 className="text-7xl md:text-8xl font-black tracking-tight text-white drop-shadow-lg">
                    {name}
                </h1>
                <button
                    type="button"
                    onClick={onAddClick}
                    aria-label={`Add ${name}`}
                    className="w-12 h-12 rounded-2xl bg-[#ff4767] hover:bg-[#ff3358] flex items-center justify-center text-white text-3xl font-bold transition-all shadow-[0_4px_20px_rgba(255,71,103,0.5)] active:scale-95"
                >
                    +
                </button>
            </div>

            {/* Bio / Playstyle Description */}
            <p className="mt-4 text-base md:text-lg leading-relaxed text-slate-300/85 font-normal max-w-lg">
                {description}
            </p>

            {/* Stats Rings Cluster */}
            <div className="mt-10 flex items-center gap-7">
                {/* Power (Yellow) */}
                <SegmentedProgressRing
                    label="Power"
                    value={stats.power}
                    maxSegments={14}
                    color="#FACC15"
                    size={110}
                    strokeWidth={11}
                    icon={<span className="text-xl">⚙</span>}
                />

                {/* Accel (Neon Green - large center hero meter) */}
                <SegmentedProgressRing
                    label="Accel"
                    value={stats.accel}
                    maxSegments={14}
                    color="#22c55e"
                    size={150}
                    strokeWidth={14}
                    icon={<span className="text-2xl">🏃</span>}
                />

                {/* Speed (Cyan) */}
                <SegmentedProgressRing
                    label="Speed"
                    value={stats.speed}
                    maxSegments={14}
                    color="#38BDF8"
                    size={110}
                    strokeWidth={11}
                    icon={<span className="text-xl">💨</span>}
                />
            </div>
        </div>
    );
};