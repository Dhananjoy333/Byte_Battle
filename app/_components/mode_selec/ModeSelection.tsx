"use client"

import { useRef } from "react"
import Image from "next/image"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import FlyingCard from "@/app/_components/mode_selec/FlyingCard"

export default function ModeSelection() {
    const containerRef = useRef<HTMLDivElement | null>(null)

    // useGSAP(
    //     () => {
    //         const cardDockTime = 4.2
    //         const tl = gsap.timeline({
    //             delay: cardDockTime,
    //             defaults: { ease: "power2.out", duration: 0.6 },
    //         })
    //
    //         // 1. Fade in the badges/boxes
    //         tl.to(".ui-badge", {
    //             opacity: 1,
    //             duration: 0.3,
    //         })
    //             // 2. Slide the masked text upward from bottom
    //             .from(
    //                 ".slide-text",
    //                 {
    //                     yPercent: 120,
    //                     opacity: 0,
    //                     stagger: 0.08,
    //                 },
    //                 "-=0.1"
    //             )
    //     },
    //     { scope: containerRef }
    // )

    return (
        <main
            ref={containerRef}
            className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-zinc-950"
        >
            {/* Background Image from public/img/mode_selec.png */}
            <div className="pointer-events-none absolute inset-0 z-0">
                <Image
                    src="/img/mode_selec.png"
                    alt="Mode Selection Background"
                    fill
                    priority
                    className="object-cover object-center select-none"
                />
                {/* Optional dark overlay to ensure cards and text pop clearly */}
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* "Select Mode :" */}
            <div className="ui-badge absolute left-1/2 -translate-x-230 top-1/2 -translate-y-30 z-20 overflow-hidden opacity-100">
                <Image
                    src="/icons/select_mode.png"
                    alt="Select Mode"
                    width={550}
                    height={300}
                    priority
                    className="slide-text block h-auto w-auto object-contain select-none"
                />
            </div>

            {/* Cards Center Area */}
            <div className="relative z-10 flex items-center justify-center">
                <FlyingCard
                    getPath={({ vw, vh }) => [
                        { x: vw * 0.05, y: vh * 0.55 },
                        { x: vw * 0.42, y: vh * 0.05 },
                        { x: -vw * 0.15, y: -vh * 0.35 },
                        { x: -vw * 0.27, y: -vh * 0.11 },
                        { x: -150, y: -20 },
                    ]}
                >
                    <div className="flex h-full w-full items-center justify-center text-4xl font-black tracking-wider text-white">
                        PVE
                    </div>
                </FlyingCard>

                <FlyingCard
                    delay={0.2}
                    getPath={({ vw, vh }) => [
                        { x: -vw * 0.05, y: vh * 0.55 },
                        { x: -vw * 0.42, y: vh * 0.05 },
                        { x: vw * 0.15, y: -vh * 0.35 },
                        { x: vw * 0.27, y: -vh * 0.11 },
                        { x: 150, y: -20 },
                    ]}
                >
                    <div className="flex h-full w-full items-center justify-center text-4xl font-black tracking-wider text-white">
                        PVP
                    </div>
                </FlyingCard>
            </div>

            {/* Difficulty Selection */}
            <div className="absolute bottom-16 z-20 flex items-center gap-4">
                <div className="ui-badge overflow-hidden rounded-md border border-zinc-700 bg-zinc-800/80 px-5 py-2 backdrop-blur-md opacity-0">
                    <span className="slide-text inline-block text-lg font-semibold text-zinc-100">
                        Select Difficulty :
                    </span>
                </div>

                {["Easy", "Medium", "Hard"].map((difficulty) => (
                    <button
                        key={difficulty}
                        className="ui-badge overflow-hidden rounded-md border border-zinc-700 bg-zinc-800/80 px-6 py-2 transition-colors hover:border-yellow-400 hover:bg-yellow-400/20 active:scale-95 opacity-0"
                    >
                        <span className="slide-text inline-block text-lg font-semibold text-zinc-100">
                            {difficulty}
                        </span>
                    </button>
                ))}
            </div>
        </main>
    )
}