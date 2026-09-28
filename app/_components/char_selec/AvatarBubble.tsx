import React from "react";
import Image from "next/image";

interface AvatarBubbleProps {
    id: string;
    name: string;
    avatarUrl: string;
    isActive?: boolean;
    onClick?: (id: string) => void;
    size?: {
        active: number;
        inactive: number;
    };
    className?: string;
}

export const AvatarBubble: React.FC<AvatarBubbleProps> = ({
    id,
    name,
    avatarUrl,
    isActive = false,
    onClick,
    size,
    className = '',
}) => {
    const sizeStyle = size
        ? {
              width: isActive ? size.active : size.inactive,
              height: isActive ? size.active : size.inactive,
          }
        : undefined;

    return (
        <button
            type="button"
            onClick={() => onClick?.(id)}
            aria-label={`Select character ${name}`}
            style={sizeStyle}
            className={`
                group relative flex shrink-0 items-center justify-center rounded-full
                transition-all duration-300 ease-out
                focus:outline-none select-none
                ${
                    size
                        ? isActive
                            ? 'cursor-default'
                            : 'opacity-85 hover:opacity-100 cursor-pointer active:scale-95'
                        : isActive
                        ? 'h-28 w-28 xl:h-35 xl:w-35 cursor-default'
                        : 'h-18 w-18 xl:h-21 xl:w-21 opacity-80 hover:opacity-100 cursor-pointer active:scale-95'
                }
                ${className}
            `}
        >
            {/* Neon Pink/Coral Outer Glow Ring for Active Item */}
            {isActive && (
                <>
                    <div className="absolute -inset-0.75 rounded-full border-[3px] border-[#ff4767] shadow-[0_0_20px_rgba(255,71,103,0.5)]" />
                    <div className="absolute -inset-px rounded-full border border-white/60" />
                </>
            )}

            {/* Subtle background disc for inactive items */}
            {!isActive && (
                <div className="absolute -inset-1 rounded-full bg-white/40 backdrop-blur-sm" />
            )}

            {/* Inner Image Mask */}
            <div
                className={`
                    relative h-full w-full overflow-hidden rounded-full
                    bg-slate-900/60
                    ${isActive ? "border-2 border-[#ff4767]" : "border border-white/35"}
                `}
            >
                <Image
                    src={avatarUrl}
                    alt={name}
                    fill
                    sizes={isActive ? "140px" : "84px"}
                    className="
                        object-cover
                        object-top
                        transition-transform duration-500
                        group-hover:scale-105
                    "
                />

                {/* Shading overlay for non-selected bubbles */}
                {!isActive && (
                    <div className="absolute inset-0 bg-[#0d172a]/30 transition-opacity group-hover:opacity-0" />
                )}
            </div>
        </button>
    );
};