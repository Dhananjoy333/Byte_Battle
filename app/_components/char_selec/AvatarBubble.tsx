import React from "react";
import Image from "next/image";

interface AvatarBubbleProps {
    id: string;
    name: string;
    avatarUrl: string;
    isActive?: boolean;
    onClick?: (id: string) => void;
}

export const AvatarBubble: React.FC<AvatarBubbleProps> = ({
                                                              id,
                                                              name,
                                                              avatarUrl,
                                                              isActive = false,
                                                              onClick,
                                                          }) => {
    return (
        <button
            type="button"
            onClick={() => onClick?.(id)}
            aria-label={`Select character ${name}`}
            className={`
                group relative flex items-center justify-center rounded-full
                transition-all duration-500 ease-out
                focus:outline-none
                ${
                isActive
                    ? "h-[140px] w-[140px]"
                    : "h-[84px] w-[84px] opacity-60 hover:opacity-100"
            }
            `}
        >
            {/* Neon Pink/Coral Outer Glow Ring for Active Item */}
            {isActive && (
                <>
                    <div className="absolute -inset-[3px] rounded-full border-[3px] border-[#ff4767] shadow-[0_0_20px_rgba(255,71,103,0.5)]" />
                    <div className="absolute -inset-[1px] rounded-full border border-white/60" />
                </>
            )}

            {/* Subtle background disc for inactive items */}
            {!isActive && (
                <div className="absolute -inset-1 rounded-full bg-white/10 backdrop-blur-sm" />
            )}

            {/* Inner Image Mask */}
            <div
                className={`
                    relative h-full w-full overflow-hidden rounded-full
                    bg-slate-900/60
                    ${isActive ? "border-2 border-[#ff4767]" : "border border-white/15"}
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