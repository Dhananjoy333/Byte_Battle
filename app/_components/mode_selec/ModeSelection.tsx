"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { FiArrowRight, FiArrowLeft } from "react-icons/fi"
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
            // Character entrance animations
            gsap.from(".char-raze", {
                x: -80,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out",
            })

            gsap.from(".char-lucien", {
                x: 80,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out",
            })

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

    // Helper to calculate responsive docking coordinates based on 4 screen tiers
    const getDockOffsets = (vw: number) => {
        if (vw < 480) {
            // Mobile (around 320px - 480px)
            const dockX = Math.round(Math.min(76, Math.max(66, vw * 0.23)))
            return { dockX, dockY: -35 }
        }
        if (vw < 640) {
            // Large mobile (480px - 640px)
            return { dockX: Math.round(vw * 0.22), dockY: -30 }
        }
        if (vw < 1024) {
            // Tablet (around 768px)
            return { dockX: 140, dockY: -25 }
        }
        if (vw < 1536) {
            // Laptop (around 1280px, e.g. MacBook Air 1280px-1440px)
            return { dockX: 205, dockY: -35 }
        }
        // Desktop 1440p+ / 1536px+
        return { dockX: 285, dockY: -20 }
    }

    return (
        <main
            ref={containerRef}
            className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-[#07080e] select-none"
        >
            <GameToast
                key={toast?.id}
                message={toast?.message ?? null}
                onClose={() => setToast(null)}
            />

            {/* Back Button */}
            <button
                onClick={() => router.push('/')}
                className="ui-badge opacity-0 group absolute left-3 sm:left-5 md:left-6 lg:left-8 xl:left-10 2xl:left-14 top-3 sm:top-5 md:top-6 lg:top-6 xl:top-7 2xl:top-12 z-30 flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 2xl:gap-3 rounded-full border border-zinc-800 bg-zinc-950/80 px-2.5 sm:px-3.5 md:px-4 lg:px-4.5 xl:px-5 2xl:px-7 py-1 sm:py-1.5 md:py-2 lg:py-2 xl:py-2.5 2xl:py-3.5 text-[10px] sm:text-xs lg:text-xs xl:text-sm 2xl:text-base font-general font-semibold uppercase tracking-wider text-blue-100/70 backdrop-blur-md transition-all hover:border-yellow-400/50 hover:text-yellow-300 active:scale-95 cursor-pointer leading-none"
            >
                <FiArrowLeft className="size-3 sm:size-3.5 lg:size-4 xl:size-4.5 2xl:size-5 transition-transform group-hover:-translate-x-1 shrink-0" />
                <span className="leading-none">Home</span>
            </button>

            {/* ================= BACKGROUND STAGE & LIGHTING ================= */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                {/* Tactical Amber Aura for Raze (Left Flank) */}
                <div className="absolute -left-20 lg:-left-32 top-1/2 -translate-y-1/2 h-[95vh] w-[50vw] rounded-full bg-radial from-amber-500/25 via-orange-600/12 to-transparent blur-3xl" />

                {/* Frost Cyan Aura for Lucien (Right Flank) */}
                <div className="absolute -right-20 lg:-right-32 top-1/2 -translate-y-1/2 h-[95vh] w-[50vw] rounded-full bg-radial from-cyan-400/25 via-blue-600/12 to-transparent blur-3xl" />

                {/* Center Arena Battle Spotlight */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[70vh] w-[65vw] rounded-full bg-radial from-yellow-400/12 via-amber-500/4 to-transparent blur-3xl" />

                {/* Cyber Arena Floor Grid */}
                <div className="absolute inset-x-0 bottom-0 h-[42vh] bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-size-[48px_48px] lg:bg-size-[52px_52px] 2xl:bg-size-[56px_56px] mask-[linear-gradient(to_top,black_30%,transparent_100%)] opacity-85" />

                {/* Subtle Horizontal Horizon Divider */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-px w-full max-w-6xl bg-linear-to-r from-transparent via-yellow-400/25 to-transparent opacity-70" />

                {/* Edge Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(5,6,10,0.85)_100%)]" />
            </div>

            {/* ================= LEFT SIDE: RAZE ================= */}
            <div className="char-raze pointer-events-none absolute bottom-0 left-0 xl:-left-2 2xl:-left-8 z-0 md:z-10 flex h-[48vh] sm:h-[62vh] md:h-[76vh] lg:h-[82vh] xl:h-[86vh] 2xl:h-full max-h-337.5 w-[45vw] sm:w-[35vw] md:w-[28vw] lg:w-[26vw] xl:w-[28vw] 2xl:w-[48vw] max-w-47.5 sm:max-w-65 md:max-w-[320px] lg:max-w-87.5 xl:max-w-97.5 2xl:max-w-250 items-end justify-start select-none opacity-20 sm:opacity-30 md:opacity-60 lg:opacity-85 xl:opacity-90 2xl:opacity-100 transition-all duration-500">
                {/* Background Watermark Callsign */}
                <div className="pointer-events-none absolute left-3 sm:left-6 md:left-8 lg:left-10 xl:left-12 2xl:left-16 bottom-10 sm:bottom-16 lg:bottom-20 2xl:bottom-24 select-none font-zentry text-5xl sm:text-7xl md:text-8xl lg:text-9xl 2xl:text-[240px] font-black text-amber-500/15 tracking-tighter uppercase [writing-mode:vertical-lr] rotate-180 hidden sm:block">
                    RAZE
                </div>

                <div className="relative h-full w-full">
                    <Image
                        src={`${IMAGEKIT_URL}/img/raze_left.png`}
                        alt="Raze"
                        fill
                        priority
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 28vw, (max-width: 1536px) 28vw, 850px"
                        className="object-contain object-bottom filter drop-shadow-[0_0_45px_rgba(245,158,11,0.35)] transition-all duration-700"
                    />
                    {/* Bottom fade into floor */}
                    <div className="absolute inset-x-0 bottom-0 h-16 sm:h-20 lg:h-28 2xl:h-36 bg-linear-to-t from-[#07080e] via-[#07080e]/60 to-transparent" />
                </div>
            </div>

            {/* ================= RIGHT SIDE: LUCIEN ================= */}
            <div className="char-lucien pointer-events-none absolute bottom-0 right-0 xl:-right-2 2xl:-right-8 z-0 md:z-10 flex h-[48vh] sm:h-[62vh] md:h-[76vh] lg:h-[82vh] xl:h-[86vh] 2xl:h-full max-h-337.5 w-[45vw] sm:w-[35vw] md:w-[28vw] lg:w-[26vw] xl:w-[28vw] 2xl:w-[48vw] max-w-47.5 sm:max-w-65 md:max-w-[320px] lg:max-w-87.5 xl:max-w-97.5 2xl:max-w-250 items-end justify-end select-none opacity-20 sm:opacity-30 md:opacity-60 lg:opacity-85 xl:opacity-90 2xl:opacity-100 transition-all duration-500">
                {/* Background Watermark Callsign */}
                <div className="pointer-events-none absolute right-3 sm:right-6 md:right-8 lg:right-10 xl:right-12 2xl:right-16 bottom-10 sm:bottom-16 lg:bottom-20 2xl:bottom-24 select-none font-zentry text-5xl sm:text-7xl md:text-8xl lg:text-9xl 2xl:text-[240px] font-black text-cyan-400/15 tracking-tighter uppercase [writing-mode:vertical-rl] hidden sm:block">
                    LUCIEN
                </div>

                <div className="relative h-full w-full">
                    <Image
                        src={`${IMAGEKIT_URL}/img/lucien_right.png`}
                        alt="Lucien"
                        fill
                        priority
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 28vw, (max-width: 1536px) 28vw, 850px"
                        className="object-contain object-bottom filter drop-shadow-[0_0_45px_rgba(56,189,248,0.35)] transition-all duration-700"
                    />
                    {/* Bottom fade into floor */}
                    <div className="absolute inset-x-0 bottom-0 h-16 sm:h-20 lg:h-28 2xl:h-36 bg-linear-to-t from-[#07080e] via-[#07080e]/60 to-transparent" />
                </div>
            </div>

            {/* ================= CENTER: MAIN COMPONENT UI ================= */}
            {/* 1. Header: Select Mode */}
            <div className="ui-badge absolute top-3 sm:top-5 md:top-6 lg:top-6 xl:top-7 2xl:top-12 z-20 flex flex-col items-center overflow-hidden opacity-0 left-1/2 -translate-x-1/2 w-full px-4 pointer-events-none">
                <div className="mb-0.5 sm:mb-1.5 lg:mb-2 2xl:mb-2.5 flex items-center gap-1.5 sm:gap-2 lg:gap-3 2xl:gap-4">
                    <span className="h-px w-4 sm:w-8 md:w-10 lg:w-12 xl:w-16 2xl:w-24 bg-linear-to-r from-transparent to-yellow-400" />
                    <span className="font-general text-[8px] sm:text-[10px] md:text-xs lg:text-xs xl:text-sm 2xl:text-lg uppercase tracking-[0.25em] sm:tracking-[0.35em] lg:tracking-[0.4em] 2xl:tracking-[0.55em] text-yellow-300/80">
                        Combat Protocol
                    </span>
                    <span className="h-px w-4 sm:w-8 md:w-10 lg:w-12 xl:w-16 2xl:w-24 bg-linear-to-l from-transparent to-yellow-400" />
                </div>
                <Image
                    src={`${IMAGEKIT_URL}/icons/select_mode.png`}
                    alt="Select Mode"
                    width={750}
                    height={280}
                    priority
                    className="slide-text block h-8 sm:h-12 md:h-15 lg:h-17 xl:h-22 2xl:h-44 w-auto object-contain select-none filter drop-shadow-[0_0_35px_rgba(250,204,21,0.55)]"
                />
            </div>

            {/* 2. Interactive Flying Cards */}
            <div className="relative z-20 flex items-center justify-center">
                <FlyingCard
                    isSelected={selectedMode === 'pve'}
                    onClick={() => setSelectedMode('pve')}
                    glowTheme="cyan"
                    getPath={({ vw, vh }) => {
                        const { dockX, dockY } = getDockOffsets(vw)
                        return [
                            { x: vw * 0.05, y: vh * 0.55 },
                            { x: vw * 0.42, y: vh * 0.05 },
                            { x: -vw * 0.15, y: -vh * 0.35 },
                            { x: -vw * 0.27, y: -vh * 0.11 },
                            { x: -dockX, y: dockY },
                        ]
                    }}
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
                    getPath={({ vw, vh }) => {
                        const { dockX, dockY } = getDockOffsets(vw)
                        return [
                            { x: -vw * 0.05, y: vh * 0.55 },
                            { x: -vw * 0.42, y: vh * 0.05 },
                            { x: vw * 0.15, y: -vh * 0.35 },
                            { x: vw * 0.27, y: -vh * 0.11 },
                            { x: dockX, y: dockY },
                        ]
                    }}
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

            {/* 3. Footer: Difficulty Selector & Action Button */}
            <div className="absolute bottom-2.5 sm:bottom-4 md:bottom-5 lg:bottom-5 xl:bottom-6 2xl:bottom-12 z-20 flex flex-col items-center gap-2 sm:gap-3 md:gap-3.5 lg:gap-4 xl:gap-4 2xl:gap-8 w-full max-w-5xl px-3 sm:px-4 left-1/2 -translate-x-1/2">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-8">
                    <div className="ui-badge opacity-0 shrink-0">
                        <Image
                            src={`${IMAGEKIT_URL}/icons/select_diff.png`}
                            alt="Select Difficulty"
                            width={400}
                            height={160}
                            priority
                            className="slide-text block h-5 sm:h-8 md:h-9 lg:h-10 xl:h-11 2xl:h-18 w-auto object-contain select-none filter drop-shadow-[0_0_20px_rgba(250,204,21,0.4)]"
                        />
                    </div>

                    <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 xl:gap-3.5 2xl:gap-5">
                        {[
                            {
                                id: "easy",
                                label: "Easy",
                                src: `${IMAGEKIT_URL}/icons/easy.png`,
                            },
                            {
                                id: "medium",
                                label: "Medium",
                                src: `${IMAGEKIT_URL}/icons/medium.png`,
                            },
                            {
                                id: "hard",
                                label: "Hard",
                                src: `${IMAGEKIT_URL}/icons/hard.png`,
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
                                    className={`ui-badge opacity-0 overflow-hidden rounded-md sm:rounded-xl 2xl:rounded-2xl border px-2.5 sm:px-4 md:px-4.5 lg:px-5 xl:px-6 2xl:px-8 py-1 sm:py-2 md:py-2 lg:py-2.5 xl:py-2.5 2xl:py-3.5 transition-all duration-300 active:scale-95 cursor-pointer backdrop-blur-md ${
                                        isSelected
                                            ? 'border-yellow-400 bg-yellow-400/25 shadow-[0_0_30px_rgba(250,204,21,0.75)] scale-105'
                                            : 'border-zinc-800 bg-zinc-900/80 hover:border-yellow-400/70 hover:bg-yellow-400/15'
                                    }`}
                                >
                                    <Image
                                        src={item.src}
                                        alt={item.label}
                                        width={220}
                                        height={140}
                                        className="slide-text block h-5 sm:h-7 md:h-7.5 lg:h-8 xl:h-9 2xl:h-16 w-auto object-contain select-none"
                                    />
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="ui-badge opacity-0 flex justify-center w-full">
                    <button
                        onClick={handleGoToCharacterSelection}
                        className={`group relative flex items-center justify-center overflow-hidden rounded-full px-5 sm:px-8 md:px-10 lg:px-11 xl:px-12 2xl:px-20 py-2.5 sm:py-3 md:py-3 lg:py-3.5 xl:py-3.5 2xl:py-6 font-general font-bold uppercase tracking-wider sm:tracking-widest text-[11px] sm:text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-xl transition-all duration-300 active:scale-95 cursor-pointer ${
                            selectedMode && selectedDifficulty
                                ? 'bg-linear-to-r from-yellow-400 via-amber-300 to-yellow-400 text-black shadow-[0_0_35px_rgba(250,204,21,0.85)] hover:scale-105 hover:shadow-[0_0_55px_rgba(250,204,21,1)]'
                                : 'border border-yellow-400/40 bg-zinc-900/90 text-yellow-300/80 hover:border-yellow-400 hover:text-yellow-200 hover:bg-zinc-800/90 shadow-lg backdrop-blur-md'
                        }`}
                    >
                        <div className="slide-text flex items-center justify-center gap-2 sm:gap-2.5 lg:gap-3 2xl:gap-4 leading-none">
                            <span className="leading-none">
                                Go to character selection
                            </span>
                            <FiArrowRight className="size-3.5 sm:size-4 md:size-4 lg:size-4.5 xl:size-4.5 2xl:size-6 shrink-0 transition-transform group-hover:translate-x-1.5" />
                        </div>
                    </button>
                </div>
            </div>
        </main>
    )
}