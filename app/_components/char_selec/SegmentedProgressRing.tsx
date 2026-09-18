import React from 'react';

interface SegmentedProgressRingProps {
    label: string;
    value: number;
    maxSegments?: number;
    color?: string;
    icon?: React.ReactNode;
    size?: number;
    strokeWidth?: number;
}

const roundCoord = (val: number, precision = 3): number => {
    const factor = 10 ** precision;
    return Math.round(val * factor) / factor;
};

export const SegmentedProgressRing: React.FC<SegmentedProgressRingProps> = ({
                                                                                label,
                                                                                value,
                                                                                maxSegments = 14,
                                                                                color = '#22c55e',
                                                                                icon,
                                                                                size = 110,
                                                                                strokeWidth = 11,
                                                                            }) => {
    const center = size / 2;
    const radius = (size - strokeWidth) / 2 - 2;

    const gap = 4.5;
    const segmentAngle = 360 / maxSegments;
    const segmentSweep = segmentAngle - gap;

    const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
        const radians = ((angle - 90) * Math.PI) / 180;
        return {
            x: roundCoord(cx + r * Math.cos(radians)),
            y: roundCoord(cy + r * Math.sin(radians)),
        };
    };

    const createArcPath = (startAngle: number, endAngle: number) => {
        const start = polarToCartesian(center, center, radius, endAngle);
        const end = polarToCartesian(center, center, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
        const r = roundCoord(radius);
        return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
    };

    const isLarge = size >= 130;

    return (
        <div
            className="relative flex items-center justify-center select-none"
            style={{ width: size, height: size }}
        >
            {/* Inner background disc */}
            <div
                className="absolute inset-[10px] rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(25,55,95,0.6) 0%, rgba(10,25,50,0.3) 100%)',
                }}
            />

            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="relative"
            >
                {/* Background track circle */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.03)"
                    strokeWidth={strokeWidth + 4}
                />

                {Array.from({ length: maxSegments }).map((_, index) => {
                    const startAngle = index * segmentAngle + gap / 2;
                    const endAngle = startAngle + segmentSweep;
                    const isActive = index < value;

                    return (
                        <path
                            key={index}
                            d={createArcPath(startAngle, endAngle)}
                            fill="none"
                            stroke={isActive ? color : 'rgba(120, 160, 200, 0.22)'}
                            strokeWidth={strokeWidth}
                            strokeLinecap="butt"
                            style={{
                                filter: isActive ? `drop-shadow(0 0 4px ${color}88)` : 'none',
                                transition: 'stroke 0.3s ease',
                            }}
                        />
                    );
                })}
            </svg>

            {/* Inner Content Label & Icon */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white pointer-events-none">
                <span
                    className={`font-semibold tracking-wide text-white/90 ${
                        isLarge ? 'text-sm' : 'text-xs'
                    }`}
                >
                    {label}
                </span>

                <div className={`text-white/90 ${isLarge ? 'mt-1.5' : 'mt-0.5'}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};