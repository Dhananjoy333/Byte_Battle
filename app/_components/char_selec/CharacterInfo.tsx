import React from 'react';
import { SegmentedProgressRing } from './SegmentedProgressRing';
import { StatRingSizes } from './useScreenTier';

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
    ringSizes?: StatRingSizes;
    variant?: 'desktop' | 'compact';
    showStats?: boolean;
    className?: string;
}

export const CharacterInfo: React.FC<CharacterInfoProps> = ({
    role,
    name,
    description,
    stats,
    ringSizes,
    variant = 'desktop',
    showStats = true,
    className = '',
}) => {
    // Default ring sizes if not provided
    const powerSize = ringSizes?.power ?? (variant === 'compact' ? 56 : 110);
    const accelSize = ringSizes?.accel ?? (variant === 'compact' ? 70 : 150);
    const speedSize = ringSizes?.speed ?? (variant === 'compact' ? 56 : 110);

    const strokePower = ringSizes?.strokePower ?? (variant === 'compact' ? 6 : 11);
    const strokeAccel = ringSizes?.strokeAccel ?? (variant === 'compact' ? 8 : 14);
    const strokeSpeed = ringSizes?.strokeSpeed ?? (variant === 'compact' ? 6 : 11);

    if (variant === 'compact') {
        return (
            <div className={`relative flex flex-col items-center select-none text-center ${className}`}>
                {/* Role pill badge */}
                <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-yellow-400/30 bg-yellow-400/10 backdrop-blur-sm">
                    <span className="size-1 sm:size-1.5 rounded-full bg-yellow-400" />
                    <span className="font-general text-[9px] min-[480px]:text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-yellow-300">
                        {role}
                    </span>
                </div>

                {/* Main Name */}
                <h1 className="mt-1 sm:mt-1.5 text-3xl min-[480px]:text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">
                    {name}
                </h1>

                {/* Bio / Playstyle Description */}
                <p className="mt-1 text-[11px] min-[480px]:text-xs sm:text-sm leading-relaxed text-slate-300/85 font-normal max-w-xs min-[480px]:max-w-sm sm:max-w-md line-clamp-2">
                    {description}
                </p>

                {/* Compact Stats Rings Cluster (rendered only if showStats is true) */}
                {showStats && (
                    <div className="mt-2.5 sm:mt-3.5 flex items-center justify-center gap-2.5 min-[480px]:gap-3.5 sm:gap-5">
                        {/* Power (Yellow) */}
                        <SegmentedProgressRing
                            label="Power"
                            value={stats.power}
                            maxSegments={14}
                            color="#FACC15"
                            size={powerSize}
                            strokeWidth={strokePower}
                            icon={<span className="text-sm min-[480px]:text-base">⚙</span>}
                        />

                        {/* Accel (Neon Green - center hero meter) */}
                        <SegmentedProgressRing
                            label="Accel"
                            value={stats.accel}
                            maxSegments={14}
                            color="#22c55e"
                            size={accelSize}
                            strokeWidth={strokeAccel}
                            icon={<span className="text-base min-[480px]:text-lg">🏃</span>}
                        />

                        {/* Speed (Cyan) */}
                        <SegmentedProgressRing
                            label="Speed"
                            value={stats.speed}
                            maxSegments={14}
                            color="#38BDF8"
                            size={speedSize}
                            strokeWidth={strokeSpeed}
                            icon={<span className="text-sm min-[480px]:text-base">💨</span>}
                        />
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`relative flex flex-col items-start select-none ${className}`}>
            {/* Ghost/Watermark Role Header */}
            <span className="text-2xl lg:text-3xl xl:text-4xl 2xl:text-6xl font-black tracking-wider text-white/20 uppercase select-none pointer-events-none -mb-1 lg:-mb-2 xl:-mb-3 2xl:-mb-5">
                {role}
            </span>

            {/* Main Name */}
            <div className="flex items-center">
                <h1 className="text-3xl lg:text-4xl xl:text-5xl 2xl:text-7xl font-black tracking-tight text-white drop-shadow-lg">
                    {name}
                </h1>
            </div>

            {/* Bio / Playstyle Description */}
            <p className="mt-1.5 xl:mt-2.5 2xl:mt-3 text-xs xl:text-sm 2xl:text-base leading-relaxed text-slate-300/85 font-normal max-w-xs xl:max-w-sm 2xl:max-w-lg">
                {description}
            </p>

            {/* Stats Rings Cluster */}
            <div className="mt-6 xl:mt-8 2xl:mt-10 flex items-center gap-3.5 xl:gap-5 2xl:gap-7">
                {/* Power (Yellow) */}
                <SegmentedProgressRing
                    label="Power"
                    value={stats.power}
                    maxSegments={14}
                    color="#FACC15"
                    size={powerSize}
                    strokeWidth={strokePower}
                    icon={<span className="text-base xl:text-xl">⚙</span>}
                />

                {/* Accel (Neon Green - large center hero meter) */}
                <SegmentedProgressRing
                    label="Accel"
                    value={stats.accel}
                    maxSegments={14}
                    color="#22c55e"
                    size={accelSize}
                    strokeWidth={strokeAccel}
                    icon={<span className="text-lg xl:text-2xl">🏃</span>}
                />

                {/* Speed (Cyan) */}
                <SegmentedProgressRing
                    label="Speed"
                    value={stats.speed}
                    maxSegments={14}
                    color="#38BDF8"
                    size={speedSize}
                    strokeWidth={strokeSpeed}
                    icon={<span className="text-base xl:text-xl">💨</span>}
                />
            </div>
        </div>
    );
};