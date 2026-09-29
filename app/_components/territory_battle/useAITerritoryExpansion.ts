'use client';

import { useEffect, useRef } from 'react';
import { Cell } from './types';
import {
  performAIExpansion,
  getChallengeableEnemyCells,
  getValidExpansionCells,
  chooseRandomCell,
  AI_CAPTURE_INTERVAL,
  AI_CHALLENGE_PROBABILITY,
} from './territoryLogic';

interface UseAITerritoryExpansionOptions {
  board: Cell[];
  setBoard: React.Dispatch<React.SetStateAction<Cell[]>>;
  isEnabled?: boolean;
  isPaused?: boolean;
  intervalMs?: number;
  onAICaptured?: (cell: Cell) => void;
  onAIInitiateChallenge?: (cell: Cell) => void;
}

/**
 * Custom hook to run autonomous Player 2 AI territory actions (expansion & challenges).
 *
 * Rules:
 * - Automatically PAUSES during any active conflict/duel phase.
 * - When resumed after a duel, cleanly restarts the 5-second interval with zero accumulated ticks.
 * - Chooses between empty expansion and challenging adjacent Player 1 cells using AI_CHALLENGE_PROBABILITY.
 */
export function useAITerritoryExpansion({
  board,
  setBoard,
  isEnabled = true,
  isPaused = false,
  intervalMs = AI_CAPTURE_INTERVAL,
  onAICaptured,
  onAIInitiateChallenge,
}: UseAITerritoryExpansionOptions) {
  const onAICapturedRef = useRef(onAICaptured);
  onAICapturedRef.current = onAICaptured;

  const onAIInitiateChallengeRef = useRef(onAIInitiateChallenge);
  onAIInitiateChallengeRef.current = onAIInitiateChallenge;

  useEffect(() => {
    // If disabled or paused during challenge/duel, timer is stopped
    if (!isEnabled || isPaused) {
      return;
    }

    const timer = setInterval(() => {
      setBoard((currentBoard) => {
        // 1. Check for challenge opportunities against adjacent Player 1 cells
        const adjacentP1Cells = getChallengeableEnemyCells(currentBoard, 'player2');
        const emptyCandidates = getValidExpansionCells(currentBoard, 'player2');

        const canChallenge = adjacentP1Cells.length > 0;
        const canExpand = emptyCandidates.length > 0;

        if (!canChallenge && !canExpand) {
          return currentBoard;
        }

        // Decide whether to initiate a challenge against Player 1
        const shouldChallenge =
          canChallenge &&
          (!canExpand || Math.random() < AI_CHALLENGE_PROBABILITY);

        if (shouldChallenge) {
          const targetP1Cell = chooseRandomCell(adjacentP1Cells);
          if (targetP1Cell && onAIInitiateChallengeRef.current) {
            // Trigger challenge against Player 1 cell
            onAIInitiateChallengeRef.current(targetP1Cell);
          }
          return currentBoard;
        }

        // Otherwise perform normal autonomous expansion into an empty cell
        const { updatedBoard, capturedCell } = performAIExpansion(
          currentBoard,
          'player2'
        );

        if (capturedCell && onAICapturedRef.current) {
          onAICapturedRef.current(capturedCell);
        }

        return updatedBoard;
      });
    }, intervalMs);

    return () => {
      clearInterval(timer);
    };
  }, [isEnabled, isPaused, intervalMs, setBoard]);
}
