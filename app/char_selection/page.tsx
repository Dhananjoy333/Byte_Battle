'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CharacterRail } from '@/app/_components/char_selec/CharacterRail';
import { CharacterStage } from '@/app/_components/char_selec/CharacterStage';
import { CharacterInfo } from '@/app/_components/char_selec/CharacterInfo';
import { CHARACTERS, getCharacterById } from '@/app/_data/characters';
import { useGameStore } from '@/app/_store/useGameStore';

const IMAGEKIT_URL = process.env.NEXT_PUBLIC_IMAGEKIT_URL;

export default function CharacterSelectPage(): React.JSX.Element {
    const router = useRouter();
    const { selectedCharacterId, setSelectedCharacter } = useGameStore();
    const [selectedId, setSelectedId] = useState<string>(CHARACTERS[0].id);

    // Sync with Zustand stored selection once mounted
    useEffect(() => {
        if (selectedCharacterId && CHARACTERS.some((c) => c.id === selectedCharacterId)) {
            setSelectedId(selectedCharacterId);
        }
    }, [selectedCharacterId]);

    const activeCharacter = getCharacterById(selectedId);

    const handlePlay = (): void => {
        setSelectedCharacter(selectedId);
        router.push('/gameHUD');
    };

    return (
        <main
            className="relative h-screen w-screen overflow-hidden bg-[#131d31] flex items-center justify-center"
            suppressHydrationWarning
        >
            {/* Custom Background Artwork */}
            <div className="pointer-events-none absolute inset-0 z-0">
                <Image
                    src={`${IMAGEKIT_URL}/img/char_selec_bg.png`}
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