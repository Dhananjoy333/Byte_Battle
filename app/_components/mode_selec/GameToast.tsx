'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { FiAlertTriangle, FiX } from 'react-icons/fi'

interface GameToastProps {
    message: string | null
    onClose: () => void
    duration?: number
}

export default function GameToast({
    message,
    onClose,
    duration = 3200,
}: GameToastProps) {
    const toastRef = useRef<HTMLDivElement | null>(null)
    const progressRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!message || !toastRef.current) return

        const el = toastRef.current
        const progressEl = progressRef.current

        // Entrance animation
        gsap.fromTo(
            el,
            { y: -30, opacity: 0, scale: 0.92 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.4,
                ease: 'back.out(1.5)',
            }
        )

        // Progress bar countdown
        let progressTween: gsap.core.Tween | null = null
        if (progressEl) {
            gsap.set(progressEl, { width: '100%' })
            progressTween = gsap.to(progressEl, {
                width: '0%',
                duration: duration / 1000,
                ease: 'linear',
            })
        }

        // Auto dismiss timer
        const timer = setTimeout(() => {
            handleDismiss()
        }, duration)

        return () => {
            clearTimeout(timer)
            progressTween?.kill()
        }
    }, [message, duration])

    const handleDismiss = () => {
        if (!toastRef.current) {
            onClose()
            return
        }

        gsap.to(toastRef.current, {
            y: -20,
            opacity: 0,
            scale: 0.95,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: onClose,
        })
    }

    if (!message) return null

    return (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto select-none">
            <div
                ref={toastRef}
                role="alert"
                className="relative overflow-hidden rounded-xl border border-yellow-400/50 bg-zinc-900/95 px-5 py-3.5 shadow-2xl backdrop-blur-xl shadow-yellow-500/20 flex items-center gap-3 text-sm font-medium tracking-wide text-zinc-100 min-w-[280px] max-w-md"
            >
                {/* Neon Warning Icon */}
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-yellow-400/20 text-yellow-300 shadow-[0_0_12px_rgba(250,204,21,0.5)]">
                    <FiAlertTriangle className="size-4 animate-pulse" />
                </div>

                {/* Message Text */}
                <span className="flex-1 font-sans text-xs md:text-sm uppercase tracking-wider text-yellow-100/90 font-semibold">
                    {message}
                </span>

                {/* Close Button */}
                <button
                    onClick={handleDismiss}
                    aria-label="Dismiss alert"
                    className="shrink-0 rounded-md p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                    <FiX className="size-4" />
                </button>

                {/* Bottom Countdown Progress Bar */}
                <div
                    ref={progressRef}
                    className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-yellow-500 to-amber-300"
                />
            </div>
        </div>
    )
}
