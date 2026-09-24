"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { FiArrowRight } from "react-icons/fi"
import FlyingCard from "@/app/_components/mode_selec/FlyingCard"
import GameToast from "@/app/_components/mode_selec/GameToast"

const IMAGEKIT_URL = process.env.NEXT_PUBLIC_IMAGEKIT_URL;

export default function ModeSelection() {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const router = useRouter()

    const [selectedMode, setSelectedMode] = useState<'pve' | 'pvp' | null>(null)
    const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null)
    const [toast, setToast] = useState<{ message: string; id: number } | null>(null)

    useGSAP(
        () => {
            const cardDockTime = 4.2
            const tl = gsap.timeline({
                delay: cardDockTime,
                defaults: { ease: "power2.out", duration: 0.6 },
            })

            tl.to(".ui-badge", {
                opacity: 1,
                duration: 0.3,
            })
                .from(
                    ".slide-text",
                    {
                        yPercent: 120,
                        opacity: 0,
                        stagger: 0.08,
                    },
                    "-=0.1"
                )
        },
        { scope: containerRef }
    )

    const handleGoToCharacterSelection = () => {
        if (!selectedMode) {
            setToast({ message: "Please select a mode", id: Date.now() })
            return
        }

        if (!selectedDifficulty) {
            setToast({ message: "Please select difficulty", id: Date.now() })
            return
        }

        router.push("/char_selection")
    }

    return (
        <main
            ref={containerRef}
            className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-zinc-950"
        >
            <GameToast
                key={toast?.id}
                message={toast?.message ?? null}
                onClose={() => setToast(null)}
            />

            {/* Background */}
            <div className="pointer-events-none absolute inset-0 z-0">
                <Image
                    src={`${IMAGEKIT_URL}/img/mode_selec.png`}
                    alt="Mode Selection Background"
                    fill
                    priority
                    className="object-cover object-center select-none"
                />

                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Select Mode */}
            <div className="ui-badge absolute left-1/2 -translate-x-280 top-1/2 -translate-y-30 z-20 overflow-hidden opacity-0">
                <Image
                    src={`${IMAGEKIT_URL}/icons/select_mode.png`}
                    alt="Select Mode"
                    width={550}
                    height={300}
                    priority
                    className="slide-text block h-auto w-auto object-contain select-none"
                />
            </div>

            {/* Cards */}
            <div className="relative z-10 flex items-center justify-center">

                <FlyingCard
                    isSelected={selectedMode === 'pve'}
                    onClick={() => setSelectedMode('pve')}
                    glowTheme="cyan"
                    getPath={({ vw, vh }) => [
                        { x: vw * 0.05, y: vh * 0.55 },
                        { x: vw * 0.42, y: vh * 0.05 },
                        { x: -vw * 0.15, y: -vh * 0.35 },
                        { x: -vw * 0.27, y: -vh * 0.11 },
                        { x: -220, y: -20 },
                    ]}
                >
                    <Image
                        src={`${IMAGEKIT_URL}/icons/pve.png`}
                        alt="PVE Mode"
                        width={640}
                        height={640}
                        priority
                        className="h-auto w-full object-contain pointer-events-none drop-shadow-xl"
                    />
                </FlyingCard>

                <FlyingCard
                    delay={0.2}
                    isSelected={selectedMode === 'pvp'}
                    onClick={() => setSelectedMode('pvp')}
                    glowTheme="amber"
                    getPath={({ vw, vh }) => [
                        { x: -vw * 0.05, y: vh * 0.55 },
                        { x: -vw * 0.42, y: vh * 0.05 },
                        { x: vw * 0.15, y: -vh * 0.35 },
                        { x: vw * 0.27, y: -vh * 0.11 },
                        { x: 220, y: -20 },
                    ]}
                >
                    <Image
                        src={`${IMAGEKIT_URL}/icons/pvp.png`}
                        alt="PVP Mode"
                        width={640}
                        height={640}
                        priority
                        className="h-auto w-full object-contain pointer-events-none drop-shadow-xl"
                    />
                </FlyingCard>

            </div>

            {/* Difficulty */}
            <div className="absolute bottom-8 z-20 flex flex-col items-center gap-5">

                <div className="flex items-center gap-4">

                    <div className="ui-badge -translate-x-90 opacity-0">
                        <Image
                            src={`${IMAGEKIT_URL}/icons/select_diff.png`}
                            alt="Select Difficulty"
                            width={550}
                            height={300}
                            priority
                            className="slide-text block h-auto w-auto object-contain select-none"
                        />
                    </div>

                    {[
                        {
                            id: "easy",
                            label: "Easy",
                            src: `${IMAGEKIT_URL}/icons/easy.png`
                        },
                        {
                            id: "medium",
                            label: "Medium",
                            src: `${IMAGEKIT_URL}/icons/medium.png`
                        },
                        {
                            id: "hard",
                            label: "Hard",
                            src: `${IMAGEKIT_URL}/icons/hard.png`
                        },
                    ].map((item) => {
                        const isSelected = selectedDifficulty === item.id

                        return (
                            <button
                                key={item.id}
                                onClick={() =>
                                    setSelectedDifficulty(
                                        item.id as 'easy' | 'medium' | 'hard'
                                    )
                                }
                                className={`ui-badge overflow-hidden -translate-x-80 rounded-md border px-4 py-2 transition-all active:scale-95 opacity-0 cursor-pointer ${
                                    isSelected
                                        ? 'border-yellow-400 bg-yellow-400/25 shadow-[0_0_20px_rgba(250,204,21,0.6)] scale-105'
                                        : 'border-zinc-700 bg-zinc-800/80 hover:border-yellow-400 hover:bg-yellow-400/20'
                                }`}
                            >
                                <Image
                                    src={item.src}
                                    alt={item.label}
                                    width={160}
                                    height={102}
                                    className="slide-text block h-auto w-auto object-contain select-none"
                                />
                            </button>
                        )
                    })}
                </div>

                <div className="ui-badge -translate-x-80 opacity-0 flex justify-center">
                    <button
                        onClick={handleGoToCharacterSelection}
                        className={`group relative flex items-center justify-center gap-3 overflow-hidden rounded-full px-8 py-3.5 font-general font-bold uppercase tracking-wider text-xs md:text-sm transition-all duration-300 active:scale-95 cursor-pointer ${
                            selectedMode && selectedDifficulty
                                ? 'bg-linear-to-r from-yellow-400 via-amber-300 to-yellow-400 text-black shadow-[0_0_25px_rgba(250,204,21,0.7)] hover:scale-105 hover:shadow-[0_0_35px_rgba(250,204,21,1)]'
                                : 'border border-yellow-400/40 bg-zinc-900/85 text-yellow-300/80 hover:border-yellow-400 hover:text-yellow-200 hover:bg-zinc-800/90 shadow-lg'
                        }`}
                    >
                        <span className="slide-text">
                            Go to character selection
                        </span>

                        <FiArrowRight className="slide-text size-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>

            </div>
        </main>
    )
}