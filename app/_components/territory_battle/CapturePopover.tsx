'use client';

import React, { useEffect, useRef } from 'react';

interface CapturePopoverProps {
  row: number;
  col: number;
  bankedBits: number;
  cost?: number;
  onCapture: () => void;
  onCancel: () => void;
}

export const CapturePopover: React.FC<CapturePopoverProps> = ({
  row,
  col,
  bankedBits,
  cost = 1,
  onCapture,
  onCancel,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const canAfford = bankedBits >= cost;

  // Close on Escape key press or outside click
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Use timeout to avoid immediate trigger from the click that opened the popover
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      clearTimeout(timer);
    };
  }, [onCancel]);

  // Adaptive positioning so popover stays well within the board bounds
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
      className={`absolute ${verticalPositionClass} ${horizontalPositionClass} z-50 w-44 sm:w-48 p-3 rounded-xl bg-zinc-950/95 border border-emerald-500/50 shadow-[0_12px_30px_rgba(0,0,0,0.85),0_0_20px_rgba(16,185,129,0.25)] backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 select-none cursor-default`}
      role="dialog"
      aria-label="Capture Cell Confirmation"
    >
      {/* Header */}
      <h4 className="text-xs sm:text-sm font-bold text-zinc-100 text-center tracking-wide">
        Capture this cell?
      </h4>

      {/* Cost */}
      <div className="flex items-center justify-center gap-1.5 my-2">
        <span className="text-[11px] sm:text-xs text-zinc-400">Cost:</span>
        <span
          className={`text-xs sm:text-sm font-extrabold ${
            canAfford ? 'text-emerald-400' : 'text-rose-400'
          }`}
        >
          {cost} Bit{cost > 1 ? 's' : ''}
        </span>
      </div>

      {!canAfford && (
        <p className="text-[10px] text-rose-400 font-semibold text-center mb-2">
          Insufficient bits!
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-2 mt-1">
        <button
          type="button"
          disabled={!canAfford}
          onClick={onCapture}
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all ${
            canAfford
              ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_12px_rgba(16,185,129,0.45)] hover:shadow-[0_0_16px_rgba(16,185,129,0.65)] active:scale-95 cursor-pointer'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
          }`}
        >
          Capture
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80 hover:border-zinc-600 transition-all active:scale-95 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
