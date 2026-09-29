import { Cell, CellOwner } from './types';
import { TERRITORY_QUESTIONS, TerritoryQuestion } from './data/questions';

export type ConflictPhase =
  | 'idle'
  | 'waiting-for-ai' // P1 challenged P2, waiting for AI response (1-2s)
  | 'ai-rejected' // AI rejected P1 challenge (+1 refund, P1 wins cell)
  | 'ai-challenge-request' // AI challenged P1, waiting for P1 accept/reject
  | 'player-rejected' // P1 rejected AI challenge (P2 wins cell)
  | 'dueling' // Cell duel active
  | 'duel-resolved'; // Duel finished, showing victory/defeat

export interface ConflictState {
  phase: ConflictPhase;
  cell: Cell | null;
  attacker: CellOwner;
  defender: CellOwner;
  duelQuestion: TerritoryQuestion | null;
  aiWillAnswerCorrect: boolean;
  aiResponseDelayMs: number;
  aiStatus: 'thinking' | 'correct' | 'wrong';
  p1Answer: 'A' | 'B' | 'C' | 'D' | null;
  winner: CellOwner | null;
  resolutionReason: string;
}

export const INITIAL_CONFLICT_STATE: ConflictState = {
  phase: 'idle',
  cell: null,
  attacker: null,
  defender: null,
  duelQuestion: null,
  aiWillAnswerCorrect: false,
  aiResponseDelayMs: 0,
  aiStatus: 'thinking',
  p1Answer: null,
  winner: null,
  resolutionReason: '',
};

/**
 * Returns a random programming question from the existing pool for a Cell Duel.
 */
export function getRandomDuelQuestion(excludeId?: string): TerritoryQuestion {
  const pool = excludeId
    ? TERRITORY_QUESTIONS.filter((q) => q.id !== excludeId)
    : TERRITORY_QUESTIONS;
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

/**
 * Updates board ownership after a duel:
 * The winner of the duel is awarded the contested cell.
 */
export function resolveCellOwnershipAfterDuel(
  board: Cell[],
  cellId: string,
  winner: CellOwner
): Cell[] {
  if (!winner) return board;
  return board.map((cell) =>
    cell.id === cellId ? { ...cell, owner: winner } : cell
  );
}
