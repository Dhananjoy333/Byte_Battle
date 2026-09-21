'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
        id: 'aurelia',
        name: 'Aurelia Veyne',
        role: 'Sprinter',
        avatarUrl: '/icons/aurelia.png',
        fullImage: '/char_portrait/aurelia.png',
        description:
            'A lightning-fast playmaker who breaks formations and turns split seconds into decisive advantages.',
        stats: { power: 9, accel: 11, speed: 8 },
    },
    {
        id: 'raze',
        name: 'Raze',
        role: 'Tactician',
        avatarUrl: '/icons/raze.png',
        fullImage: '/char_portrait/raze.png',
        description:
            'Calculates passing lanes with surgical precision and orchestrates high-tempo midfield transitions.',
        stats: { power: 7, accel: 8, speed: 10 },
    },
    {
        id: 'kira',
        name: 'Kira Byte',
        role: 'Striker',
        avatarUrl: '/icons/kira.png',
        fullImage: '/char_portrait/kira.png',
        description:
            'Unstoppable kinetic force capable of powering through deep defensive blocks with high-impact finishing.',
        stats: { power: 12, accel: 7, speed: 6 },
    },
    {
        id: 'lucien',
        name: 'Lucien Frostvale',
        role: 'Sprinter',
        avatarUrl: '/icons/lucien.png',
        fullImage: '/char_portrait/lucien.png',
        description:
            'A lightning-fast playmaker who breaks formations and turns split seconds into decisive advantages.',
        stats: { power: 9, accel: 11, speed: 8 },
    },
    {
        id: 'raizen',
        name: 'Raizen',
        role: 'Sprinter',
        avatarUrl: '/icons/raizen.png',
        fullImage: '/char_portrait/raizen.png',
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

    return (
        <main
            className="relative h-screen w-screen overflow-hidden bg-[#131d31] flex items-center justify-center"
            suppressHydrationWarning
        >
            {/* Custom Background Artwork */}
            <div className="pointer-events-none absolute inset-0 z-0">
                <Image
                    src="/img/char_selec_bg.png"
                    alt="Character Selection Background"
                    fill
                    priority
                    className="object-cover object-center"
                />
            </div>

            {/* Stage: Character + Podium (Centered vertically across screen) */}
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none pt-2">
                <div className="pointer-events-auto w-full max-w-2xl flex flex-col items-center justify-center">
                    <CharacterStage
                        characterId={activeCharacter.id}
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
                />
            </div>
        </main>
    );
}