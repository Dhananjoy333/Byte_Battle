'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'

export default function ExpandButton() {
    const router = useRouter()
    const expanderRef = useRef<HTMLDivElement | null>(null)
    const buttonRef = useRef<HTMLButtonElement | null>(null)

    const handleNavigate = () => {
        const btn = buttonRef.current
        const expander = expanderRef.current
        if (!btn || !expander) return

        // 1. Get exact position and dimensions of the button
        const rect = btn.getBoundingClientRect()

        // 2. Position the expanding element directly behind the button
        gsap.set(expander, {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            borderRadius: '9999px',
            display: 'block',
            opacity: 1,
        })

        // 3. Fade button text out, expand overlay to fill entire viewport
        const tl = gsap.timeline({
            onComplete: () => {
                router.push('/mode_selection')
            },
        })

        tl.to(btn, {
            opacity: 0,
            duration: 0.2,
            ease: 'power1.out',
        }).to(
            expander,
            {
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                borderRadius: '0px',
                duration: 0.7,
                ease: 'power3.inOut',
            },
            '-=0.1'
        )
    }

    return (
        <div className="pointer-events-none absolute inset-x-0 bottom-24 z-40 flex justify-center">
            {/* Hidden expansion element */}
            <div
                ref={expanderRef}
                className="pointer-events-none fixed z-50 hidden bg-yellow-300"
            />

            {/* Trigger Button */}
            <button
                ref={buttonRef}
                onClick={handleNavigate}
                className="pointer-events-auto rounded-full bg-yellow-300 px-8 py-3.5 font-semibold text-black shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95"
            >
                Explore World
            </button>
        </div>
    )
}