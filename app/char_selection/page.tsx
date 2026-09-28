'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CharacterRail, RailDirection } from '@/app/_components/char_selec/CharacterRail';
import { CharacterStage } from '@/app/_components/char_selec/CharacterStage';
import { CharacterInfo } from '@/app/_components/char_selec/CharacterInfo';
import { CHARACTERS, getCharacterById } from '@/app/_data/characters';
import { useGameStore } from '@/app/_store/useGameStore';

export default function CharacterSelectPage(): React.JSX.Element {
    const router = useRouter();
    const { selectedCharacterId, setSelectedCharacter } = useGameStore();
    const [selectedId, setSelectedId] = useState<string>(CHARACTERS[0].id);
    const [direction, setDirection] = useState<RailDirection>('above');
    const isBusyRef = useRef<boolean>(false);

    // Sync with Zustand stored selection once mounted
    useEffect(() => {
        if (selectedCharacterId && CHARACTERS.some((c) => c.id === selectedCharacterId)) {
            const frame = requestAnimationFrame(() => {
                setSelectedId(selectedCharacterId);
            });
            return () => cancelAnimationFrame(frame);
        }
    }, [selectedCharacterId]);

    const activeCharacter = getCharacterById(selectedId);

    const handleSelectCharacter = (newId: string, dir?: RailDirection) => {
        if (newId === selectedId || isBusyRef.current) return;
        isBusyRef.current = true;
        setDirection(dir ?? 'above');
        setSelectedId(newId);

        // Safety timeout to ensure interaction never locks up if interrupted
        setTimeout(() => {
            isBusyRef.current = false;
        }, 800);
    };

    const handlePlay = (): void => {
        setSelectedCharacter(selectedId);
        router.push('/gameHUD');
    };

    return (
        <main
            className="relative h-screen w-screen overflow-hidden bg-black flex items-center justify-center select-none"
            suppressHydrationWarning
        >
            {/* ============================================================== */}
            {/* Center Stage: Color BG + Ground + Character Cutout with GSAP    */}
            {/* ============================================================== */}
            <CharacterStage
                characterId={selectedId}
                direction={direction}
                onPlay={handlePlay}
                isBusyRef={isBusyRef}
            />

            {/* ============================================================== */}
            {/* Left Section: Circular Arc Character Carousel                  */}
            {/* ============================================================== */}
            <div className="absolute left-8 md:left-16 lg:left-20 top-1/2 -translate-y-1/2 z-20 pointer-events-auto">
                <CharacterRail
                    characters={CHARACTERS}
                    selectedId={selectedId}
                    onSelectCharacter={handleSelectCharacter}
                />
            </div>

            {/* ============================================================== */}
            {/* Right Section: Character Info & Stats Description              */}
            {/* ============================================================== */}
            <div className="absolute right-8 md:right-16 lg:right-24 top-1/2 -translate-y-1/2 z-20 max-w-md w-full pointer-events-auto">
                <div key={activeCharacter.id} className="animate-in fade-in slide-in-from-right-3 duration-300">
                    <CharacterInfo
                        role={activeCharacter.role}
                        name={activeCharacter.name}
                        description={activeCharacter.description}
                        stats={activeCharacter.stats}
                    />
                </div>
            </div>
        </main>
    );
}