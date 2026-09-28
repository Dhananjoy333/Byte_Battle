import React from "react";
import { AvatarBubble } from "./AvatarBubble";

export interface CharacterSummary {
    id: string;
    name: string;
    avatarUrl: string;
}

export type RailDirection = 'above' | 'below' | 'next' | 'prev';

interface CharacterRailProps {
    characters: CharacterSummary[];
    selectedId: string;
    onSelectCharacter: (id: string, direction?: RailDirection) => void;
}

// Scaled coordinates along the circular arc for 140px active / 84px inactive bubbles
const positions = [
    { top: 10,  left: 30 },   // Slot 0 (top-most)
    { top: 120, left: 135 },  // Slot 1
    { top: 250, left: 195 },  // Slot 2 (active center slot aligned with the beam)
    { top: 435, left: 135 },  // Slot 3
    { top: 545, left: 30 },   // Slot 4 (bottom-most)
];

const TARGET_SLOT_INDEX = 2; // Slot 2 is the center highlighted position

export const CharacterRail: React.FC<CharacterRailProps> = ({
                                                                characters,
                                                                selectedId,
                                                                onSelectCharacter,
                                                            }) => {
    const total = characters.length;
    const selectedIndex = characters.findIndex((char) => char.id === selectedId);
    const activeIndex = selectedIndex >= 0 ? selectedIndex : 0;

    const handleAvatarClick = (clickedId: string, slotIndex: number) => {
        if (clickedId === selectedId) return;
        // When clicked slot is above center slot (slot 0 or 1): direction is 'above'
        // -> character goes to LEFT and enters from RIGHT
        // When clicked slot is below center slot (slot 3 or 4): direction is 'below'
        // -> character goes to RIGHT and enters from LEFT
        const direction: RailDirection = slotIndex < TARGET_SLOT_INDEX ? 'above' : 'below';
        onSelectCharacter(clickedId, direction);
    };

    return (
        <div className="relative h-162.5 w-90 select-none">
            {/* ========================================= */}
            {/* FIXED ARROW + EXPANDED BEAM */}
            {/* ========================================= */}
            <div className="pointer-events-none absolute left-3 top-1/2 z-20 -translate-y-1/2 w-60 h-45">
                <svg
                    viewBox="0 0 240 180"
                    fill="none"
                    className="w-full h-full overflow-visible"
                >
                    <defs>
                        {/* Subtle soft gradient for the projection beam */}
                        <linearGradient id="beamGradient" x1="0%" y1="50%" x2="100%" y2="50%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.32" />
                            <stop offset="45%" stopColor="#8ccfff" stopOpacity="0.22" />
                            <stop offset="100%" stopColor="#8ccfff" stopOpacity="0.0" />
                        </linearGradient>

                        {/* Soft glow filter for the white play arrow */}
                        <filter id="arrowGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#ffffff" floodOpacity="0.8" />
                        </filter>
                    </defs>

                    {/*
          Beam projection shape:
          Starts with the inward scalloped curved notch around (x: 48)
          then flairs out to the right (x: 230)
        */}
                    <path
                        d="
        M 230 20
        L 70 65

        C 58 68, 50 72, 53 79
        C 55 84, 50 87, 45 90
        C 50 93, 55 96, 53 101
        C 50 108, 58 112, 70 115

        L 230 160
        Z
    "
                        fill="url(#beamGradient)"
                    />

                    {/*
          Rounded play/arrow glyph:
          Positioned snugly inside the inward scalloped pocket
        */}
                    <path
                        d="
                M 14 74
                C 14 70.5, 17.5 68.5, 20.5 70.2
                L 41.5 86.2
                C 44.5 87.8, 44.5 92.2, 41.5 93.8
                L 20.5 109.8
                C 17.5 111.5, 14 109.5, 14 106
                Z
            "
                        fill="#ffffff"
                        filter="url(#arrowGlow)"
                    />
                </svg>
            </div>

            {/* ========================================= */}
            {/* CAROUSEL ITEMS */}
            {/* ========================================= */}
            <div className="absolute inset-0 z-10">
                {characters.map((char, index) => {
                    const isActive = char.id === selectedId;

                    // Compute relative slot with modulo wrap-around
                    const slotIndex =
                        (((index - activeIndex + TARGET_SLOT_INDEX) % total) + total) % total;
                    const position = positions[slotIndex];

                    return (
                        <div
                            key={char.id}
                            className="absolute transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                            style={{
                                transform: `translate3d(${position.left}px, ${position.top}px, 0)`,
                            }}
                        >
                            <AvatarBubble
                                id={char.id}
                                name={char.name}
                                avatarUrl={char.avatarUrl}
                                isActive={isActive}
                                onClick={(id) => handleAvatarClick(id, slotIndex)}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export interface CharacterDockProps {
    characters: CharacterSummary[];
    selectedId: string;
    onSelectCharacter: (id: string, direction?: RailDirection) => void;
    bubbleSize?: {
        active: number;
        inactive: number;
    };
    className?: string;
}

export const CharacterDock: React.FC<CharacterDockProps> = ({
    characters,
    selectedId,
    onSelectCharacter,
    bubbleSize,
    className = '',
}) => {
    const selectedIndex = characters.findIndex((char) => char.id === selectedId);
    const activeIndex = selectedIndex >= 0 ? selectedIndex : 0;

    const handleAvatarClick = (clickedId: string, index: number) => {
        if (clickedId === selectedId) return;
        const direction: RailDirection = index < activeIndex ? 'above' : 'below';
        onSelectCharacter(clickedId, direction);
    };

    return (
        <div className={`relative flex items-center justify-center select-none ${className}`}>
            {/* Glassmorphic dock pill container */}
            <div className="flex items-center justify-center gap-1.5 min-[400px]:gap-2 min-[480px]:gap-2.5 sm:gap-3.5 md:gap-4.5 rounded-full border border-zinc-800/80 bg-zinc-950/80 px-2.5 min-[400px]:px-3 min-[480px]:px-4 sm:px-6 py-1.5 sm:py-2 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.65)] ring-1 ring-white/5">
                {characters.map((char, index) => {
                    const isActive = char.id === selectedId;
                    return (
                        <div key={char.id} className="relative flex flex-col items-center">
                            <AvatarBubble
                                id={char.id}
                                name={char.name}
                                avatarUrl={char.avatarUrl}
                                isActive={isActive}
                                size={bubbleSize}
                                onClick={(id) => handleAvatarClick(id, index)}
                            />
                            {/* Glowing active indicator dot */}
                            {isActive && (
                                <span className="absolute -bottom-1 sm:-bottom-1.5 size-1 sm:size-1.5 rounded-full bg-[#ff4767] shadow-[0_0_8px_#ff4767] animate-pulse" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};