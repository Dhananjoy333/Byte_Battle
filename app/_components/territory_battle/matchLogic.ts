import { CellOwner } from './types';

export type MatchStatus = 'playing' | 'finished';
export type MatchResult = 'p1-win' | 'p2-win' | 'draw' | null;
export type MatchEndReason = 'base-captured' | 'time-expired' | null;

export interface MatchState {
  status: MatchStatus;
  result: MatchResult;
  reason: MatchEndReason;
  winner: CellOwner | 'draw' | null;
  p1CellCount: number;
  p2CellCount: number;
  capturedBase?: 'player1' | 'player2' | null;
}

export const INITIAL_MATCH_STATE: MatchState = {
  status: 'playing',
  result: null,
  reason: null,
  winner: null,
  p1CellCount: 1,
  p2CellCount: 1,
  capturedBase: null,
};

/**
 * Formats a duration in seconds into MM:SS format.
 * Example: 102 seconds -> "01:42"
 */
export function formatMatchTime(seconds: number): string {
  const clamped = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
