export { GameBoard } from './GameBoard';
export { Cell } from './Cell';
export { CapturePopover } from './CapturePopover';
export { ChallengePopover } from './ChallengePopover';
export { ChallengePrompt } from './ChallengePrompt';
export { CellDuelModal } from './CellDuelModal';
export { GameOverModal } from './GameOverModal';
export { QuestionModal } from './QuestionModal';
export { QuestionCard } from './QuestionCard';
export { useQuestionSession } from './hooks/useQuestionSession';
export { useAITerritoryExpansion } from './hooks/useAITerritoryExpansion';
export { useCellDuel } from './hooks/useCellDuel';
export { useMatchTimer } from './hooks/useMatchTimer';
export { TERRITORY_QUESTIONS } from './data/questions';
export {
  canCaptureCell,
  canChallengeCell,
  getChallengeableEnemyCells,
  createInitialBoard,
  getOrthogonalAdjacentCells,
  getValidExpansionCells,
  chooseRandomCell,
  performAIExpansion,
  getConnectedTerritory,
  isConnectedToBase,
  getBaseLocation,
  checkBaseCapture,
  getTerritoryCounts,
  determineTimedResult,
  P1_BASE,
  P2_BASE,
  BOARD_SIZE,
  GRID_SIZE,
  MATCH_DURATION,
  AI_CAPTURE_INTERVAL,
  AI_ACCEPT_CHALLENGE_PROBABILITY,
  AI_CORRECT_ANSWER_PROBABILITY,
  DUEL_DURATION,
  PLAYER_CHALLENGE_COST,
  AI_REJECTION_REFUND,
  AI_CHALLENGE_PROBABILITY,
} from './logic/territoryLogic';
export type { BaseLocation } from './logic/territoryLogic';
export * from './types';
export * from './logic/duelLogic';
export * from './logic/matchLogic';
export * from './data/questions';
