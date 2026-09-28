'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
    getCharacterTheme,
    GROUND_IMAGE_URL,
    CharacterTheme,
} from '@/app/_data/characterThemes';
// Preserved Podium import per user instructions: "remove the podium (don't delete the code)"
import { Podium } from './Podium';

export type StageDirection = 'above' | 'below' | 'next' | 'prev';

interface CharacterStageProps {
    characterId: string;
    direction?: StageDirection;
    onPlay?: () => void;
    isBusyRef?: React.MutableRefObject<boolean>;
}

interface TransitionData {
    outgoingId: string;
    incomingId: string;
    direction: StageDirection;
}

export const CharacterStage: React.FC<CharacterStageProps> = ({
    characterId,
    direction = 'above',
    onPlay,
    isBusyRef,
}) => {
    // Current displayed character in center
    const [displayedId, setDisplayedId] = useState<string>(characterId);
    // Active transition data when switching characters
    const [transition, setTransition] = useState<TransitionData | null>(null);

    // If characterId prop changes, initiate transition immediately during render
    // so both outgoing and incoming layers exist in the DOM on this commit pass
    if (characterId !== displayedId && (!transition || transition.incomingId !== characterId)) {
        setTransition({
            outgoingId: displayedId,
            incomingId: characterId,
            direction,
        });
        setDisplayedId(characterId);
    }

    // Refs for animated sliding layers
    const outgoingBgRef = useRef<HTMLDivElement>(null);
    const incomingBgRef = useRef<HTMLDivElement>(null);
    const outgoingCharRef = useRef<HTMLDivElement>(null);
    const incomingCharRef = useRef<HTMLDivElement>(null);

    // Track active GSAP timeline to avoid overlapping conflicts and ensure safe cleanup
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    useGSAP(
        () => {
            if (!transition) return;

            // User requirement:
            // - character in round carousel ABOVE: character goes to LEFT and enters from RIGHT
            // - character in round carousel BELOW: character goes to RIGHT and enters from LEFT
            const isAbove = transition.direction === 'above' || transition.direction === 'prev';
            const outXPercent = isAbove ? -100 : 100;
            const inXPercent = isAbove ? 100 : -100;

            if (timelineRef.current) {
                timelineRef.current.kill();
            }

            // Immediately set starting positions for incoming and outgoing elements
            if (incomingBgRef.current) {
                gsap.set(incomingBgRef.current, { xPercent: inXPercent });
            }
            if (incomingCharRef.current) {
                gsap.set(incomingCharRef.current, {
                    xPercent: inXPercent * 1.15,
                    opacity: 0,
                    scale: 0.96,
                });
            }
            if (outgoingBgRef.current) {
                gsap.set(outgoingBgRef.current, { xPercent: 0 });
            }
            if (outgoingCharRef.current) {
                gsap.set(outgoingCharRef.current, {
                    xPercent: 0,
                    opacity: 1,
                    scale: 1,
                });
            }

            const tl = gsap.timeline({
                defaults: { duration: 0.62, ease: 'power2.inOut' },
                onComplete: () => {
                    setTransition(null);
                    if (isBusyRef) {
                        isBusyRef.current = false;
                    }
                },
            });
            timelineRef.current = tl;

            // Animate outgoing background and character cutout
            if (outgoingBgRef.current) {
                tl.to(outgoingBgRef.current, { xPercent: outXPercent }, 0);
            }
            if (outgoingCharRef.current) {
                tl.to(
                    outgoingCharRef.current,
                    {
                        xPercent: outXPercent * 1.15,
                        opacity: 0,
                        scale: 0.96,
                    },
                    0
                );
            }

            // Animate incoming background and character cutout
            if (incomingBgRef.current) {
                tl.to(incomingBgRef.current, { xPercent: 0 }, 0);
            }
            if (incomingCharRef.current) {
                tl.to(
                    incomingCharRef.current,
                    {
                        xPercent: 0,
                        opacity: 1,
                        scale: 1,
                    },
                    0
                );
            }

            return () => {
                if (timelineRef.current) {
                    timelineRef.current.kill();
                }
                if (isBusyRef) {
                    isBusyRef.current = false;
                }
            };
        },
        { dependencies: [transition] }
    );

    const activeTheme = getCharacterTheme(displayedId);
    const incomingTheme = transition ? getCharacterTheme(transition.incomingId) : null;
    const outgoingTheme = transition ? getCharacterTheme(transition.outgoingId) : null;

    // Helper to render background for a character (supports color gradient & future bg image)
    const renderBackgroundLayer = (
        theme: CharacterTheme,
        ref?: React.Ref<HTMLDivElement>,
        key?: string
    ) => (
        <div
            ref={ref}
            key={key ?? `bg-${theme.id}`}
            className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none will-change-transform"
            style={{ background: theme.bgGradient }}
        >
            {/* If future background image is specified, display it */}
            {theme.bgImageUrl && (
                <div className="absolute inset-0 z-0">
                    <Image
                        src={theme.bgImageUrl}
                        alt={`${theme.name} Background`}
                        fill
                        priority
                        className="object-cover object-center opacity-80"
                    />
                </div>
            )}

            {/* Atmospheric elemental glow halo */}
            <div
                className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-180 h-180 rounded-full blur-[150px] opacity-75 pointer-events-none transition-all duration-700"
                style={{ backgroundColor: theme.glowColor }}
            />

            {/* Subtle high-tech cybernetic radial grid */}
            <div
                className="absolute inset-0 opacity-[0.07] pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(${theme.accentColor} 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                }}
            />

            {/* Vertical Vignette Edge Shadows */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />
        </div>
    );

    // Helper to render character cutout and grounding shadow
    const renderCharacterLayer = (
        theme: CharacterTheme,
        ref?: React.Ref<HTMLDivElement>,
        key?: string
    ) => (
        <div
            ref={ref}
            key={key ?? `char-${theme.id}`}
            className="absolute inset-0 w-full h-full flex items-center -translate-y-30 justify-center pointer-events-none select-none will-change-transform"
        >
            {/* Centered Character Box with Bottom Alignment over Arena Floor */}
            <div className="relative w-125 md:w-155 lg:w-165 h-[66vh] md:h-[74vh] max-h-195 min-h-115 flex items-end justify-center pb-8 md:pb-12">
                {/* Contact grounding shadow on arena floor */}
                <div
                    className="absolute bottom-6 md:bottom-8 w-72 md:w-96 h-10 rounded-full blur-lg pointer-events-none -z-10"
                    style={{
                        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 75%)',
                    }}
                />

                {/* Ambient back-light rim glow */}
                <div
                    className="absolute bottom-16 w-60 h-60 rounded-full blur-[90px] opacity-40 pointer-events-none -z-5"
                    style={{ backgroundColor: theme.accentColor }}
                />

                {/* Character Cutout from /public/selec_char/__charactername */}
                <div className="relative w-full h-full">
                    <Image
                        src={theme.charImageUrl}
                        alt={theme.name}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 700px"
                        style={{
                            objectFit: 'contain',
                            objectPosition: 'center bottom',
                        }}
                        className="drop-shadow-[0_25px_45px_rgba(0,0,0,0.85)] filter contrast-[1.03]"
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden select-none">
            {/* ============================================================== */}
            {/* 1. COLOR BACKGROUNDS (Animated in/out via GSAP)                  */}
            {/* ============================================================== */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {transition && outgoingTheme && incomingTheme ? (
                    <>
                        {renderBackgroundLayer(outgoingTheme, outgoingBgRef, `outgoing-bg-${outgoingTheme.id}`)}
                        {renderBackgroundLayer(incomingTheme, incomingBgRef, `incoming-bg-${incomingTheme.id}`)}
                    </>
                ) : (
                    renderBackgroundLayer(activeTheme)
                )}
            </div>

            {/* ============================================================== */}
            {/* 2. ARENA GROUND (/public/selec_char/ground.png)                 */}
            {/* ============================================================== */}
            <div className="absolute inset-0 z-10 pointer-events-none w-full h-full overflow-hidden">
                <Image
                    src={GROUND_IMAGE_URL}
                    alt="Battle Arena Ground"
                    fill
                    priority
                    sizes="100vw"
                    style={{
                        objectFit: 'cover',
                        objectPosition: 'center bottom',
                    }}
                />

                {/* Subtle reactive floor glow reflection matching active character */}
                <div
                    className="absolute bottom-0 inset-x-0 h-1/3 opacity-30 mix-blend-screen pointer-events-none transition-colors duration-700"
                    style={{
                        background: `radial-gradient(ellipse 70% 60% at 50% 88%, ${
                            incomingTheme?.accentColor ?? activeTheme.accentColor
                        }, transparent 75%)`,
                    }}
                />
            </div>

            {/* ============================================================== */}
            {/* 3. CHARACTER CUTOUT (Animated in/out via GSAP)                   */}
            {/* ============================================================== */}
            <div className="absolute inset-0 z-15 pointer-events-none">
                {transition && outgoingTheme && incomingTheme ? (
                    <>
                        {renderCharacterLayer(outgoingTheme, outgoingCharRef, `outgoing-char-${outgoingTheme.id}`)}
                        {renderCharacterLayer(incomingTheme, incomingCharRef, `incoming-char-${incomingTheme.id}`)}
                    </>
                ) : (
                    renderCharacterLayer(activeTheme)
                )}
            </div>

            {/* ============================================================== */}
            {/* 4. PRESERVED PODIUM CODE (Per instructions: DO NOT DELETE)       */}
            {/* ============================================================== */}
            {/*
                Podium 3D rotating mesh code preserved for future use:
                <div className="hidden">
                    <Podium characterId={characterId} />
                </div>
            */}

            {/* ============================================================== */}
            {/* 5. PRIMARY CTA ACTION BUTTON ("Let's Play!")                   */}
            {/* ============================================================== */}
            <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
                <button
                    type="button"
                    onClick={onPlay}
                    className="px-14 py-4 rounded-2xl bg-linear-to-r from-[#ff4767] to-[#ff3358] hover:from-[#e63a58] hover:to-[#e62b4e] active:scale-95 text-white font-extrabold text-base tracking-wider shadow-[0_12px_30px_rgba(255,71,103,0.55)] hover:shadow-[0_16px_36px_rgba(255,71,103,0.7)] transition-all duration-200 cursor-pointer"
                >
                    Let&apos;s Play!
                </button>
            </div>
        </div>
    );
};