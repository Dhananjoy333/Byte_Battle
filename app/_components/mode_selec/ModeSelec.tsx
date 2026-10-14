"use client";

import React, { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ModeSelectionStage from "./ModeSelectionStage";
import ModeSetupStage from "./ModeSetupStage";
import {
  ModeId,
  OpponentId,
  DifficultyId,
  getModeById,
} from "./modeData";

const IMAGEKIT_URL = process.env.NEXT_PUBLIC_IMAGEKIT_URL;
export type { ModeId, OpponentId, DifficultyId };

interface ModeSelecProps {
  onSelectMode?: (id: ModeId) => void;
  onContinue?: (selection: {
    mode: ModeId;
    opponent: OpponentId;
    difficulty: DifficultyId;
  }) => void;
}

export default function ModeSelec({
  onSelectMode,
  onContinue,
}: ModeSelecProps) {
  const router = useRouter();

  // Selection State
  const [selectedMode, setSelectedMode] = useState<ModeId>("mcq");
  const [selectedOpponent, setSelectedOpponent] = useState<OpponentId>("pve");
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyId>("medium");
  const [, setStage] = useState<"selection" | "setup">("selection");

  // DOM Refs
  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectionStageRef = useRef<HTMLDivElement | null>(null);
  const setupStageRef = useRef<HTMLDivElement | null>(null);

  const headerRef = useRef<HTMLDivElement | null>(null);
  const cardsContainerRef = useRef<HTMLDivElement | null>(null);

  const headingRef = useRef<HTMLDivElement | null>(null);
  const opponentsContainerRef = useRef<HTMLDivElement | null>(null);
  const difficultiesContainerRef = useRef<HTMLDivElement | null>(null);
  const continueBtnRef = useRef<HTMLDivElement | null>(null);

  // Transition & Animation Lock
  const isTransitioningRef = useRef(false);
  const activeTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // Ensure setup stage elements are cleanly initialized
  useGSAP(
    () => {
      if (setupStageRef.current) {
        gsap.set(setupStageRef.current, {
          autoAlpha: 0,
        });
      }
    },
    { scope: containerRef }
  );

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (activeTimelineRef.current) {
        activeTimelineRef.current.kill();
      }
    };
  }, []);

  // Main GSAP Transition from Mode Selection to Setup Screen
  const handleSelectMode = useCallback(
    (modeId: ModeId) => {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;

      // Update selected mode state
      setSelectedMode(modeId);
      if (onSelectMode) {
        onSelectMode(modeId);
      }

      // Check reduced motion preference
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Kill any previous running timeline
      if (activeTimelineRef.current) {
        activeTimelineRef.current.kill();
      }

      const selCards = cardsContainerRef.current?.querySelectorAll("[data-mode-card]");
      const oppCards = opponentsContainerRef.current?.querySelectorAll("[data-opponent-card]");
      const diffCards = difficultiesContainerRef.current?.querySelectorAll("[data-difficulty-card]");

      if (prefersReducedMotion) {
        const tl = gsap.timeline({
          onComplete: () => {
            setStage("setup");
            isTransitioningRef.current = false;
            if (selectionStageRef.current) {
              gsap.set(selectionStageRef.current, { pointerEvents: "none" });
            }
            if (setupStageRef.current) {
              gsap.set(setupStageRef.current, { pointerEvents: "auto" });
            }
          },
        });
        activeTimelineRef.current = tl;

        tl.to(selectionStageRef.current, { autoAlpha: 0, duration: 0.2 })
          .to(setupStageRef.current, { autoAlpha: 1, duration: 0.2 }, "<");
        return;
      }

      // Compute responsive exit offset for mode cards
      const exitOffset = -Math.max(
        typeof window !== "undefined" ? window.innerWidth * 0.8 : 800,
        800
      );

      // Create coordinated GSAP Timeline with clear labels and controlled overlap
      const tl = gsap.timeline({
        onComplete: () => {
          setStage("setup");
          isTransitioningRef.current = false;
          if (selectionStageRef.current) {
            gsap.set(selectionStageRef.current, {
              autoAlpha: 0,
              pointerEvents: "none",
            });
          }
          if (setupStageRef.current) {
            gsap.set(setupStageRef.current, { pointerEvents: "auto" });
          }
        },
      });

      activeTimelineRef.current = tl;

      // Label 1: Mode Selection Exit
      tl.addLabel("exit", 0);

      // Fade out and slightly raise the title and subtitle
      if (headerRef.current) {
        tl.to(
          headerRef.current,
          {
            y: -24,
            autoAlpha: 0,
            duration: 0.42,
            ease: "power2.in",
          },
          "exit"
        );
      }

      // Mode cards exit left together with a subtle stagger
      if (selCards && selCards.length > 0) {
        tl.to(
          selCards,
          {
            x: exitOffset,
            autoAlpha: 0,
            duration: 0.58,
            ease: "power2.inOut",
            stagger: 0.04,
          },
          "exit"
        );
      }

      // Label 2: Setup Stage Entrance
      // Overlap slightly with the exit animation
      tl.addLabel("setup", "exit+=0.22");

      // Reveal the setup stage container (at its exact already-settled grid position)
      if (setupStageRef.current) {
        tl.set(
          setupStageRef.current,
          {
            autoAlpha: 1,
            pointerEvents: "auto",
          },
          "setup"
        );
      }

      // Selected mode heading fades and rises into position (small upward movement: ~y: 16)
      if (headingRef.current) {
        tl.fromTo(
          headingRef.current,
          { y: 16, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.46,
            ease: "power3.out",
          },
          "setup"
        );
      }

      // PvE and PvP cards enter smoothly from the right with moderate offset
      if (oppCards && oppCards.length > 0) {
        const oppOffset = Math.min(
          typeof window !== "undefined" ? window.innerWidth * 0.35 : 300,
          320
        );

        tl.fromTo(
          oppCards,
          { x: oppOffset, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: 0.55,
            ease: "power3.out",
            stagger: 0.08,
          },
          "setup+=0.06"
        );
      }

      // Label 3: Difficulty & Action Entrance
      tl.addLabel("difficulty", "setup+=0.16");

      // Difficulty cards gently rise from positive y offset (y: 28)
      if (diffCards && diffCards.length > 0) {
        tl.fromTo(
          diffCards,
          { y: 28, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.46,
            ease: "power3.out",
            stagger: 0.06,
          },
          "difficulty"
        );
      }

      // Continue button reveals with subtle rise
      if (continueBtnRef.current) {
        tl.fromTo(
          continueBtnRef.current,
          { y: 18, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.42,
            ease: "power3.out",
          },
          "difficulty+=0.1"
        );
      }
    },
    [onSelectMode]
  );

  // Return smoothly to Mode Selection stage
  const handleBackToModes = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    if (activeTimelineRef.current) {
      activeTimelineRef.current.kill();
    }

    const selCards = cardsContainerRef.current?.querySelectorAll("[data-mode-card]");
    const oppCards = opponentsContainerRef.current?.querySelectorAll("[data-opponent-card]");
    const diffCards = difficultiesContainerRef.current?.querySelectorAll("[data-difficulty-card]");
    const pvpCards = setupStageRef.current?.querySelectorAll("[data-pvp-card]");

    const tl = gsap.timeline({
      onComplete: () => {
        setStage("selection");
        setSelectedOpponent("pve");
        isTransitioningRef.current = false;
        if (setupStageRef.current) {
          gsap.set(setupStageRef.current, {
            autoAlpha: 0,
            pointerEvents: "none",
          });
        }
        if (selectionStageRef.current) {
          gsap.set(selectionStageRef.current, { pointerEvents: "auto" });
        }
      },
    });

    activeTimelineRef.current = tl;

    // Label 1: Setup Exit
    tl.addLabel("setupExit", 0);

    if (oppCards && oppCards.length > 0) {
      tl.to(
        oppCards,
        {
          x: 200,
          autoAlpha: 0,
          duration: 0.32,
          ease: "power2.in",
          stagger: 0.04,
        },
        "setupExit"
      );
    }

    if (diffCards && diffCards.length > 0) {
      tl.to(
        diffCards,
        {
          y: 20,
          autoAlpha: 0,
          duration: 0.28,
          ease: "power2.in",
          stagger: 0.03,
        },
        "setupExit"
      );
    }

    if (pvpCards && pvpCards.length > 0) {
      tl.to(
        pvpCards,
        {
          y: 20,
          autoAlpha: 0,
          duration: 0.28,
          ease: "power2.in",
          stagger: 0.03,
        },
        "setupExit"
      );
    }

    if (continueBtnRef.current) {
      tl.to(
        continueBtnRef.current,
        { autoAlpha: 0, y: 15, duration: 0.25, ease: "power2.in" },
        "setupExit"
      );
    }

    if (headingRef.current) {
      tl.to(
        headingRef.current,
        { autoAlpha: 0, y: -12, duration: 0.25, ease: "power2.in" },
        "setupExit"
      );
    }

    // Label 2: Selection Entrance
    tl.addLabel("selectionEnter", "setupExit+=0.15");

    if (selectionStageRef.current) {
      tl.set(
        selectionStageRef.current,
        { autoAlpha: 1, pointerEvents: "auto" },
        "selectionEnter"
      );
    }

    // Animate selection cards back in from the left
    if (selCards && selCards.length > 0) {
      tl.fromTo(
        selCards,
        { x: -600, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          duration: 0.54,
          ease: "power3.out",
          stagger: 0.05,
        },
        "selectionEnter"
      );
    }

    // Animate title and subtitle back down
    if (headerRef.current) {
      tl.fromTo(
        headerRef.current,
        { y: -24, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.44,
          ease: "power3.out",
        },
        "selectionEnter+=0.06"
      );
    }
  }, []);

  // Continue button handler
  const handleContinue = () => {
    if (onContinue) {
      onContinue({
        mode: selectedMode,
        opponent: selectedOpponent,
        difficulty: selectedDifficulty,
      });
    }
    router.push("/char_selection");
  };

  const currentModeItem = getModeById(selectedMode);

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-[#eef2f8]"
    >
      {/* Background artwork: fixed to viewport so it never scales or zooms */}
      <div
        aria-hidden
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none select-none"
        style={{ backgroundImage: `url('${IMAGEKIT_URL}/mode_selec_img/bg.png')` }}
      />

      {/* Soft gradient bottom fade: fixed to viewport */}
      <div
        aria-hidden
        className="fixed inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-white/40 to-transparent pointer-events-none"
      />

      {/* Main Content Area: CSS Grid stacking context guarantees identical layout origins */}
      <div className="relative z-10 mx-auto grid grid-cols-1 grid-rows-1 items-start justify-items-center min-h-screen max-w-375 w-full px-4 pb-12 pt-8 sm:px-8">
        {/* Stage 1: Mode Selection Stage */}
        <div
          ref={selectionStageRef}
          className="col-start-1 row-start-1 w-full flex flex-col items-center"
        >
          <ModeSelectionStage
            onSelectMode={handleSelectMode}
            headerRef={headerRef}
            cardsContainerRef={cardsContainerRef}
          />
        </div>

        {/* Stage 2: Mode Setup Stage (Opponent & Difficulty) */}
        <div
          ref={setupStageRef}
          className="col-start-1 row-start-1 w-full flex flex-col items-center pointer-events-none"
          style={{ visibility: "hidden", opacity: 0 }}
        >
          <ModeSetupStage
            mode={currentModeItem}
            selectedOpponent={selectedOpponent}
            selectedDifficulty={selectedDifficulty}
            onSelectOpponent={setSelectedOpponent}
            onSelectDifficulty={setSelectedDifficulty}
            onContinue={handleContinue}
            onBackToModes={handleBackToModes}
            headingRef={headingRef}
            opponentsContainerRef={opponentsContainerRef}
            difficultiesContainerRef={difficultiesContainerRef}
            continueBtnRef={continueBtnRef}
          />
        </div>
      </div>
    </main>
  );
}
