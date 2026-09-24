'use client'

import { useRef, useState, ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

gsap.registerPlugin(MotionPathPlugin)

export interface PathPoint {
    x: number
    y: number
}

interface FlyingCardProps {
    /** Initial position multiplier or absolute offset */
    initialPos?: (dim: { vw: number; vh: number }) => PathPoint
    /** Function returning the motion path points */
    getPath: (dim: { vw: number; vh: number }) => PathPoint[]
    delay?: number
    isSelected?: boolean
    onClick?: () => void
    onSettle?: () => void
    children?: ReactNode
    glowTheme?: 'amber' | 'cyan'
}

export default function FlyingCard({
    initialPos,
    getPath,
    delay = 0,
    isSelected = false,
    onClick,
    onSettle,
    children,
    glowTheme = 'amber',
}: FlyingCardProps) {
    const cardRef = useRef<HTMLDivElement | null>(null)
    const innerRef = useRef<HTMLDivElement | null>(null)
    const [isSettled, setIsSettled] = useState(false)

    // GSAP Flying & Docking Motion Path Timeline - Runs on page mount
    useGSAP(
        () => {
            const card = cardRef.current
            if (!card) return

            const vw = window.innerWidth
            const vh = window.innerHeight

            const path = getPath({ vw, vh })
            const start = initialPos ? initialPos({ vw, vh }) : path[0]

            // Starting state
            gsap.set(card, {
                x: start.x,
                y: start.y,
                scale: 0.35,
                opacity: 0,
            })

            const tl = gsap.timeline({
                delay,
                onComplete: () => {
                    setIsSettled(true)
                    onSettle?.()
                },
            })

            tl.to(card, {
                opacity: 1,
                duration: 0.4,
                ease: 'power1.out',
            })
                .to(
                    card,
                    {
                        duration: 4.5,
                        ease: 'power1.inOut',
                        motionPath: {
                            path,
                            curviness: 1.1,
                            autoRotate: false, // Prevent path-based flipping
                        },
                    },
                    0
                )
                .to(
                    card,
                    {
                        scale: 1,
                        duration: 4.5,
                        ease: 'power1.inOut',
                    },
                    0
                )
                .to(
                    card,
                    {
                        rotation: 0,
                        duration: 0.8,
                        ease: 'back.out(1.2)',
                    },
                    '-=0.5'
                )
        },
        { scope: cardRef }
    )

    // Parallax Tilt on Hover (Active ONLY once settled; does NOT move x or y)
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isSettled) return
        const element = innerRef.current
        if (!element) return

        const rect = element.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateX = ((y - centerY) / centerY) * -10
        const rotateY = ((x - centerX) / centerX) * 10

        gsap.to(element, {
            duration: 0.3,
            rotateX,
            rotateY,
            transformPerspective: 500,
            ease: 'power1.inOut',
        })
    }

    const handleMouseLeave = () => {
        if (!isSettled) return
        const element = innerRef.current
        if (!element) return

        gsap.to(element, {
            duration: 0.3,
            rotateX: 0,
            rotateY: 0,
            ease: 'power1.inOut',
        })
    }

    const handleClick = () => {
        if (!isSettled) return
        onClick?.()
    }

    const glowGradient =
        glowTheme === 'cyan'
            ? 'from-cyan-400/50 via-blue-500/40 to-indigo-500/50'
            : 'from-yellow-400/60 via-amber-400/50 to-yellow-300/60'

    const glowFilter = isSelected
        ? glowTheme === 'cyan'
            ? 'drop-shadow(0 0 25px rgba(79, 183, 221, 0.95)) drop-shadow(0 0 50px rgba(59, 130, 246, 0.6))'
            : 'drop-shadow(0 0 25px rgba(250, 204, 21, 0.95)) drop-shadow(0 0 50px rgba(234, 179, 8, 0.6))'
        : 'drop-shadow(0 15px 25px rgba(0,0,0,0.6))'

    return (
        <div
            ref={cardRef}
            className="pointer-events-auto absolute flex size-90 items-center justify-center select-none"
        >
            {/* Interactive hover & click inner container */}
            <div
                ref={innerRef}
                onClick={handleClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className={`relative flex size-full items-center justify-center transition-[filter] duration-300 ${
                    isSettled ? 'cursor-pointer' : 'cursor-default'
                }`}
                style={{
                    transformStyle: 'preserve-3d',
                    filter: glowFilter,
                }}
            >
                {/* Background Ambient Glow Aura when selected */}
                <div
                    className={`pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-r ${glowGradient} blur-2xl transition-opacity duration-500 ${
                        isSelected ? 'opacity-100' : 'opacity-0'
                    }`}
                />

                {/* Card Content */}
                <div className="relative z-10 size-full flex items-center justify-center pointer-events-none">
                    {children}
                </div>

                {/* Selected Pill Badge */}
                {isSelected && (
                    <div className="absolute -bottom-3 z-20 flex items-center gap-1.5 rounded-full border border-yellow-300/80 bg-zinc-900/90 px-3 py-0.5 text-[10px] font-bold tracking-widest text-yellow-300 uppercase shadow-[0_0_15px_rgba(250,204,21,0.6)] backdrop-blur-md animate-pulse">
                        <span className="size-1.5 rounded-full bg-yellow-400" />
                        Selected
                    </div>
                )}
            </div>
        </div>
    )
}