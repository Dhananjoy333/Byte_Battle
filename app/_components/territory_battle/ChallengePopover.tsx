'use client';

import React, { useEffect, useRef } from 'react';
import { PLAYER_CHALLENGE_COST } from './territoryLogic';

interface ChallengePopoverProps {
  row: number;
  col: number;
  bankedBits: number;
  cost?: number;
  onChallenge: () => void;
  onClose: () => void;
}

export const ChallengePopover: React.FC<ChallengePopoverProps> = ({
  row,
  col,
  bankedBits,
  cost = PLAYER_CHALLENGE_COST,
  onChallenge,
  onClose,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const canAfford = bankedBits >= cost;

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      clearTimeout(timer);
    };
  }, [onClose]);

  // Adaptive positioning to avoid clipping grid bounds
  const isTopRow = row <= 1;
  const isLeftCol = col <= 1;
  const isRightCol = col >= 5;

  let horizontalPositionClass = 'left-1/2 -translate-x-1/2';
  if (isLeftCol) {
    horizontalPositionClass = 'left-0';
  } else if (isRightCol) {
    horizontalPositionClass = 'right-0';
  }

  const verticalPositionClass = isTopRow
    ? 'top-[calc(100%+8px)]'
    : 'bottom-[calc(100%+8px)]';

  return (
    <div
      ref={popoverRef}
      onClick={(e) => e.stopPropagation()}
      className={`absolute ${verticalPositionClass} ${horizontalPositionClass} z-50 w-48 sm:w-52 p-3 rounded-xl bg-zinc-950/95 border border-rose-500/50 shadow-[0_12px_35px_rgba(0,0,0,0.85),0_0_20px_rgba(244,63,94,0.3)] backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 select-none cursor-default`}
      role="dialog"
      aria-label="Challenge Enemy Cell Confirmation"
    >
      {/* Header */}
      <h4 className="text-xs sm:text-sm font-bold text-zinc-100 text-center tracking-wide">
        Challenge this cell?
      </h4>

      {/* Cost */}
      <div className="flex items-center justify-center gap-1.5 my-2">
        <span className="text-[11px] sm:text-xs text-zinc-400">Cost:</span>
        <span
          className={`text-xs sm:text-sm font-extrabold ${
            canAfford ? 'text-yellow-400' : 'text-rose-400'
          }`}
        >
          {cost} Bits
        </span>
      </div>

      {!canAfford && (
        <p className="text-[10px] text-rose-400 font-semibold text-center mb-2">
          Insufficient Bits! Need {cost} Bits to challenge.
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-2 mt-1">
        <button
          type="button"
          disabled={!canAfford}
          onClick={onChallenge}
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
            canAfford
              ? 'bg-linear-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.45)] hover:shadow-[0_0_16px_rgba(244,63,94,0.65)] active:scale-95 cursor-pointer'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
          }`}
        >
          Challenge
        </button>

        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80 hover:border-zinc-600 transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
        >
          Close
        </button>
      </div>
    </div>
  );
};
