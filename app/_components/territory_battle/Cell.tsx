'use client';

import React from 'react';
import { Cell as CellType } from './types';
import Image from 'next/image';

const IMAGEKIT_URL = process.env.NEXT_PUBLIC_IMAGEKIT_URL;

interface CellProps {
  cell: CellType;
  isInteractable: boolean;
  isChallengeable?: boolean;
  isSelected: boolean;
  isRecentlyCaptured?: boolean;
  isContested?: boolean;
  isConnected?: boolean;
  isBase?: boolean;
  onClick: (cell: CellType) => void;
  children?: React.ReactNode;
}

export const Cell: React.FC<CellProps> = ({
  cell,
  isInteractable,
  isChallengeable = false,
  isSelected,
  isRecentlyCaptured = false,
  isContested = false,
  isConnected = true,
  isBase = false,
  onClick,
  children,
}) => {
  const { owner, row, col } = cell;

  const handleClick = () => {
    if (isInteractable || isChallengeable) {
      onClick(cell);
    }
  };

  const isIsolated = owner !== null && !isConnected;

  // Base styling for rounded-square tactile pixel-game tile
  let visualClasses =
    'relative aspect-square rounded-lg sm:rounded-xl md:rounded-[13px] flex items-center justify-center transition-all duration-200 select-none';

  if (isContested) {
    // Currently contested cell in active duel
    visualClasses +=
      ' border-2 border-yellow-300 shadow-[0_0_24px_rgba(250,204,21,0.95),inset_0_2px_0.5px_rgba(255,255,255,0.6)] animate-pulse scale-[1.05] z-30 cursor-default';
    if (owner === 'player1') {
      visualClasses +=
        ' bg-[linear-gradient(180deg,#34d399_0%,#059669_55%,#047857_100%)]';
    } else {
      visualClasses +=
        ' bg-[linear-gradient(180deg,#fb7185_0%,#e11d48_55%,#9f1239_100%)]';
    }
  } else if (isBase) {
    // Base HQ Cells: Extra luminous glow, strong border, bevel & castle icon
    if (owner === 'player1') {
      visualClasses +=
        ' bg-[linear-gradient(180deg,#38bdf8_0%,#0284c7_45%,#0369a1_100%)] border-2 border-cyan-200 shadow-[0_0_22px_rgba(14,165,233,0.85),0_3px_6px_rgba(0,0,0,0.5),inset_0_2px_0.5px_rgba(255,255,255,0.7),inset_0_-2.5px_1px_rgba(0,0,0,0.4)] cursor-default';
    } else {
      visualClasses +=
        ' bg-[linear-gradient(180deg,#fb7185_0%,#f43f5e_40%,#e11d48_80%,#9f1239_100%)] border-2 border-rose-200 shadow-[0_0_22px_rgba(244,63,94,0.85),0_3px_6px_rgba(0,0,0,0.5),inset_0_2px_0.5px_rgba(255,255,255,0.7),inset_0_-2.5px_1px_rgba(0,0,0,0.4)] cursor-default';
    }
  } else if (owner === 'player1') {
    // Player 1 Territory (Vibrant Emerald / Cyan Teal Game Tile)
    if (isIsolated) {
      // Dimmed green for isolated Player 1 territory
      visualClasses +=
        ' bg-[linear-gradient(180deg,rgba(6,78,59,0.85)_0%,rgba(4,47,36,0.95)_100%)] border-2 border-dashed border-emerald-600/50 opacity-60 filter saturate-75 shadow-[inset_0_1.5px_0.5px_rgba(255,255,255,0.1),inset_0_-2px_1px_rgba(0,0,0,0.5)] cursor-default';
    } else {
      visualClasses +=
        ' bg-[linear-gradient(180deg,#2ed08e_0%,#10b981_35%,#059669_70%,#047857_100%)] border-2 border-[#6ee7b7]/80 shadow-[0_0_12px_rgba(16,185,129,0.45),0_2px_5px_rgba(0,0,0,0.4),inset_0_1.5px_0.5px_rgba(255,255,255,0.45),inset_0_-2.5px_1px_rgba(0,0,0,0.35)] cursor-default';
    }
  } else if (owner === 'player2') {
    // Player 2 Territory (Vibrant Neon Pink / Coral Rose Game Tile)
    if (isSelected) {
      visualClasses +=
        ' bg-[linear-gradient(180deg,#fb7185_0%,#f43f5e_40%,#e11d48_80%,#be123c_100%)] border-2 border-yellow-300 shadow-[0_0_22px_rgba(250,204,21,0.9),inset_0_1.5px_0.5px_rgba(255,255,255,0.45),inset_0_-2.5px_1px_rgba(0,0,0,0.35)] z-20 cursor-pointer scale-[1.04]';
    } else if (isChallengeable) {
      // Adjacent enemy cell challengeable by Player 1
      visualClasses +=
        ' bg-[linear-gradient(180deg,#fb7185_0%,#f43f5e_40%,#e11d48_80%,#be123c_100%)] border-2 border-[#fda4af]/80 shadow-[0_0_12px_rgba(244,63,94,0.45),0_2px_5px_rgba(0,0,0,0.4),inset_0_1.5px_0.5px_rgba(255,255,255,0.45),inset_0_-2.5px_1px_rgba(0,0,0,0.35)] hover:border-yellow-300 hover:shadow-[0_0_18px_rgba(250,204,21,0.8),inset_0_1.5px_0_rgba(255,255,255,0.5)] hover:scale-[1.03] cursor-pointer group';
    } else if (isIsolated) {
      // Dimmed rose for isolated enemy territory
      visualClasses +=
        ' bg-[linear-gradient(180deg,rgba(136,19,55,0.85)_0%,rgba(76,5,25,0.95)_100%)] border-2 border-dashed border-rose-600/50 opacity-60 filter saturate-75 shadow-[inset_0_1.5px_0.5px_rgba(255,255,255,0.1),inset_0_-2px_1px_rgba(0,0,0,0.5)] cursor-default';
    } else {
      visualClasses +=
        ' bg-[linear-gradient(180deg,#fb7185_0%,#f43f5e_40%,#e11d48_80%,#be123c_100%)] border-2 border-[#fda4af]/80 shadow-[0_0_12px_rgba(244,63,94,0.45),0_2px_5px_rgba(0,0,0,0.4),inset_0_1.5px_0.5px_rgba(255,255,255,0.45),inset_0_-2.5px_1px_rgba(0,0,0,0.35)] cursor-default';
      if (isRecentlyCaptured) {
        visualClasses +=
          ' shadow-[0_0_24px_rgba(244,63,94,0.9)] scale-[1.04] transition-transform duration-300';
      }
    }
  } else {
    // Empty Cell: Dark Charcoal Navy Tile with Inset Bevel & Visible Border
    if (isSelected) {
      // Selected valid empty cell ready to be claimed
      visualClasses +=
        ' bg-[linear-gradient(180deg,#1c3d39_0%,#132b29_55%,#0d201e_100%)] border-2 border-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.85),inset_0_1.5px_0.5px_rgba(255,255,255,0.45),inset_0_-2px_1px_rgba(0,0,0,0.4)] z-20 cursor-pointer scale-[1.04]';
    } else if (isInteractable) {
      // Valid adjacent empty cell ready to be captured
      visualClasses +=
        ' bg-[linear-gradient(180deg,#27354b_0%,#1d2637_55%,#151c28_100%)] border border-emerald-400/60 shadow-[0_2px_5px_rgba(0,0,0,0.45),inset_0_1.5px_0.5px_rgba(255,255,255,0.18),inset_0_-2px_1px_rgba(0,0,0,0.5)] hover:border-emerald-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.55),inset_0_1.5px_0.5px_rgba(255,255,255,0.3)] hover:scale-[1.03] cursor-pointer group';
    } else {
      // Inactive empty cell: Dark navy tile with physical bevel & subtle border
      visualClasses +=
        ' bg-[linear-gradient(180deg,#242f43_0%,#1b2333_55%,#141a26_100%)] border border-[#34425a]/90 shadow-[0_2px_4px_rgba(0,0,0,0.45),inset_0_1.5px_0.5px_rgba(255,255,255,0.12),inset_0_-2px_1px_rgba(0,0,0,0.5)] cursor-default';
    }
  }

  const tooltipTitle = isBase
    ? `${owner === 'player1' ? 'PLAYER 1' : 'PLAYER 2'} BASE HQ — Seize to win match immediately!`
    : isIsolated
    ? 'ISOLATED — Reconnect to base to activate'
    : undefined;

  return (
    <div
      onClick={handleClick}
      title={tooltipTitle}
      className={visualClasses}
      data-row={row}
      data-col={col}
      data-owner={owner ?? 'empty'}
      data-connected={isConnected}
      data-base={isBase}
      role="gridcell"
      aria-label={`Cell ${row},${col}${owner ? ` owned by ${owner}` : ''}${isBase ? ' (Base HQ)' : ''}${isIsolated ? ' (Isolated)' : ''}`}
    >
      {/* Base HQ Icon Distinction (Tower Rook Icon from /territory_img/base_tower.png) */}
      {isBase ? (
        <div className="flex flex-col items-center justify-center pointer-events-none w-full h-full p-1 sm:p-1.5 overflow-hidden">
          <Image
            src={`${IMAGEKIT_URL}/territory_img/base_tower.png`}
            alt="Base HQ"
            fill
            className="w-full h-full max-w-[65%] max-h-[65%] object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.95)]"
          />
        </div>
      ) : owner === null ? (
        /* Empty Cell Central Dot Indicator */
        <span
          className={`w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-200 pointer-events-none ${
            isSelected
              ? 'bg-yellow-300 shadow-[0_0_10px_rgba(250,204,21,1)] scale-125'
              : isInteractable
              ? 'bg-emerald-400/80 group-hover:scale-125 group-hover:bg-emerald-300 shadow-[0_0_6px_rgba(52,211,153,0.85)]'
              : 'bg-[#64748b]/60 shadow-[0_0_4px_rgba(148,163,184,0.35)]'
          }`}
        />
      ) : (
        /* Owned Territory Central Dot Indicator */
        <span
          className={`w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 rounded-full pointer-events-none transition-all duration-200 ${
            isSelected
              ? 'bg-yellow-300 shadow-[0_0_10px_rgba(250,204,21,1)] scale-125'
              : isChallengeable
              ? 'bg-rose-950/35 border border-rose-200/50 shadow-[0_0_4px_rgba(254,205,211,0.5)] group-hover:bg-yellow-300 group-hover:border-yellow-100 group-hover:shadow-[0_0_8px_rgba(250,204,21,0.9)]'
              : owner === 'player1'
              ? 'bg-emerald-950/35 border border-emerald-200/50 shadow-[0_0_4px_rgba(167,243,208,0.5)]'
              : 'bg-rose-950/35 border border-rose-200/50 shadow-[0_0_4px_rgba(254,205,211,0.5)]'
          }`}
        />
      )}

      {/* Popover anchor */}
      {children}
    </div>
  );
};

