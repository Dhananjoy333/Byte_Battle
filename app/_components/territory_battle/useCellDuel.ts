'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Cell, CellOwner } from './types';
import {
  ConflictState,
  INITIAL_CONFLICT_STATE,
  getRandomDuelQuestion,
  resolveCellOwnershipAfterDuel,
} from './duelLogic';
import {
  AI_ACCEPT_CHALLENGE_PROBABILITY,
  AI_CORRECT_ANSWER_PROBABILITY,
  DUEL_DURATION,
  PLAYER_CHALLENGE_COST,
  AI_REJECTION_REFUND,
  P1_BASE,
  P2_BASE,
} from './territoryLogic';

interface UseCellDuelOptions {
  board: Cell[];
  setBoard: React.Dispatch<React.SetStateAction<Cell[]>>;
  bankedBits: number;
  setBankedBits: React.Dispatch<React.SetStateAction<number>>;
  onBaseCaptured?: (winner: CellOwner) => void;
}

export function useCellDuel({
  board,
  setBoard,
  bankedBits,
  setBankedBits,
  onBaseCaptured,
}: UseCellDuelOptions) {
  const [conflictState, setConflictState] = useState<ConflictState>(INITIAL_CONFLICT_STATE);
  const [duelTimeLeft, setDuelTimeLeft] = useState<number>(DUEL_DURATION / 1000);

  // Synchronization and concurrency guards
  const resolvedRef = useRef<boolean>(false);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const onBaseCapturedRef = useRef(onBaseCaptured);
  onBaseCapturedRef.current = onBaseCaptured;

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }, []);

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  // Finish conflict and return to idle state
  const finishConflict = useCallback(() => {
    clearAllTimers();
    resolvedRef.current = false;
    setConflictState(INITIAL_CONFLICT_STATE);
  }, [clearAllTimers]);

  // Immediately cancel conflict without finishing duel or transferring cell (e.g. match timer expires)
  const cancelCurrentConflict = useCallback(() => {
    clearAllTimers();
    resolvedRef.current = true;
    setConflictState(INITIAL_CONFLICT_STATE);
  }, [clearAllTimers]);

  // Helper to check if a specific cell is a player's base HQ
  const isBaseCell = useCallback((cell: Cell, base: typeof P1_BASE) => {
    return cell.row === base.row && cell.col === base.col;
  }, []);

  // Internal resolution handler for duel winner
  const resolveDuel = useCallback(
    (winner: CellOwner, reason: string, currentTargetCell: Cell) => {
      if (resolvedRef.current) return;
      resolvedRef.current = true;
      clearAllTimers();

      // Update territory board ownership once
      setBoard((prev) => resolveCellOwnershipAfterDuel(prev, currentTargetCell.id, winner));

      // Check if winning this cell captures enemy base HQ
      const isCapturingP2Base = winner === 'player1' && isBaseCell(currentTargetCell, P2_BASE);
      const isCapturingP1Base = winner === 'player2' && isBaseCell(currentTargetCell, P1_BASE);

      if (isCapturingP2Base || isCapturingP1Base) {
        // Base captured! End conflict and trigger immediate match victory
        finishConflict();
        if (onBaseCapturedRef.current) {
          onBaseCapturedRef.current(winner);
        }
        return;
      }

      setConflictState((prev) => ({
        ...prev,
        phase: 'duel-resolved',
        winner,
        resolutionReason: reason,
        aiStatus: winner === 'player2' ? 'correct' : prev.aiStatus,
      }));
    },
    [clearAllTimers, setBoard, isBaseCell, finishConflict]
  );

  // Helper to start the live 10-second question duel
  const startLiveDuel = useCallback(
    (targetCell: Cell, attacker: CellOwner, defender: CellOwner) => {
      clearAllTimers();
      resolvedRef.current = false;
      const question = getRandomDuelQuestion();

      // Pre-determine AI response outcome and latency
      const aiWillAnswerCorrect = Math.random() < AI_CORRECT_ANSWER_PROBABILITY;
      // Latency between 2.5s and 7.5s within the 10s duel window
      const aiResponseDelayMs = Math.round(2500 + Math.random() * 5000);

      setDuelTimeLeft(DUEL_DURATION / 1000);
      setConflictState({
        phase: 'dueling',
        cell: targetCell,
        attacker,
        defender,
        duelQuestion: question,
        aiWillAnswerCorrect,
        aiResponseDelayMs,
        aiStatus: 'thinking',
        p1Answer: null,
        winner: null,
        resolutionReason: '',
      });

      // 1. Countdown timer (1s ticks)
      let secondsLeft = DUEL_DURATION / 1000;
      const countdownInterval = setInterval(() => {
        secondsLeft -= 1;
        setDuelTimeLeft(secondsLeft);

        if (secondsLeft <= 0) {
          clearInterval(countdownInterval);
          if (!resolvedRef.current) {
            resolveDuel('player2', 'Time expired! Opponent wins by default.', targetCell);
          }
        }
      }, 1000);
      timersRef.current.push(countdownInterval);

      // 2. AI simulated response timer
      const aiTimeout = setTimeout(() => {
        if (resolvedRef.current) return;

        if (aiWillAnswerCorrect) {
          // AI solved the question first
          resolveDuel('player2', 'Opponent solved the question first!', targetCell);
        } else {
          // AI answered incorrectly; duel continues for Player 1
          setConflictState((prev) => ({
            ...prev,
            aiStatus: 'wrong',
          }));
        }
      }, aiResponseDelayMs);
      timersRef.current.push(aiTimeout);
    },
    [clearAllTimers, resolveDuel]
  );

  // =========================================================================
  // Player 1 Initiates Challenge against P2 cell
  // =========================================================================
  const startPlayerChallenge = useCallback(
    (targetCell: Cell) => {
      if (conflictState.phase !== 'idle') return;
      if (bankedBits < PLAYER_CHALLENGE_COST) return;

      // Deduct 2 Bits
      setBankedBits((prev) => prev - PLAYER_CHALLENGE_COST);
      clearAllTimers();

      setConflictState({
        ...INITIAL_CONFLICT_STATE,
        phase: 'waiting-for-ai',
        cell: targetCell,
        attacker: 'player1',
        defender: 'player2',
      });

      // AI decision delay (1.5 seconds)
      const aiDecisionTimeout = setTimeout(() => {
        const aiAccepts = Math.random() < AI_ACCEPT_CHALLENGE_PROBABILITY;

        if (aiAccepts) {
          // AI accepts challenge -> Begin Duel (no refund)
          startLiveDuel(targetCell, 'player1', 'player2');
        } else {
          // AI rejects challenge -> P1 wins cell, refund 1 Bit
          setBoard((prev) => resolveCellOwnershipAfterDuel(prev, targetCell.id, 'player1'));
          setBankedBits((prev) => prev + AI_REJECTION_REFUND);

          // If AI rejected challenge against its own base, P1 wins match immediately!
          if (isBaseCell(targetCell, P2_BASE)) {
            finishConflict();
            if (onBaseCapturedRef.current) {
              onBaseCapturedRef.current('player1');
            }
            return;
          }

          setConflictState((prev) => ({
            ...prev,
            phase: 'ai-rejected',
          }));
        }
      }, 1500);

      timersRef.current.push(aiDecisionTimeout);
    },
    [conflictState.phase, bankedBits, setBankedBits, clearAllTimers, startLiveDuel, setBoard, isBaseCell, finishConflict]
  );

  // =========================================================================
  // AI Initiates Challenge against P1 cell
  // =========================================================================
  const triggerAIChallenge = useCallback(
    (targetCell: Cell) => {
      if (conflictState.phase !== 'idle') return;
      clearAllTimers();

      setConflictState({
        ...INITIAL_CONFLICT_STATE,
        phase: 'ai-challenge-request',
        cell: targetCell,
        attacker: 'player2',
        defender: 'player1',
      });
    },
    [conflictState.phase, clearAllTimers]
  );

  // Player 1 Rejects AI challenge
  const rejectAIChallenge = useCallback(() => {
    if (conflictState.phase !== 'ai-challenge-request' || !conflictState.cell) return;
    const targetCell = conflictState.cell;

    // Surrender cell to Player 2
    setBoard((prev) => resolveCellOwnershipAfterDuel(prev, targetCell.id, 'player2'));

    // If P1 surrendered own base, P2 wins match immediately!
    if (isBaseCell(targetCell, P1_BASE)) {
      finishConflict();
      if (onBaseCapturedRef.current) {
        onBaseCapturedRef.current('player2');
      }
      return;
    }

    setConflictState((prev) => ({
      ...prev,
      phase: 'player-rejected',
    }));
  }, [conflictState, setBoard, isBaseCell, finishConflict]);

  // Player 1 Accepts AI challenge
  const acceptAIChallenge = useCallback(() => {
    if (conflictState.phase !== 'ai-challenge-request' || !conflictState.cell) return;
    startLiveDuel(conflictState.cell, 'player2', 'player1');
  }, [conflictState, startLiveDuel]);

  // =========================================================================
  // Player 1 Answers the Duel Question
  // =========================================================================
  const handlePlayerAnswer = useCallback(
    (key: 'A' | 'B' | 'C' | 'D') => {
      if (
        conflictState.phase !== 'dueling' ||
        !conflictState.duelQuestion ||
        !conflictState.cell ||
        resolvedRef.current
      ) {
        return;
      }

      setConflictState((prev) => ({ ...prev, p1Answer: key }));
      const isCorrect = key === conflictState.duelQuestion.correctAnswer;

      if (isCorrect) {
        // Player 1 answered correctly first -> Player 1 wins!
        resolveDuel('player1', 'You answered correctly first!', conflictState.cell);
      } else {
        // Player 1 answered wrong -> AI wins immediately!
        resolveDuel('player2', 'Incorrect answer! Opponent takes the cell.', conflictState.cell);
      }
    },
    [conflictState, resolveDuel]
  );

  return {
    conflictState,
    duelTimeLeft,
    isConflictActive: conflictState.phase !== 'idle',
    startPlayerChallenge,
    triggerAIChallenge,
    acceptAIChallenge,
    rejectAIChallenge,
    handlePlayerAnswer,
    finishConflict,
    cancelCurrentConflict,
  };
}
