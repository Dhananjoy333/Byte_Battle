'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Cell } from './types';
import { ConflictPhase } from './logic/duelLogic';
import { P1_BASE, P2_BASE } from './logic/territoryLogic';
import { FiShield, FiAlertTriangle, FiCheckCircle, FiFlag } from 'react-icons/fi';
import { GiCrossedSwords } from 'react-icons/gi';
import { BsGrid3X3GapFill } from 'react-icons/bs';
import { useGameStore } from '@/app/_store/useGameStore';
import { getCharacterById } from '@/app/_data/characters';

const IMAGEKIT_URL = process.env.NEXT_PUBLIC_IMAGEKIT_URL;

interface ChallengePromptProps {
  phase: ConflictPhase;
  cell: Cell | null;
  onAcceptAIChallenge: () => void;
  onRejectAIChallenge: () => void;
  onDismissFeedback: () => void;
  playerCharImg?: string;
  enemyCharImg?: string;
  opponentNumber?: number;
}

export const ChallengePrompt: React.FC<ChallengePromptProps> = ({
  phase,
  cell,
  onAcceptAIChallenge,
  onRejectAIChallenge,
  onDismissFeedback,
  playerCharImg,
  enemyCharImg,
  opponentNumber = 2,
}) => {
  const [playerImgError, setPlayerImgError] = useState(false);
  const [enemyImgError, setEnemyImgError] = useState(false);

  // Character selection integration from game store (fallback if playerCharImg not passed)
  const { selectedCharacterId } = useGameStore();
  const activeChar = getCharacterById(selectedCharacterId);

  if (
    phase !== 'waiting-for-ai' &&
    phase !== 'ai-rejected' &&
    phase !== 'ai-challenge-request' &&
    phase !== 'player-rejected'
  ) {
    return null;
  }

  const isTargetingP1Base =
    cell?.row === P1_BASE.row && cell?.col === P1_BASE.col;
  const isTargetingP2Base =
    cell?.row === P2_BASE.row && cell?.col === P2_BASE.col;

  const cellCoordText = cell
    ? isTargetingP1Base
      ? 'Your Base HQ (0, 0)'
      : isTargetingP2Base
        ? 'Enemy Base HQ'
        : `Cell (${cell.row}, ${cell.col})`
    : 'Target Cell';

  const playerAvatarSrc = playerImgError
    ? `${IMAGEKIT_URL}/char_selec_img/raze.png`
    : playerCharImg || `${IMAGEKIT_URL}/char_selec_img/${activeChar?.id || 'raze'}.png`;

  const enemyAvatarSrc = enemyImgError
    ? `${IMAGEKIT_URL}/char_selec_img/kira.png`
    : enemyCharImg ||
    (IMAGEKIT_URL
      ? `${IMAGEKIT_URL}/territory_img/boss.png`
      : `${IMAGEKIT_URL}/territory_img/boss.png`);

  const isIncoming = phase === 'ai-challenge-request';
  const isOutgoing = phase === 'waiting-for-ai';
  const isPlayerSurrendered = phase === 'player-rejected';
  const isEnemySurrendered = phase === 'ai-rejected';

  // =========================================================================
  // DUEL MODALS USING duel_layout.png:
  // - Incoming (phase === 'ai-challenge-request'): Warning crest, Red heading, Live coordinates, Accept/Reject actions
  // - Outgoing (phase === 'waiting-for-ai'): Shield crest, Gold heading, Explanatory text, Gold pulsing waiting capsule
  // - Player Surrendered (phase === 'player-rejected'): Gold emblem, Outcome heading, Loss description, Wide Continue button
  // - Opponent Surrendered (phase === 'ai-rejected'): Emerald emblem, Victory heading, Bit refund badge, Wide Continue button
  // =========================================================================
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="duel-challenge-title"
    >
      {/* Main Composition Container matching duel_layout.png (1671 x 941, ~1.7758 aspect ratio) */}
      <div className="relative w-full max-w-125 min-[560px]:max-w-155 sm:max-w-175 md:max-w-195 lg:max-w-210 2xl:max-w-300 aspect-1671/941 my-auto shrink-0 select-none flex items-center justify-center">
        {/* Layer 0: Frame Background Image (duel_layout.png) */}
        <Image
          src={`${IMAGEKIT_URL}/territory_img/duel_layout.png`}
          alt=""
          width={1671}
          height={941}
          priority
          className="
    absolute
    left-1/2 top-1/2
    -translate-x-1/2 -translate-y-1/2
    w-[140%] max-w-none
    h-[160%]
    object-fill
    pointer-events-none
    select-none
    z-0
  "
        />

        {/* Layer 1: Top-Center Crest Treatment */}
        {isIncoming && (
          <div className="absolute top-[4%] left-1/2 -translate-x-1/2 translate-y-2 z-20 flex flex-col items-center pointer-events-none">
            <FiAlertTriangle className="size-5 min-[480px]:size-6 sm:size-7 md:size-8 lg:size-14 2xl:size-20 text-[#ff3366] drop-shadow-[0_0_15px_rgba(255,51,102,0.95)] animate-pulse" />
          </div>
        )}

        {isOutgoing && (
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
            <FiShield className="size-5 min-[480px]:size-6 sm:size-7 md:size-8 lg:size-9 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.95)] animate-pulse" />
          </div>
        )}

        {isPlayerSurrendered && (
          <div className="absolute top-[17%] sm:top-[18%] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
            <div className="size-8 min-[480px]:size-10 sm:size-12 rounded-full bg-zinc-950/95 border-2 border-amber-400/90 flex items-center justify-center shadow-[0_0_18px_rgba(251,191,36,0.6)]">
              <GiCrossedSwords className="size-4 min-[480px]:size-5 sm:size-6 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
            </div>
          </div>
        )}

        {isEnemySurrendered && (
          <div className="absolute top-[17%] sm:top-[18%] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
            <div className="size-8 min-[480px]:size-10 sm:size-12 rounded-full bg-zinc-950/95 border-2 border-emerald-400/90 flex items-center justify-center shadow-[0_0_18px_rgba(16,185,129,0.6)]">
              <FiCheckCircle className="size-4.5 min-[480px]:size-5.5 sm:size-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
            </div>
          </div>
        )}

        {/* Layer 2 & 3: Avatars (Rendered only for incoming & outgoing challenge states) */}
        {(isIncoming || isOutgoing) && (
          <>
            {/* Left Avatar: User Selected Character with Cyan/Blue Radiant Aura */}
            <div
              className="absolute left-[6%] min-[480px]:left-[7%] sm:left-[8%] md:left-[9%]  top-[48%] -translate-y-1/2 z-20 w-[18%] sm:w-[19%] 2xl:w-[22%] aspect-square pointer-events-none select-none flex items-center justify-center"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-cyan-500/35 rounded-full blur-xl scale-125 " />
              <div className="relative w-full h-full">
                <Image
                  src={playerAvatarSrc}
                  alt="Player Avatar"
                  fill
                  className="object-contain drop-shadow-[0_0_16px_rgba(6,182,212,0.85)] scale-110"
                  onError={() => setPlayerImgError(true)}
                />
              </div>
            </div>

            {/* Right Avatar: Opponent / Enemy Character with Red/Pink Radiant Aura */}
            <div
              className="absolute right-[6%] min-[480px]:right-[7%] sm:right-[8%] md:right-[9%] top-[48%] -translate-y-1/2 z-20 w-[18%] sm:w-[19%] 2xl:w-[22%] aspect-square pointer-events-none select-none flex items-center justify-center"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-rose-500/35 rounded-full blur-xl scale-125" />
              <div className="relative w-full h-full">
                <Image
                  src={enemyAvatarSrc}
                  alt="Opponent Avatar"
                  fill
                  className="object-contain drop-shadow-[0_0_16px_rgba(244,63,94,0.85)] scale-110"
                  onError={() => setEnemyImgError(true)}
                />
              </div>
            </div>
          </>
        )}

        {/* Layer 4: Central Modal Content Overlay */}
        {isIncoming && (
          /* ========================================================= */
          /* INCOMING CHALLENGE: Interactive State with Accept/Reject   */
          /* ========================================================= */
          <div className="absolute top-[24%] bottom-[16%] left-[21%] right-[21%] z-20  flex flex-col items-center justify-between text-center py-0.5 min-[480px]:py-1 sm:py-2 px-1">
            {/* Eyebrow & Main Heading Stack */}
            <div className="flex flex-col items-center gap-0.5 sm:gap-1 w-full">
              <span className="text-[7.5px] min-[420px]:text-[8.5px] min-[520px]:text-[9.5px] sm:text-[11px] md:text-xs 2xl:text-lg font-mono font-black uppercase tracking-[0.25em] text-rose-400/90">
                CELL DUEL REQUEST
              </span>

              <h2
                id="duel-challenge-title"
                className="text-[11px] min-[420px]:text-xs min-[480px]:text-sm sm:text-base md:text-xl lg:text-2xl 2xl:text-3xl font-black uppercase tracking-wider leading-tight"
              >
                <span className="block text-zinc-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  OPPONENT HAS
                </span>
                <span className="block text-[#ff3864] drop-shadow-[0_0_14px_rgba(255,56,100,0.7)]">
                  CHALLENGED YOU!
                </span>
              </h2>
            </div>

            {/* Description, Highlighted Coordinate & Supporting Text */}
            <div className="flex flex-col items-center gap-0.5 min-[480px]:gap-1 sm:gap-1.5 w-full max-w-sm sm:max-w-md">
              <p className="text-[8px] min-[420px]:text-[9px] min-[480px]:text-[10px] sm:text-xs md:text-sm 2xl:text-lg text-zinc-300 font-medium leading-tight">
                Player {opponentNumber} is attempting to seize your territory at
              </p>

              {/* Highlighted Territory Coordinate Capsule */}
              <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 rounded-md sm:rounded-lg bg-zinc-950/80 border border-amber-400/80 shadow-[0_0_12px_rgba(251,191,36,0.35)]">
                <BsGrid3X3GapFill className="size-2.5 sm:size-3 md:size-3.5 text-amber-400 shrink-0" />
                <span className="font-mono font-black text-[9px] min-[420px]:text-[10px] min-[480px]:text-xs sm:text-sm md:text-base 2xl:text-lg text-amber-300 tracking-wide">
                  {cellCoordText}
                </span>
              </div>

              {/* Special Base Under Attack Warning */}
              {isTargetingP1Base && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-rose-950/90 border border-rose-500/80 text-rose-300 font-bold text-[7.5px] min-[480px]:text-[9px] sm:text-[10px] md:text-xs animate-pulse">
                  <FiAlertTriangle className="size-2.5 sm:size-3 shrink-0 text-rose-400" />
                  <span>⚠ BASE UNDER ATTACK — Surrender will lose match immediately!</span>
                </div>
              )}

              {/* Supporting Text */}
              <p className="text-[7.5px] min-[420px]:text-[8.5px] min-[480px]:text-[9.5px] sm:text-[11px] md:text-xs 2xl:text-[14px] text-zinc-400 leading-tight">
                Accept to defend your cell in a duel, or reject to surrender it.
              </p>
            </div>

            {/* Action Buttons: Accept & Reject */}
            <div className="w-full flex items-center justify-center gap-1.5 min-[480px]:gap-2 sm:gap-3 md:gap-4 px-1 sm:px-2">
              {/* Accept Challenge Button */}
              <button
                type="button"
                onClick={onAcceptAIChallenge}
                className="group relative flex-1 max-w-37.5 min-[480px]:max-w-42.5 sm:max-w-50 md:max-w-60 2xl:max-w-60 py-1 min-[480px]:py-1.5 sm:py-2 md:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl bg-[#00e5a3] hover:bg-[#1affc6] text-zinc-950 font-black text-[8px] min-[420px]:text-[9px] min-[480px]:text-[10px] sm:text-xs md:text-sm uppercase tracking-wider flex items-center justify-center gap-1 sm:gap-1.5 shadow-[0_0_16px_rgba(0,229,163,0.5)] hover:shadow-[0_0_24px_rgba(0,229,163,0.75)] border border-[#00e5a3] active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00e5a3]"
                aria-label="Accept Duel Challenge"
              >
                <GiCrossedSwords className="size-2.5 min-[480px]:size-3 sm:size-3.5 md:size-4 2xl:size-6 shrink-0 transition-transform group-hover:rotate-12" />
                <span className="truncate">ACCEPT CHALLENGE</span>
              </button>

              {/* Reject Challenge Button */}
              <button
                type="button"
                onClick={onRejectAIChallenge}
                className="group relative flex-1 max-w-37.5 min-[480px]:max-w-42.5 sm:max-w-50 md:max-w-60 2xl:max-w-60 py-1 min-[480px]:py-1.5 sm:py-2 md:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl bg-[#140b12]/90 hover:bg-[#200f1c] text-[#ff4d7a] hover:text-[#ff6b91] font-black text-[8px] min-[420px]:text-[9px] min-[480px]:text-[10px] sm:text-xs md:text-sm uppercase tracking-wider flex items-center justify-center gap-1 sm:gap-1.5 border border-[#ff2a5f]/80 sm:border-2 shadow-[0_0_14px_rgba(255,42,95,0.35)] hover:shadow-[0_0_22px_rgba(255,42,95,0.6)] hover:border-[#ff4d7a] active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                aria-label="Reject Duel Challenge"
              >
                <FiFlag className="size-2.5 min-[480px]:size-3 sm:size-3.5 md:size-4 2xl:size-6 shrink-0 transition-transform group-hover:-translate-y-0.5 text-rose-400" />
                <span className="truncate">REJECT CHALLENGE</span>
              </button>
            </div>
          </div>
        )}

        {isOutgoing && (
          /* ========================================================= */
          /* OUTGOING CHALLENGE: Non-Interactive Waiting State         */
          /* ========================================================= */
          <div className="absolute top-[28%] bottom-[16%] left-[21%] right-[21%] z-20 flex flex-col items-center justify-between text-center py-1 min-[480px]:py-1.5 sm:py-2 md:py-3 px-1">
            {/* Eyebrow Label with Decorative Accents */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 w-full">
              <div className="hidden min-[420px]:block h-px w-6 sm:w-10 md:w-14 bg-linear-to-r from-transparent to-amber-400/70" />
              <span className="text-[7.5px] min-[420px]:text-[8.5px] min-[520px]:text-[9.5px] sm:text-[11px] md:text-xs font-mono font-black uppercase tracking-[0.25em] text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
                CELL DUEL
              </span>
              <div className="hidden min-[420px]:block h-px w-6 sm:w-10 md:w-14 bg-linear-to-l from-transparent to-amber-400/70" />
            </div>

            {/* Main Heading & Description */}
            <div className="flex flex-col items-center gap-1 min-[480px]:gap-1.5 sm:gap-2 w-full max-w-sm sm:max-w-md">
              <h2
                id="duel-challenge-title"
                className="text-[12px] min-[420px]:text-sm min-[480px]:text-base sm:text-xl md:text-2xl font-black uppercase tracking-wider leading-tight"
              >
                <span className="text-zinc-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {isTargetingP2Base ? 'CHALLENGING ' : 'CHALLENGING CELL '}
                </span>
                <span className="text-amber-400 drop-shadow-[0_0_14px_rgba(251,191,36,0.7)]">
                  {isTargetingP2Base ? 'ENEMY BASE HQ' : `(${cell?.row ?? 0}, ${cell?.col ?? 0})`}
                </span>
              </h2>

              <p className="text-[8.5px] min-[420px]:text-[9.5px] min-[480px]:text-[11px] sm:text-xs md:text-sm text-zinc-300 font-medium leading-relaxed max-w-xs sm:max-w-sm md:max-w-md">
                {isTargetingP2Base
                  ? 'Assaulting opponent Headquarters! Seizing this cell wins the match.'
                  : 'You challenged the opponent for this cell.'}
              </p>
            </div>

            {/* Prominent Gold Waiting Status Capsule */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 w-full">
              <div className="hidden min-[480px]:block h-px w-6 sm:w-12 md:w-16 bg-linear-to-r from-transparent via-amber-400/30 to-amber-400/70" />
              <div className="inline-flex items-center gap-2 sm:gap-3 px-3.5 sm:px-6 py-1 sm:py-2 md:py-2.5 rounded-full bg-zinc-950/85 border border-amber-400/80 shadow-[0_0_18px_rgba(251,191,36,0.35)]">
                <span className="relative flex size-2.5 sm:size-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full size-2.5 sm:size-3 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
                </span>
                <span className="font-bold text-[8.5px] min-[420px]:text-[9.5px] min-[480px]:text-xs sm:text-sm text-amber-200/95 tracking-wide">
                  Waiting for opponent response...
                </span>
              </div>
              <div className="hidden min-[480px]:block h-px w-6 sm:w-12 md:w-16 bg-linear-to-l from-transparent via-amber-400/30 to-amber-400/70" />
            </div>
          </div>
        )}

        {isPlayerSurrendered && (
          /* ========================================================= */
          /* PLAYER SURRENDERED STATE: Completed Outcome Notification  */
          /* ========================================================= */
          <div className="absolute top-[28%] bottom-[16%] left-[18%] right-[18%] z-20 flex flex-col items-center justify-between text-center py-1 min-[480px]:py-1.5 sm:py-2 md:py-3 px-1">
            {/* Eyebrow Label with Decorative Accents */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 w-full">
              <div className="hidden min-[420px]:block h-px w-6 sm:w-10 md:w-14 bg-linear-to-r from-transparent to-amber-400/70" />
              <span className="text-[7.5px] min-[420px]:text-[8.5px] min-[520px]:text-[9.5px] sm:text-[11px] md:text-xs font-mono font-black uppercase tracking-[0.25em] text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
                TERRITORY SURRENDERED
              </span>
              <div className="hidden min-[420px]:block h-px w-6 sm:w-10 md:w-14 bg-linear-to-l from-transparent to-amber-400/70" />
            </div>

            {/* Main Outcome Heading & Description */}
            <div className="flex flex-col items-center gap-1 min-[480px]:gap-1.5 sm:gap-2 w-full max-w-sm sm:max-w-md">
              <h2
                id="duel-challenge-title"
                className="text-[12px] min-[420px]:text-sm min-[480px]:text-base sm:text-xl md:text-2xl font-black uppercase tracking-wider text-zinc-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight"
              >
                CELL CAPTURED BY OPPONENT
              </h2>

              <p className="text-[8.5px] min-[420px]:text-[9.5px] min-[480px]:text-[11px] sm:text-xs md:text-sm text-zinc-300 font-medium leading-relaxed max-w-xs sm:max-w-sm md:max-w-md">
                You declined the challenge.{' '}
                <strong className="text-white font-bold">{cellCoordText}</strong> now belongs to{' '}
                <strong className="text-white font-bold">Player {opponentNumber}</strong>.
              </p>
            </div>

            {/* Wide Continue Button */}
            <div className="w-full flex items-center justify-center px-2">
              <button
                type="button"
                onClick={onDismissFeedback}
                className="w-full max-w-60 sm:max-w-[320px] md:max-w-95 py-1.5 sm:py-2 md:py-2.5 px-4 rounded-xl bg-[#0c1633]/90 hover:bg-[#12224d] border border-blue-500/50 hover:border-blue-400/80 text-zinc-100 hover:text-white font-black text-[9px] min-[420px]:text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.2em] shadow-[0_0_18px_rgba(30,58,138,0.4)] hover:shadow-[0_0_24px_rgba(59,130,246,0.6)] active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                aria-label="Continue after territory surrender"
              >
                CONTINUE
              </button>
            </div>
          </div>
        )}

        {isEnemySurrendered && (
          /* ========================================================= */
          /* ENEMY SURRENDERED STATE: Territory Captured Notification  */
          /* ========================================================= */
          <div className="absolute top-[28%] bottom-[16%] left-[18%] right-[18%] z-20 flex flex-col items-center justify-between text-center py-1 min-[480px]:py-1.5 sm:py-2 md:py-3 px-1">
            {/* Eyebrow Label with Decorative Accents */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 w-full">
              <div className="hidden min-[420px]:block h-px w-6 sm:w-10 md:w-14 bg-linear-to-r from-transparent to-emerald-400/70" />
              <span className="text-[7.5px] min-[420px]:text-[8.5px] min-[520px]:text-[9.5px] sm:text-[11px] md:text-xs font-mono font-black uppercase tracking-[0.25em] text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                OPPONENT SURRENDERED
              </span>
              <div className="hidden min-[420px]:block h-px w-6 sm:w-10 md:w-14 bg-linear-to-l from-transparent to-emerald-400/70" />
            </div>

            {/* Main Outcome Heading & Description */}
            <div className="flex flex-col items-center gap-1 min-[480px]:gap-1.5 sm:gap-2 w-full max-w-sm sm:max-w-md">
              <h2
                id="duel-challenge-title"
                className="text-[12px] min-[420px]:text-sm min-[480px]:text-base sm:text-xl md:text-2xl font-black uppercase tracking-wider leading-tight"
              >
                <span className="text-zinc-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  TERRITORY{' '}
                </span>
                <span className="text-emerald-400 drop-shadow-[0_0_14px_rgba(16,185,129,0.7)]">
                  CAPTURED!
                </span>
              </h2>

              <p className="text-[8.5px] min-[420px]:text-[9.5px] min-[480px]:text-[11px] sm:text-xs md:text-sm text-zinc-300 font-medium leading-relaxed max-w-xs sm:max-w-sm md:max-w-md">
                The opponent declined your duel challenge.{' '}
                <strong className="text-white font-bold">{cellCoordText}</strong> is now under your control.
              </p>

              {/* Bit Refund Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 font-bold text-[8px] min-[420px]:text-[9px] sm:text-xs shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                <span className="text-emerald-300 font-black">+1 Bit Refunded</span>
                <span className="text-zinc-400 text-[7.5px] sm:text-[10px]">(Net challenge cost: 1 Bit)</span>
              </div>
            </div>

            {/* Wide Continue Button */}
            <div className="w-full flex items-center justify-center px-2">
              <button
                type="button"
                onClick={onDismissFeedback}
                className="w-full max-w-60 sm:max-w-[320px] md:max-w-95 py-1.5 sm:py-2 md:py-2.5 px-4 rounded-xl bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 font-black text-[9px] min-[420px]:text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.2em] shadow-[0_0_18px_rgba(16,185,129,0.5)] hover:shadow-[0_0_26px_rgba(16,185,129,0.8)] active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                aria-label="Continue after territory captured"
              >
                CONTINUE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

