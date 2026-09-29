export { GameBoard } from './GameBoard';
export { Cell } from './Cell';
export { CapturePopover } from './CapturePopover';
export { ChallengePopover } from './ChallengePopover';
export { ChallengePrompt } from './ChallengePrompt';
export { CellDuelModal } from './CellDuelModal';
export { GameOverModal } from './GameOverModal';
export { QuestionModal } from './QuestionModal';
export { QuestionCard } from './QuestionCard';
export { useQuestionSession } from './useQuestionSession';
export { useAITerritoryExpansion } from './useAITerritoryExpansion';
export { useCellDuel } from './useCellDuel';
export { useMatchTimer } from './useMatchTimer';
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
} from './territoryLogic';
export type { BaseLocation } from './territoryLogic';
export * from './types';
export * from './duelLogic';
export * from './matchLogic';
export * from './data/questions';
