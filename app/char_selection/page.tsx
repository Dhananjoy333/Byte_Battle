'use client';

import React, { useState } from 'react';
import { CharacterRail, CharacterSummary } from '@/app/_components/char_selec/CharacterRail';
import { CharacterStage } from '@/app/_components/char_selec/CharacterStage';
import { CharacterInfo, CharacterStats } from '@/app/_components/char_selec/CharacterInfo';

interface FullCharacter extends CharacterSummary {
    role: string;
    description: string;
    fullImage: string;
    stats: CharacterStats;
}

const CHARACTERS: FullCharacter[] = [
    {
        id: 'liora',
        name: 'Liora',
        role: 'Sprinter',
        avatarUrl: '/char_portrait/black_girl.png',
        fullImage: '/char_portrait/black_girl.png',
        description:
            'A lightning-fast playmaker who breaks formations and turns split seconds into decisive advantages.',
        stats: { power: 9, accel: 11, speed: 8 },
    },
    {
        id: 'aria',
        name: 'Aria',
        role: 'Tactician',
        avatarUrl: '/char_portrait/black_girl.png',
        fullImage: '/char_portrait/black_girl.png',
        description:
            'Calculates passing lanes with surgical precision and orchestrates high-tempo midfield transitions.',
        stats: { power: 7, accel: 8, speed: 10 },
    },
    {
        id: 'maya',
        name: 'Maya',
        role: 'Striker',
        avatarUrl: '/char_portrait/black_girl.png',
        fullImage: '/char_portrait/black_girl.png',
        description:
            'Unstoppable kinetic force capable of powering through deep defensive blocks with high-impact finishing.',
        stats: { power: 12, accel: 7, speed: 6 },
    },
    {
        id: 'lio',
        name: 'Liora',
        role: 'Sprinter',
        avatarUrl: '/char_portrait/black_girl.png',
        fullImage: '/char_portrait/black_girl.png',
        description:
            'A lightning-fast playmaker who breaks formations and turns split seconds into decisive advantages.',
        stats: { power: 9, accel: 11, speed: 8 },
    },
    {
        id: 'lior',
        name: 'Liora',
        role: 'Sprinter',
        avatarUrl: '/char_portrait/black_girl.png',
        fullImage: '/char_portrait/black_girl.png',
        description:
            'A lightning-fast playmaker who breaks formations and turns split seconds into decisive advantages.',
        stats: { power: 9, accel: 11, speed: 8 },
    },
];

export default function CharacterSelectPage(): React.JSX.Element {
    const [selectedId, setSelectedId] = useState<string>(CHARACTERS[0].id);

    const activeCharacter =
        CHARACTERS.find((c) => c.id === selectedId) ?? CHARACTERS[0];

    const handlePlay = (): void => {
        console.log(`Starting match with ${activeCharacter.name}`);
    };

    const handleAdd = (): void => {
        console.log(`Added ${activeCharacter.name} to team`);
    };

    return (
        <main className="relative h-screen w-screen overflow-hidden bg-[#131d31] flex items-center justify-center">
            {/* Background 3D Dunes & Lighting atmosphere */}
            <div className="pointer-events-none absolute inset-0 z-0">
                {/* Top glow */}
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-sky-500/15 blur-[160px] rounded-full" />
                {/* Bottom dunes gradient */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#1b3459]/50 via-[#182a46]/20 to-transparent" />
            </div>

            {/* Stage: Character + Podium + Ball (Centers across entire screen) */}
            <div className="absolute inset-0 z-10 flex items-end justify-center pointer-events-none pb-12">
                <div className="pointer-events-auto w-full max-w-2xl h-[85vh] flex flex-col items-center justify-end">
                    <CharacterStage
                        characterImage={activeCharacter.fullImage}
                        characterName={activeCharacter.name}
                        ballImage="/assets/soccer-ball.png"
                        onPlay={handlePlay}
                    />
                </div>
            </div>

            {/* Left Section: Character Selection Arc */}
            <div className="absolute left-10 md:left-20 top-1/2 -translate-y-1/2 z-20">
                <CharacterRail
                    characters={CHARACTERS}
                    selectedId={selectedId}
                    onSelectCharacter={setSelectedId}
                />
            </div>

            {/* Right Section: Character Info & Stats */}
            <div className="absolute right-12 md:right-24 top-1/2 -translate-y-1/2 z-20 max-w-md w-full">
                <CharacterInfo
                    role={activeCharacter.role}
                    name={activeCharacter.name}
                    description={activeCharacter.description}
                    stats={activeCharacter.stats}
                    onAddClick={handleAdd}
                />
            </div>
        </main>
    );
}