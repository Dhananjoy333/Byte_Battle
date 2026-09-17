'use client'

import { useRef, ReactNode } from 'react'
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
    children?: ReactNode
}

export default function FlyingCard({
                                       initialPos,
                                       getPath,
                                       delay = 0,
                                       children,
                                   }: FlyingCardProps) {
    const cardRef = useRef<HTMLDivElement | null>(null)

    useGSAP(() => {
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

        const tl = gsap.timeline({ delay })

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
                        autoRotate: true,
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
    }, [getPath, initialPos, delay])

    return (
        <div
            ref={cardRef}
            className="pointer-events-auto absolute size-64 rounded-2xl border border-yellow-300/30 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 text-white shadow-2xl shadow-yellow-500/10 backdrop-blur-md"
        >
            {children}
        </div>
    )
}