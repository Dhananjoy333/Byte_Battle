'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { CharacterRail, CharacterDock, RailDirection } from '@/app/_components/char_selec/CharacterRail';
import { CharacterStage } from '@/app/_components/char_selec/CharacterStage';
import { CharacterInfo } from '@/app/_components/char_selec/CharacterInfo';
import { SegmentedProgressRing } from '@/app/_components/char_selec/SegmentedProgressRing';
import { useScreenTier } from '@/app/_components/char_selec/useScreenTier';
import { CHARACTERS, getCharacterById } from '@/app/_data/characters';
import { useGameStore } from '@/app/_store/useGameStore';

export default function CharacterSelectPage(): React.JSX.Element {
    const router = useRouter();
    const screenTier = useScreenTier();
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
            className="relative h-screen w-screen overflow-hidden bg-[#07080e] flex items-center justify-center select-none"
            suppressHydrationWarning
        >
            {/* ============================================================== */}
            {/* Back to Mode Selection Button                                   */}
            {/* ============================================================== */}
            <button
                type="button"
                onClick={() => router.push('/mode_selection')}
                className="group absolute left-3 sm:left-5 md:left-6 lg:left-8 xl:left-10 2xl:left-14 top-3 sm:top-5 md:top-6 lg:top-6 xl:top-7 2xl:top-12 z-30 flex items-center gap-1.5 sm:gap-2 rounded-full border border-zinc-800 bg-zinc-950/80 px-2.5 sm:px-3.5 md:px-4 py-1 sm:py-1.5 md:py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-blue-100/70 backdrop-blur-md transition-all hover:border-yellow-400/50 hover:text-yellow-300 active:scale-95 cursor-pointer leading-none"
            >
                <FiArrowLeft className="size-3 sm:size-3.5 transition-transform group-hover:-translate-x-1 shrink-0" />
                <span className="leading-none">Modes</span>
            </button>

            {/* ============================================================== */}
            {/* Header: Cyber Stage Badge                                       */}
            {/* ============================================================== */}
            <div className="pointer-events-none absolute top-3 sm:top-5 md:top-6 lg:top-6 xl:top-7 2xl:top-12 z-20 flex flex-col items-center left-1/2 -translate-x-1/2 w-full px-4">
                <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
                    <span className="h-px w-3 min-[400px]:w-6 sm:w-8 md:w-10 lg:w-14 bg-linear-to-r from-transparent to-yellow-400" />
                    <span className="font-general text-[8px] sm:text-[10px] md:text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] text-yellow-300/85">
                        Operative Archive
                    </span>
                    <span className="h-px w-3 min-[400px]:w-6 sm:w-8 md:w-10 lg:w-14 bg-linear-to-l from-transparent to-yellow-400" />
                </div>
            </div>

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
            {/* DESKTOP / LAPTOP (lg: 1024px+): Circular Arc Rail (Left)        */}
            {/* ============================================================== */}
            <div className="hidden lg:block absolute left-2 lg:left-4 xl:left-8 2xl:left-14 top-1/2 -translate-y-1/2 z-20 pointer-events-auto scale-[0.70] lg:scale-[0.76] xl:scale-[0.84] 2xl:scale-100 origin-left">
                <CharacterRail
                    characters={CHARACTERS}
                    selectedId={selectedId}
                    onSelectCharacter={handleSelectCharacter}
                />
            </div>

            {/* ============================================================== */}
            {/* DESKTOP / LAPTOP (lg: 1024px+): Info & Stats (Right)            */}
            {/* ============================================================== */}
            <div className="hidden lg:block absolute right-6 lg:right-8 xl:right-0 2xl:right-24 top-1/2 -translate-y-1/2 z-20 max-w-xs lg:max-w-sm xl:max-w-md 2xl:max-w-lg w-full pointer-events-auto">
                <div key={activeCharacter.id} className="animate-in fade-in slide-in-from-right-3 duration-300">
                    <CharacterInfo
                        role={activeCharacter.role}
                        name={activeCharacter.name}
                        description={activeCharacter.description}
                        stats={activeCharacter.stats}
                        ringSizes={screenTier.statRingSizes}
                        variant="desktop"
                    />
                </div>
            </div>

            {/* ============================================================== */}
            {/* SMALLER DEVICES (< 1024px): Top Character Identity Header       */}
            {/* (Stats rings relocated to bottom so character body is clear)   */}
            {/* ============================================================== */}
            <div className="lg:hidden absolute top-7 sm:top-10 md:top-12 inset-x-0 z-20 flex flex-col items-center pointer-events-none px-4">
                <div key={activeCharacter.id} className="animate-in fade-in slide-in-from-top-2 duration-300 flex flex-col items-center">
                    <CharacterInfo
                        role={activeCharacter.role}
                        name={activeCharacter.name}
                        description={activeCharacter.description}
                        stats={activeCharacter.stats}
                        variant="compact"
                        showStats={false}
                    />
                </div>
            </div>

            {/* ============================================================== */}
            {/* SMALLER DEVICES (< 1024px): Bottom Stats, Dock & Play Button    */}
            {/* ============================================================== */}
            <div className="lg:hidden absolute bottom-2.5 sm:bottom-4 md:bottom-6 inset-x-0 z-30 flex flex-col items-center gap-1.5 min-[480px]:gap-2 sm:gap-2.5 pointer-events-auto px-3">
                {/* 1. Character Telemetry Stats Rings Row (Power, Accel, Speed) */}
                <div
                    key={`stats-${activeCharacter.id}`}
                    className="animate-in fade-in zoom-in-95 duration-300 flex items-center justify-center gap-3 min-[480px]:gap-4 sm:gap-6"
                >
                    <SegmentedProgressRing
                        label="Power"
                        value={activeCharacter.stats.power}
                        maxSegments={14}
                        color="#FACC15"
                        size={screenTier.statRingSizes.power}
                        strokeWidth={screenTier.statRingSizes.strokePower}
                        icon={<span className="text-sm min-[480px]:text-base">⚙</span>}
                    />
                    <SegmentedProgressRing
                        label="Accel"
                        value={activeCharacter.stats.accel}
                        maxSegments={14}
                        color="#22c55e"
                        size={screenTier.statRingSizes.accel}
                        strokeWidth={screenTier.statRingSizes.strokeAccel}
                        icon={<span className="text-base min-[480px]:text-lg">🏃</span>}
                    />
                    <SegmentedProgressRing
                        label="Speed"
                        value={activeCharacter.stats.speed}
                        maxSegments={14}
                        color="#38BDF8"
                        size={screenTier.statRingSizes.speed}
                        strokeWidth={screenTier.statRingSizes.strokeSpeed}
                        icon={<span className="text-sm min-[480px]:text-base">💨</span>}
                    />
                </div>

                {/* 2. Operative Roster Dock */}
                <CharacterDock
                    characters={CHARACTERS}
                    selectedId={selectedId}
                    onSelectCharacter={handleSelectCharacter}
                    bubbleSize={screenTier.avatarBubbleSize}
                />

                {/* 3. Primary CTA Play Button */}
                <button
                    type="button"
                    onClick={handlePlay}
                    className="group flex items-center justify-center gap-2 px-8 sm:px-12 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-linear-to-r from-[#ff4767] via-[#ff3358] to-[#ff2b4e] hover:from-[#e63a58] hover:to-[#e62b4e] active:scale-95 text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-[0_8px_25px_rgba(255,71,103,0.55)] hover:shadow-[0_12px_32px_rgba(255,71,103,0.7)] transition-all duration-200 cursor-pointer"
                >
                    <span>Let&apos;s Play!</span>
                    <FiArrowRight className="size-3.5 sm:size-4 shrink-0 transition-transform group-hover:translate-x-1" />
                </button>
            </div>
        </main>
    );
}