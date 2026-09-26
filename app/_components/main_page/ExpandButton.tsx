'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import { FiArrowDown } from 'react-icons/fi'

export default function ExpandButton() {
    const router = useRouter()
    const expanderRef = useRef<HTMLDivElement | null>(null)
    const buttonRef = useRef<HTMLButtonElement | null>(null)
    const exploreRef = useRef<HTMLAnchorElement | null>(null)

    const handleNavigate = () => {
        const btn = buttonRef.current
        const expander = expanderRef.current
        const explore = exploreRef.current
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

        // 3. Fade button and explore prompt out, expand overlay to fill entire viewport
        const tl = gsap.timeline({
            onComplete: () => {
                router.push('/mode_selection')
            },
        })

        const elementsToFade = explore ? [btn, explore] : [btn]

        tl.to(elementsToFade, {
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

    const handleScrollToExplore = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        const target = document.getElementById('about')
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' })
        } else {
            window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
        }
    }

    return (
        <div className="pointer-events-none absolute inset-x-0 bottom-8 sm:bottom-10 z-40 flex flex-col items-center justify-center">
            {/* Hidden expansion element */}
            <div
                ref={expanderRef}
                className="pointer-events-none fixed z-50 hidden bg-yellow-300"
            />

            {/* Trigger Button */}
            <button
                ref={buttonRef}
                onClick={handleNavigate}
                className="pointer-events-auto rounded-full bg-yellow-300 px-8 py-3.5 font-general font-semibold text-black shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95"
            >
                Start the GAME
            </button>

            {/* Bouncing downward arrow with 'or explore more' */}
            <a
                href="#about"
                ref={exploreRef}
                onClick={handleScrollToExplore}
                className="group pointer-events-auto mt-3.5 flex cursor-pointer flex-col items-center gap-1.5 text-blue-100/80 transition-colors duration-300 hover:text-yellow-300 focus:outline-none"
                aria-label="or explore more"
            >
                <span className="font-general text-xs uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-colors duration-300 group-hover:text-yellow-300">
                    or explore more
                </span>
                <FiArrowDown className="size-5 animate-bounce drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:translate-y-1" />
            </a>
        </div>
    )
}