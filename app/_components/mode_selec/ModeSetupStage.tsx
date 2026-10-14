"use client";

import React, { forwardRef, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ModeHeading from "./ModeHeading";
import OpponentCard from "./OpponentCard";
import DifficultyCard from "./DifficultyCard";
import PvpOptionsPanel from "./PvpOptionsPanel";
import {
  ModeItem,
  OpponentId,
  DifficultyId,
  OPPONENTS,
  DIFFICULTIES,
} from "./modeData";

interface ModeSetupStageProps {
  mode: ModeItem;
  selectedOpponent: OpponentId;
  selectedDifficulty: DifficultyId;
  onSelectOpponent: (id: OpponentId) => void;
  onSelectDifficulty: (id: DifficultyId) => void;
  onContinue: () => void;
  onBackToModes?: () => void;
  headingRef: React.RefObject<HTMLDivElement | null>;
  opponentsContainerRef: React.RefObject<HTMLDivElement | null>;
  difficultiesContainerRef: React.RefObject<HTMLDivElement | null>;
  continueBtnRef: React.RefObject<HTMLDivElement | null>;
}

export const ModeSetupStage = forwardRef<HTMLDivElement, ModeSetupStageProps>(
  function ModeSetupStage(
    {
      mode,
      selectedOpponent,
      selectedDifficulty,
      onSelectOpponent,
      onSelectDifficulty,
      onContinue,
      onBackToModes,
      headingRef,
      opponentsContainerRef,
      difficultiesContainerRef,
      continueBtnRef,
    },
    ref
  ) {
    // Scoped container for stage animations
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Section refs for coordinated transitions
    const pveSectionRef = useRef<HTMLDivElement | null>(null);
    const pvpSectionRef = useRef<HTMLDivElement | null>(null);
    const diffTitleRef = useRef<HTMLDivElement | null>(null);
    const dividerRef = useRef<HTMLDivElement | null>(null);

    // Track previous opponent to prevent duplicate animations on re-renders
    const prevOpponentRef = useRef<OpponentId>(selectedOpponent);
    const transitionTlRef = useRef<gsap.core.Timeline | null>(null);

    // Setup initial visibility state based on selectedOpponent
    useGSAP(
      () => {
        if (selectedOpponent === "pve") {
          if (pveSectionRef.current) {
            gsap.set(pveSectionRef.current, {
              autoAlpha: 1,
              y: 0,
              pointerEvents: "auto",
            });
          }
          if (pvpSectionRef.current) {
            gsap.set(pvpSectionRef.current, {
              autoAlpha: 0,
              y: 35,
              pointerEvents: "none",
            });
          }
        } else {
          if (pveSectionRef.current) {
            gsap.set(pveSectionRef.current, {
              autoAlpha: 0,
              y: 35,
              pointerEvents: "none",
            });
          }
          if (pvpSectionRef.current) {
            gsap.set(pvpSectionRef.current, {
              autoAlpha: 1,
              y: 0,
              pointerEvents: "auto",
            });
          }
        }
      },
      { scope: containerRef }
    );

    // Coordinate PVE <-> PVP transitions using a dedicated GSAP timeline
    useGSAP(
      () => {
        // Only run transition when opponent selection actually changes
        if (prevOpponentRef.current === selectedOpponent) {
          return;
        }

        const isPvp = selectedOpponent === "pvp";
        prevOpponentRef.current = selectedOpponent;

        // Clean up any previously running transition timeline
        if (transitionTlRef.current) {
          transitionTlRef.current.kill();
        }

        const prefersReducedMotion =
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const diffCards = difficultiesContainerRef.current?.querySelectorAll(
          "[data-difficulty-card]"
        );
        const pvpCards = pvpSectionRef.current?.querySelectorAll("[data-pvp-card]");
        const diffTitle = diffTitleRef.current;
        const continueBtn = continueBtnRef.current;

        // Fallback for reduced motion preference
        if (prefersReducedMotion) {
          const tl = gsap.timeline();
          transitionTlRef.current = tl;

          if (isPvp) {
            tl.to(pveSectionRef.current, {
              autoAlpha: 0,
              duration: 0.2,
              onComplete: () => {
                if (pveSectionRef.current) {
                  pveSectionRef.current.style.pointerEvents = "none";
                }
              },
            }).to(
              pvpSectionRef.current,
              {
                autoAlpha: 1,
                duration: 0.2,
                onStart: () => {
                  if (pvpSectionRef.current) {
                    pvpSectionRef.current.style.pointerEvents = "auto";
                  }
                },
              },
              "<"
            );
          } else {
            tl.to(pvpSectionRef.current, {
              autoAlpha: 0,
              duration: 0.2,
              onComplete: () => {
                if (pvpSectionRef.current) {
                  pvpSectionRef.current.style.pointerEvents = "none";
                }
              },
            }).to(
              pveSectionRef.current,
              {
                autoAlpha: 1,
                duration: 0.2,
                onStart: () => {
                  if (pveSectionRef.current) {
                    pveSectionRef.current.style.pointerEvents = "auto";
                  }
                },
              },
              "<"
            );
          }
          return;
        }

        // Standard GSAP Timeline for smooth, coordinated transition
        const tl = gsap.timeline({
          onComplete: () => {
            if (isPvp) {
              if (pveSectionRef.current) {
                gsap.set(pveSectionRef.current, {
                  autoAlpha: 0,
                  pointerEvents: "none",
                });
              }
              if (pvpSectionRef.current) {
                gsap.set(pvpSectionRef.current, { pointerEvents: "auto" });
              }
            } else {
              if (pvpSectionRef.current) {
                gsap.set(pvpSectionRef.current, {
                  autoAlpha: 0,
                  pointerEvents: "none",
                });
              }
              if (pveSectionRef.current) {
                gsap.set(pveSectionRef.current, { pointerEvents: "auto" });
              }
            }
          },
        });

        transitionTlRef.current = tl;

        if (isPvp) {
          // ==============================
          // PVE -> PVP TRANSITION
          // ==============================

          // 1. Disable outgoing section interaction immediately
          if (pveSectionRef.current) {
            pveSectionRef.current.style.pointerEvents = "none";
          }

          // 2. Animate difficulty cards downward with positive y and fade out
          // Moderate translation distance (35px) prevents overflow or scrolling
          if (diffCards && diffCards.length > 0) {
            tl.to(
              diffCards,
              {
                y: 35,
                autoAlpha: 0,
                duration: 0.32,
                ease: "power2.in",
                stagger: 0.04,
              },
              0
            );
          }

          // Animate difficulty title and continue button downward as well
          const outElements = [diffTitle, continueBtn].filter(Boolean);
          if (outElements.length > 0) {
            tl.to(
              outElements,
              {
                y: 25,
                autoAlpha: 0,
                duration: 0.28,
                ease: "power2.in",
              },
              0
            );
          }

          // 3. PVP options panel enters from below
          // Start slightly before outgoing animation completes (at 0.18s) for seamless flow
          if (pvpSectionRef.current) {
            tl.set(
              pvpSectionRef.current,
              {
                autoAlpha: 1,
                pointerEvents: "auto",
              },
              0.18
            );
          }

          // Animate the two PVP option cards upward into position with polished easing
          if (pvpCards && pvpCards.length > 0) {
            tl.fromTo(
              pvpCards,
              { y: 40, autoAlpha: 0 },
              {
                y: 0,
                autoAlpha: 1,
                duration: 0.46,
                ease: "power3.out",
                stagger: 0.07,
              },
              0.2
            );
          }

          // Animate middle divider if present
          if (dividerRef.current) {
            tl.fromTo(
              dividerRef.current,
              { y: 22, autoAlpha: 0 },
              {
                y: 0,
                autoAlpha: 1,
                duration: 0.38,
                ease: "power3.out",
              },
              0.26
            );
          }
        } else {
          // ==============================
          // PVP -> PVE TRANSITION
          // ==============================

          // 1. Disable outgoing PVP interaction immediately
          if (pvpSectionRef.current) {
            pvpSectionRef.current.style.pointerEvents = "none";
          }

          // 2. Animate PVP cards downward with positive y and fade out
          if (pvpCards && pvpCards.length > 0) {
            tl.to(
              pvpCards,
              {
                y: 35,
                autoAlpha: 0,
                duration: 0.28,
                ease: "power2.in",
                stagger: 0.04,
              },
              0
            );
          }

          if (dividerRef.current) {
            tl.to(
              dividerRef.current,
              {
                y: 20,
                autoAlpha: 0,
                duration: 0.22,
                ease: "power2.in",
              },
              0
            );
          }

          // 3. Difficulty cards and continue button rise upward into view
          if (pveSectionRef.current) {
            tl.set(
              pveSectionRef.current,
              {
                autoAlpha: 1,
                pointerEvents: "auto",
              },
              0.16
            );
          }

          if (diffCards && diffCards.length > 0) {
            tl.fromTo(
              diffCards,
              { y: 35, autoAlpha: 0 },
              {
                y: 0,
                autoAlpha: 1,
                duration: 0.44,
                ease: "power3.out",
                stagger: 0.05,
              },
              0.18
            );
          }

          const inElements = [diffTitle, continueBtn].filter(Boolean);
          if (inElements.length > 0) {
            tl.fromTo(
              inElements,
              { y: 25, autoAlpha: 0 },
              {
                y: 0,
                autoAlpha: 1,
                duration: 0.4,
                ease: "power3.out",
              },
              0.22
            );
          }
        }
      },
      { dependencies: [selectedOpponent], scope: containerRef }
    );

    // Cleanup on unmount
    React.useEffect(() => {
      return () => {
        if (transitionTlRef.current) {
          transitionTlRef.current.kill();
        }
      };
    }, []);

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }
        }}
        className="w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto flex flex-col items-center px-4 py-2 select-none"
      >
        {/* 1. Mode Heading */}
        <div ref={headingRef} className="w-full will-change-transform">
          <ModeHeading mode={mode} />
        </div>

        {/* 2. Choose Opponent Section */}
        <section className="w-full mt-5 sm:mt-7">
          <div className="flex items-center justify-center gap-3 text-[11px] sm:text-xs 2xl:text-lg font-bold tracking-[0.25em] text-slate-500 uppercase">
            {/* Left ornament */}
            <div className="flex items-center gap-2">
              <span className="h-px w-8 sm:w-12 2xl:w-14 bg-slate-700" />
              <span className="h-2 w-2 rotate-45 bg-slate-700" />
            </div>

            <span>CHOOSE OPPONENT</span>

            {/* Right ornament */}
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rotate-45 bg-slate-700" />
              <span className="h-px w-8 sm:w-12 2xl:w-14 bg-slate-700" />
            </div>
          </div>

          <div
            ref={opponentsContainerRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-5 sm:mt-6 will-change-transform"
          >
            {OPPONENTS.map((opp) => (
              <div key={opp.id} data-opponent-card className="will-change-transform">
                <OpponentCard
                  id={opp.id}
                  title={opp.title}
                  description={opp.description}
                  image={opp.image}
                  isSelected={selectedOpponent === opp.id}
                  onSelect={() => onSelectOpponent(opp.id)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* 3. Stacked Dynamic Container for Difficulty (PVE) and PVP Options Panel (PVP) */}
        {/* CSS Grid stacking context guarantees identical layout origins with zero layout shift */}
        <section className="relative w-full mt-5 sm:mt-6 grid grid-cols-1 grid-rows-1 items-start justify-items-center">
          {/* PVE Content: Difficulty Cards & Continue Action */}
          <div
            ref={pveSectionRef}
            className="col-start-1 row-start-1 w-full flex flex-col items-center will-change-transform"
          >
            {/* Select Difficulty Header */}
            <div
              ref={diffTitleRef}
              className="flex items-center justify-center gap-3 text-[11px] sm:text-xs 2xl:text-lg font-bold tracking-[0.25em] text-slate-500 uppercase will-change-transform"
            >
              {/* Left ornament */}
              <div className="flex items-center gap-2">
                <span className="h-px w-8 sm:w-12 2xl:w-14 bg-slate-700" />
                <span className="h-2 w-2 rotate-45 bg-slate-700" />
              </div>

              <span>SELECT DIFFICULTY</span>

              {/* Right ornament */}
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rotate-45 bg-slate-700" />
                <span className="h-px w-8 sm:w-12 2xl:w-14 bg-slate-700" />
              </div>
            </div>

            {/* Difficulty Cards Grid */}
            <div
              ref={difficultiesContainerRef}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-5 sm:mt-6 w-full will-change-transform"
            >
              {DIFFICULTIES.map((diff) => (
                <div key={diff.id} data-difficulty-card className="will-change-transform">
                  <DifficultyCard
                    id={diff.id}
                    title={diff.title}
                    description={diff.description}
                    accent={diff.accent}
                    bars={diff.bars}
                    isSelected={selectedDifficulty === diff.id}
                    onSelect={() => onSelectDifficulty(diff.id)}
                  />
                </div>
              ))}
            </div>

            {/* Continue Button */}
            <div
              ref={continueBtnRef}
              className="mt-6 sm:mt-7 flex flex-col items-center will-change-transform"
            >
              <button
                type="button"
                onClick={onContinue}
                className="group relative flex items-center justify-center gap-2 rounded-xl border-2 border-amber-400 bg-linear-to-r from-amber-300 via-yellow-400 to-amber-400 px-10 sm:px-14 py-3 sm:py-3.5 text-sm sm:text-base font-black uppercase tracking-widest text-slate-900 shadow-[0_4px_24px_rgba(245,158,11,0.45)] transition-all duration-200 hover:brightness-105 hover:scale-[1.02] active:scale-[0.98] cursor-pointer focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-amber-500"
              >
                {/* Cyber Corner Accents on Button */}
                <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-amber-500" />
                <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-amber-500" />
                <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-amber-500" />
                <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-amber-500" />

                <span>CONTINUE</span>
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 stroke-current transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>

          {/* PVP Content: Matchmaking & Play with Friends Panel */}
          <div
            ref={pvpSectionRef}
            className="col-start-1 row-start-1 w-full flex flex-col items-center will-change-transform pointer-events-none"
            style={{ visibility: "hidden", opacity: 0 }}
          >
            <PvpOptionsPanel
              onFindMatch={onContinue}
              onConnectRoom={(code) => {
                console.log("Connect to room:", code);
                onContinue();
              }}
              dividerRef={dividerRef}
            />
          </div>
        </section>

        {/* 4. Back Navigation (always visible in both PVE and PVP) */}
        {onBackToModes && (
          <div className="mt-5 sm:mt-6 2xl:mt-12 flex justify-center">
            <button
              type="button"
              onClick={onBackToModes}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-slate-900 transition-colors cursor-pointer py-1"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Back to Game Modes</span>
            </button>
          </div>
        )}
      </div>
    );
  }
);

ModeSetupStage.displayName = "ModeSetupStage";

export default ModeSetupStage;
