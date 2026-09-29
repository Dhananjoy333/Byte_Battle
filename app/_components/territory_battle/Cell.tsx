'use client';

import React from 'react';
import { Cell as CellType } from './types';

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

  // Base style for square shape and layout
  let visualClasses =
    'relative aspect-square rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-200 select-none';

  if (isContested) {
    // Currently contested cell in an active duel
    visualClasses +=
      ' border-2 border-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.9)] animate-pulse scale-[1.05] z-30';
    if (owner === 'player1') {
      visualClasses += ' bg-gradient-to-br from-emerald-600 to-emerald-800';
    } else {
      visualClasses += ' bg-gradient-to-br from-rose-600 to-rose-800';
    }
  } else if (owner === 'player1') {
    // Player 1 Territory
    if (isIsolated) {
      // Dimmed green for isolated Player 1 territory
      visualClasses +=
        ' bg-gradient-to-br from-emerald-950/80 to-emerald-900/60 border border-dashed border-emerald-600/40 shadow-none opacity-60 filter saturate-75 cursor-default';
    } else {
      // Bright green for connected Player 1 territory
      visualClasses +=
        ' bg-gradient-to-br from-emerald-500/90 to-emerald-700/90 border border-emerald-400/80 shadow-[0_0_12px_rgba(16,185,129,0.35),inset_0_1px_2px_rgba(255,255,255,0.25)] cursor-default';
    }
  } else if (owner === 'player2') {
    // Player 2 Territory
    if (isSelected) {
      visualClasses +=
        ' bg-gradient-to-br from-rose-600 to-rose-800 border-2 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.7)] z-20 cursor-pointer scale-[1.03]';
    } else if (isChallengeable) {
      // Orthogonally adjacent enemy cell that Player 1 can challenge from connected territory
      visualClasses +=
        ' bg-gradient-to-br from-rose-500/90 to-rose-700/90 border border-rose-400/80 hover:border-yellow-400 hover:shadow-[0_0_18px_rgba(250,204,21,0.5)] hover:scale-[1.02] cursor-pointer group';
    } else if (isIsolated) {
      // Dimmed rose for isolated Player 2 territory
      visualClasses +=
        ' bg-gradient-to-br from-rose-950/80 to-rose-900/60 border border-dashed border-rose-600/40 shadow-none opacity-60 filter saturate-75 cursor-default';
    } else {
      // Bright rose for connected Player 2 territory
      visualClasses +=
        ' bg-gradient-to-br from-rose-500/90 to-rose-700/90 border border-rose-400/80 cursor-default';
      if (isRecentlyCaptured) {
        visualClasses +=
          ' shadow-[0_0_22px_rgba(244,63,94,0.7),inset_0_1px_2px_rgba(255,255,255,0.4)] scale-[1.04] transition-transform duration-300';
      } else {
        visualClasses +=
          ' shadow-[0_0_12px_rgba(244,63,94,0.35),inset_0_1px_2px_rgba(255,255,255,0.25)]';
      }
    }
  } else {
    // Empty Cell: Neutral / Dark Appearance
    if (isSelected) {
      // Selected valid empty cell
      visualClasses +=
        ' bg-emerald-950/70 border-2 border-yellow-400 shadow-[0_0_18px_rgba(250,204,21,0.6)] z-20 cursor-pointer scale-[1.03]';
    } else if (isInteractable) {
      // Valid adjacent empty cell ready to be captured (adjacent to connected territory)
      visualClasses +=
        ' bg-zinc-900/85 border border-emerald-500/35 hover:border-emerald-400 hover:bg-emerald-950/45 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:scale-[1.02] cursor-pointer group';
    } else {
      // Inactive empty cell
      visualClasses +=
        ' bg-zinc-950/80 border border-zinc-800/70 cursor-default opacity-75';
    }
  }

  const tooltipTitle = isBase
    ? `${owner === 'player1' ? 'PLAYER 1' : 'PLAYER 2'} BASE HQ — Capture to win immediately!`
    : isIsolated
    ? 'ISOLATED — reconnect to base to activate'
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
      {/* Base Distinction: P1 BASE / P2 BASE */}
      {isBase ? (
        <div className="flex flex-col items-center justify-center leading-none pointer-events-none">
          <span className="text-[9px] sm:text-[10px] font-black tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
            {owner === 'player1' ? 'P1' : 'P2'}
          </span>
          <span className="text-[7px] sm:text-[8px] font-mono font-black uppercase tracking-wider text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] mt-0.5">
            BASE
          </span>
        </div>
      ) : (
        <>
          {owner === 'player1' && (
            <span
              className={`text-[10px] sm:text-xs font-black tracking-wider ${
                isIsolated
                  ? 'text-emerald-400/70 font-semibold'
                  : 'text-emerald-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
              }`}
            >
              P1
            </span>
          )}

          {owner === 'player2' && (
            <span
              className={`text-[10px] sm:text-xs font-black tracking-wider ${
                isIsolated
                  ? 'text-rose-400/70 font-semibold'
                  : 'text-rose-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
              }`}
            >
              P2
            </span>
          )}
        </>
      )}

      {/* Subtle gold border accent on permanent bases */}
      {isBase && (
        <span className="absolute inset-0 rounded-lg sm:rounded-xl border border-amber-400/40 pointer-events-none" />
      )}

      {/* Subtle indicator for challengeable enemy cell / base */}
      {owner === 'player2' && isChallengeable && !isSelected && !isContested && (
        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-yellow-400/80 group-hover:scale-150 transition-all duration-200 pointer-events-none" />
      )}

      {/* Subtle affordance for interactable empty cell */}
      {owner === null && isInteractable && !isSelected && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 group-hover:bg-emerald-400 group-hover:scale-150 transition-all duration-200 pointer-events-none" />
      )}

      {/* Popover anchor */}
      {children}
    </div>
  );
};
