'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Cell as CellType, CellOwner } from './types';
import {
  BOARD_SIZE,
  MATCH_DURATION,
  createInitialBoard,
  canCaptureCell,
  canChallengeCell,
  getChallengeableEnemyCells,
  getConnectedTerritory,
  checkBaseCapture,
  getTerritoryCounts,
  determineTimedResult,
  P1_BASE,
  P2_BASE,
  AI_CAPTURE_INTERVAL,
  PLAYER_CHALLENGE_COST,
} from './territoryLogic';
import { MatchState, INITIAL_MATCH_STATE, formatMatchTime } from './matchLogic';
import { useMatchTimer } from './useMatchTimer';
import { Cell } from './Cell';
import { CapturePopover } from './CapturePopover';
import { ChallengePopover } from './ChallengePopover';
import { QuestionModal } from './QuestionModal';
import { ChallengePrompt } from './ChallengePrompt';
import { CellDuelModal } from './CellDuelModal';
import { GameOverModal } from './GameOverModal';
import { useAITerritoryExpansion } from './useAITerritoryExpansion';
import { useCellDuel } from './useCellDuel';
import { FiZap, FiClock } from 'react-icons/fi';

const CELL_CAPTURE_COST = 1;

export const GameBoard: React.FC = () => {
  const router = useRouter();

  // 1. Board state representing 64 cells (8x8)
  const [board, setBoard] = useState<CellType[]>(() => createInitialBoard(BOARD_SIZE));

  // 2. Banked bits (safe Bits that can be spent on territory actions)
  const [bankedBits, setBankedBits] = useState<number>(5);

  // 3. Track selected cell for capture/challenge popover
  const [selectedCellId, setSelectedCellId] = useState<string | null>(null);

  // 4. Question modal open/close state
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState<boolean>(false);

  // 5. Track last AI-captured cell ID for subtle highlight feedback
  const [lastAICapturedId, setLastAICapturedId] = useState<string | null>(null);

  // 6. Explicit match lifecycle & game-over state
  const [matchState, setMatchState] = useState<MatchState>(INITIAL_MATCH_STATE);

  const isGameFinished = matchState.status === 'finished';

  // Local user is currently player1
  const localPlayer: CellOwner = 'player1';

  // 7. Cell Duel & Conflict Management Hook
  const {
    conflictState,
    duelTimeLeft,
    isConflictActive,
    startPlayerChallenge,
    triggerAIChallenge,
    acceptAIChallenge,
    rejectAIChallenge,
    handlePlayerAnswer,
    finishConflict,
    cancelCurrentConflict,
  } = useCellDuel({
    board,
    setBoard,
    bankedBits,
    setBankedBits,
    onBaseCaptured: (winner) => {
      setBoard((currentBoard) => {
        const baseCheck = checkBaseCapture(currentBoard, BOARD_SIZE);
        finalizeMatch(
          winner === 'player1' ? 'p1-win' : 'p2-win',
          'base-captured',
          currentBoard,
          baseCheck.capturedBase ?? (winner === 'player1' ? 'player2' : 'player1')
        );
        return currentBoard;
      });
    },
  });

  // 8. Authoritative single-transition match resolution
  const finalizeMatch = useCallback(
    (
      result: 'p1-win' | 'p2-win' | 'draw',
      reason: 'base-captured' | 'time-expired',
      currentBoard: CellType[],
      capturedBase?: 'player1' | 'player2' | null
    ) => {
      setMatchState((prev) => {
        // Guard against race conditions: once finished, never overwrite!
        if (prev.status === 'finished') return prev;

        const { p1Cells, p2Cells } = getTerritoryCounts(currentBoard);
        const winner: CellOwner | 'draw' =
          result === 'p1-win' ? 'player1' : result === 'p2-win' ? 'player2' : 'draw';

        return {
          status: 'finished',
          result,
          reason,
          winner,
          p1CellCount: p1Cells,
          p2CellCount: p2Cells,
          capturedBase: capturedBase ?? null,
        };
      });

      // Freeze all gameplay interactions immediately
      cancelCurrentConflict();
      setIsQuestionModalOpen(false);
      setSelectedCellId(null);
    },
    [cancelCurrentConflict]
  );

  // 9. Match Timer Countdown & Low-Time urgency
  const handleMatchTimeExpired = useCallback(() => {
    setMatchState((prev) => {
      // If match was already finalized (e.g., base capture), do not overwrite
      if (prev.status === 'finished') return prev;

      // Rule: Main match timer has priority over active Cell Duel
      // Immediately cancel any active duel without transferring cell or refunding
      cancelCurrentConflict();
      setIsQuestionModalOpen(false);
      setSelectedCellId(null);

      // Check if a base was captured at the exact moment
      const baseCheck = checkBaseCapture(board, BOARD_SIZE);
      if (baseCheck.isCaptured && baseCheck.winner) {
        const { p1Cells, p2Cells } = getTerritoryCounts(board);
        return {
          status: 'finished',
          result: baseCheck.winner === 'player1' ? 'p1-win' : 'p2-win',
          reason: 'base-captured',
          winner: baseCheck.winner,
          p1CellCount: p1Cells,
          p2CellCount: p2Cells,
          capturedBase: baseCheck.capturedBase,
        };
      }

      // Final territory count comparison (ownership across all cells)
      const { p1Cells, p2Cells } = getTerritoryCounts(board);
      const { result, winner } = determineTimedResult(p1Cells, p2Cells);

      return {
        status: 'finished',
        result,
        reason: 'time-expired',
        winner,
        p1CellCount: p1Cells,
        p2CellCount: p2Cells,
        capturedBase: null,
      };
    });

    cancelCurrentConflict();
    setIsQuestionModalOpen(false);
    setSelectedCellId(null);
  }, [board, cancelCurrentConflict]);

  const { remainingSeconds, resetTimer } = useMatchTimer({
    duration: MATCH_DURATION,
    isRunning: matchState.status === 'playing',
    onTimeExpired: handleMatchTimeExpired,
  });

  // Base capture listener reacting immediately to board updates
  useEffect(() => {
    if (matchState.status === 'finished') return;
    const baseCheck = checkBaseCapture(board, BOARD_SIZE);
    if (baseCheck.isCaptured && baseCheck.winner) {
      finalizeMatch(
        baseCheck.winner === 'player1' ? 'p1-win' : 'p2-win',
        'base-captured',
        board,
        baseCheck.capturedBase
      );
    }
  }, [board, matchState.status, finalizeMatch]);

  // 10. Derive connected territory sets from base nodes (BFS)
  const connectedP1CellIds = useMemo(
    () => getConnectedTerritory(board, 'player1', P1_BASE, BOARD_SIZE),
    [board]
  );
  const connectedP2CellIds = useMemo(
    () => getConnectedTerritory(board, 'player2', P2_BASE, BOARD_SIZE),
    [board]
  );

  // 11. Autonomous Player 2 AI territory expansion
  // MUST PAUSE during conflict/duel AND completely stop when match ends
  useAITerritoryExpansion({
    board,
    setBoard,
    isEnabled: matchState.status === 'playing',
    isPaused: isConflictActive || isGameFinished,
    intervalMs: AI_CAPTURE_INTERVAL,
    onAICaptured: (capturedCell) => {
      if (isGameFinished) return;
      setSelectedCellId((currentSelected) =>
        currentSelected === capturedCell.id ? null : currentSelected
      );
      setLastAICapturedId(capturedCell.id);
      setTimeout(() => {
        setLastAICapturedId(null);
      }, 1500);
    },
    onAIInitiateChallenge: (targetP1Cell) => {
      if (isGameFinished) return;
      setSelectedCellId(null);
      triggerAIChallenge(targetP1Cell);
    },
  });

  // 12. Interactable empty cell IDs for Player 1
  const interactableCellIds = useMemo(() => {
    if (isConflictActive || isGameFinished) return new Set<string>();
    const set = new Set<string>();
    for (const cell of board) {
      if (canCaptureCell(board, cell, localPlayer, connectedP1CellIds, BOARD_SIZE)) {
        set.add(cell.id);
      }
    }
    return set;
  }, [board, localPlayer, isConflictActive, isGameFinished, connectedP1CellIds]);

  // 13. Challengeable enemy cell IDs for Player 1 (including enemy base HQ!)
  const challengeableEnemyCellIds = useMemo(() => {
    if (isConflictActive || isGameFinished) return new Set<string>();
    const enemyCells = getChallengeableEnemyCells(
      board,
      localPlayer,
      connectedP1CellIds,
      BOARD_SIZE
    );
    return new Set<string>(enemyCells.map((c) => c.id));
  }, [board, localPlayer, isConflictActive, isGameFinished, connectedP1CellIds]);

  // Territories count (all owned cells)
  const { p1Cells: player1Count, p2Cells: player2Count } = useMemo(
    () => getTerritoryCounts(board),
    [board]
  );

  // Cell click handler for Player 1
  const handleCellClick = useCallback(
    (cell: CellType) => {
      if (isConflictActive || isGameFinished) {
        return;
      }

      // 1. If clicking an interactable EMPTY cell (connected adjacency required)
      if (cell.owner === null) {
        if (!canCaptureCell(board, cell, localPlayer, connectedP1CellIds, BOARD_SIZE)) return;
        setSelectedCellId((prev) => (prev === cell.id ? null : cell.id));
        return;
      }

      // 2. If clicking an adjacent ENEMY cell (including enemy base HQ!)
      if (cell.owner === 'player2') {
        if (!canChallengeCell(board, cell, localPlayer, connectedP1CellIds, BOARD_SIZE)) return;
        setSelectedCellId((prev) => (prev === cell.id ? null : cell.id));
        return;
      }
    },
    [board, localPlayer, isConflictActive, isGameFinished, connectedP1CellIds]
  );

  // Empty cell capture action
  const handleCaptureEmpty = useCallback(() => {
    if (!selectedCellId || isConflictActive || isGameFinished) return;

    if (bankedBits < CELL_CAPTURE_COST) {
      return;
    }

    setBoard((prevBoard) =>
      prevBoard.map((c) =>
        c.id === selectedCellId ? { ...c, owner: localPlayer } : c
      )
    );

    setBankedBits((prev) => prev - CELL_CAPTURE_COST);
    setSelectedCellId(null);
  }, [selectedCellId, bankedBits, localPlayer, isConflictActive, isGameFinished]);

  // Challenge enemy cell action
  const handleChallengeEnemy = useCallback(() => {
    if (!selectedCellId || isConflictActive || isGameFinished) return;
    const targetCell = board.find((c) => c.id === selectedCellId);
    if (!targetCell) return;

    setSelectedCellId(null);
    startPlayerChallenge(targetCell);
  }, [selectedCellId, isConflictActive, isGameFinished, board, startPlayerChallenge]);

  // Cancel popover action
  const handleCancelPopover = useCallback(() => {
    setSelectedCellId(null);
  }, []);

  // Banking reward from question session: bankedBits += unbankedBits
  const handleBankBits = useCallback(
    (earnedBits: number) => {
      if (isGameFinished) return;
      setBankedBits((prev) => prev + earnedBits);
      setIsQuestionModalOpen(false);
    },
    [isGameFinished]
  );

  // Play Again: In-memory complete reset
  const handlePlayAgain = useCallback(() => {
    cancelCurrentConflict();
    const initial = createInitialBoard(BOARD_SIZE);
    setBoard(initial);
    setBankedBits(5);
    setSelectedCellId(null);
    setIsQuestionModalOpen(false);
    setLastAICapturedId(null);
    resetTimer(MATCH_DURATION);
    setMatchState(INITIAL_MATCH_STATE);
  }, [cancelCurrentConflict, resetTimer]);

  // Exit: Navigate to character selection / roster
  const handleExit = useCallback(() => {
    router.push('/char_selection');
  }, [router]);

  const selectedCell = useMemo(
    () => board.find((c) => c.id === selectedCellId),
    [board, selectedCellId]
  );

  // Low-time visual feedback: <=30s amber highlight, <=10s urgent pulse
  const isLowTime = remainingSeconds <= 30;
  const isCriticalTime = remainingSeconds <= 10;

  const timerCardClasses = isCriticalTime
    ? 'border-rose-500/80 bg-rose-950/60 shadow-[0_0_20px_rgba(244,63,94,0.45)] text-rose-300 animate-pulse'
    : isLowTime
    ? 'border-amber-500/50 bg-amber-950/40 shadow-[0_0_15px_rgba(245,158,11,0.25)] text-amber-300'
    : 'border-zinc-800 bg-zinc-900/80 text-zinc-200';

  const timerClockColor = isCriticalTime
    ? 'text-rose-400'
    : isLowTime
    ? 'text-amber-400'
    : 'text-zinc-400';

  return (
    <div className="flex flex-col items-center w-full max-w-2xl px-3 sm:px-4 py-3 select-none">
      {/* Prominent Match Countdown Timer Bar */}
      <div className="w-full max-w-[min(92vw,560px)] flex items-center justify-center mb-3">
        <div
          className={`flex items-center gap-2.5 px-5 sm:px-7 py-1.5 sm:py-2 rounded-2xl border backdrop-blur-md transition-all duration-300 ${timerCardClasses}`}
        >
          <FiClock className={`size-4 sm:size-5 ${timerClockColor}`} />
          <div className="flex flex-col items-center leading-none">
            <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-[0.2em] opacity-80">
              Match Time
            </span>
            <span className="text-xl sm:text-2xl font-mono font-black tracking-widest mt-0.5">
              {formatMatchTime(remainingSeconds)}
            </span>
          </div>
        </div>
      </div>

      {/* Top Telemetry / Status Bar */}
      <div className="w-full max-w-[min(92vw,560px)] flex items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
        {/* Player 1 Stats */}
        <div className="flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-zinc-900/80 border border-emerald-500/30 backdrop-blur-md">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <div className="flex flex-col leading-tight">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-emerald-400">
              Player 1 (You)
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xs sm:text-sm font-extrabold text-zinc-100">
                {player1Count} Cells
              </span>
              {player1Count !== connectedP1CellIds.size && (
                <span className="text-[9px] font-mono font-bold text-emerald-400/80">
                  ({connectedP1CellIds.size} active)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Banked Bits Display */}
        <div className="flex flex-col items-center px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl bg-zinc-900/90 border border-yellow-400/40 shadow-[0_0_20px_rgba(250,204,21,0.15)] backdrop-blur-md">
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-400/90">
            Banked
          </span>
          <span className="text-base sm:text-xl font-black text-yellow-300 tracking-wider">
            BITS: {bankedBits}
          </span>
        </div>

        {/* Player 2 Stats + AI ACTIVE / PAUSED / GAME OVER Indicator */}
        <div className="flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-zinc-900/80 border border-rose-500/30 backdrop-blur-md">
          <div className="flex flex-col items-end leading-tight">
            <div className="flex items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider border ${
                  isGameFinished
                    ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    : isConflictActive
                    ? 'bg-amber-950/80 text-amber-400 border-amber-500/40'
                    : 'bg-rose-950/80 text-rose-400 border-rose-500/30'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isGameFinished
                      ? 'bg-zinc-500'
                      : isConflictActive
                      ? 'bg-amber-400'
                      : 'bg-rose-400 animate-pulse'
                  }`}
                />
                {isGameFinished
                  ? 'FINISHED'
                  : isConflictActive
                  ? 'AI PAUSED'
                  : 'AI ACTIVE'}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-rose-400">
                Player 2
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              {player2Count !== connectedP2CellIds.size && (
                <span className="text-[9px] font-mono font-bold text-rose-400/80">
                  ({connectedP2CellIds.size} active)
                </span>
              )}
              <span className="text-xs sm:text-sm font-extrabold text-zinc-100">
                {player2Count} Cells
              </span>
            </div>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]" />
        </div>
      </div>

      {/* Answer Questions CTA Button above the territory grid */}
      <div className="w-full max-w-[min(92vw,560px)] flex justify-center mb-3 sm:mb-4">
        <button
          type="button"
          disabled={isConflictActive || isGameFinished}
          onClick={() => setIsQuestionModalOpen(true)}
          className={`group relative flex items-center justify-center gap-2 sm:gap-2.5 w-full py-2.5 sm:py-3 px-6 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 ${
            isConflictActive || isGameFinished
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
              : 'bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:via-yellow-300 hover:to-amber-400 active:scale-[0.98] text-zinc-950 shadow-[0_0_25px_rgba(250,204,21,0.35)] hover:shadow-[0_0_35px_rgba(250,204,21,0.6)] cursor-pointer'
          }`}
        >
          <FiZap className="size-4 shrink-0 transition-transform group-hover:scale-125 text-zinc-950" />
          <span>Answer Questions</span>
        </button>
      </div>

      {/* 8x8 Territory Game Board */}
      <div
        className="relative w-full max-w-[min(92vw,560px)] aspect-square p-2 sm:p-3 rounded-2xl sm:rounded-3xl bg-zinc-950/80 border border-zinc-800/90 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(20,20,35,0.4)] backdrop-blur-xl"
        role="grid"
        aria-label="8x8 Territory Grid"
      >
        <div className="grid grid-cols-8 gap-1 sm:gap-1.5 w-full h-full">
          {board.map((cell) => {
            const isInteractable = interactableCellIds.has(cell.id);
            const isChallengeable = challengeableEnemyCellIds.has(cell.id);
            const isSelected = selectedCellId === cell.id;
            const isRecentlyCaptured = lastAICapturedId === cell.id;
            const isContested = conflictState.cell?.id === cell.id;

            // Connectivity back to player's base node
            const isConnected =
              cell.owner === 'player1'
                ? connectedP1CellIds.has(cell.id)
                : cell.owner === 'player2'
                ? connectedP2CellIds.has(cell.id)
                : true;

            const isBase =
              (cell.row === P1_BASE.row && cell.col === P1_BASE.col) ||
              (cell.row === P2_BASE.row && cell.col === P2_BASE.col);

            return (
              <Cell
                key={cell.id}
                cell={cell}
                isInteractable={isInteractable}
                isChallengeable={isChallengeable}
                isSelected={isSelected}
                isRecentlyCaptured={isRecentlyCaptured}
                isContested={isContested}
                isConnected={isConnected}
                isBase={isBase}
                onClick={handleCellClick}
              >
                {/* Popovers anchored to selected cell */}
                {isSelected && selectedCell && !isGameFinished && (
                  <>
                    {/* Empty cell capture popover */}
                    {selectedCell.owner === null && (
                      <CapturePopover
                        row={selectedCell.row}
                        col={selectedCell.col}
                        bankedBits={bankedBits}
                        cost={CELL_CAPTURE_COST}
                        onCapture={handleCaptureEmpty}
                        onCancel={handleCancelPopover}
                      />
                    )}

                    {/* Adjacent enemy cell challenge popover */}
                    {selectedCell.owner === 'player2' && (
                      <ChallengePopover
                        row={selectedCell.row}
                        col={selectedCell.col}
                        bankedBits={bankedBits}
                        cost={PLAYER_CHALLENGE_COST}
                        onChallenge={handleChallengeEnemy}
                        onClose={handleCancelPopover}
                      />
                    )}
                  </>
                )}
              </Cell>
            );
          })}
        </div>
      </div>

      {/* Helper Caption */}
      <div className="mt-3.5 text-center">
        <p className="text-[11px] sm:text-xs text-zinc-500 tracking-wide">
          Green = You | Red = Opponent | Bases: (0,0) & (7,7) | Seizing opponent base wins immediately!
        </p>
      </div>

      {/* Regular Bit-Earning Question Modal */}
      <QuestionModal
        isOpen={isQuestionModalOpen && !isConflictActive && !isGameFinished}
        bankedBits={bankedBits}
        onBank={handleBankBits}
        onClose={() => setIsQuestionModalOpen(false)}
      />

      {/* Challenge Overlays (Waiting for AI / Challenge Request / Rejection Feedbacks) */}
      <ChallengePrompt
        phase={conflictState.phase}
        cell={conflictState.cell}
        onAcceptAIChallenge={acceptAIChallenge}
        onRejectAIChallenge={rejectAIChallenge}
        onDismissFeedback={finishConflict}
      />

      {/* Live 10-Second Cell Duel Modal */}
      <CellDuelModal
        isOpen={
          (conflictState.phase === 'dueling' || conflictState.phase === 'duel-resolved') &&
          !isGameFinished
        }
        cell={conflictState.cell}
        attacker={conflictState.attacker}
        defender={conflictState.defender}
        question={conflictState.duelQuestion}
        timeLeft={duelTimeLeft}
        aiStatus={conflictState.aiStatus}
        playerAnswer={conflictState.p1Answer}
        isResolved={conflictState.phase === 'duel-resolved'}
        winner={conflictState.winner}
        resolutionReason={conflictState.resolutionReason}
        onSelectOption={handlePlayerAnswer}
        onFinishDuel={finishConflict}
      />

      {/* Final Game Over Modal */}
      <GameOverModal
        isOpen={isGameFinished}
        matchState={matchState}
        onPlayAgain={handlePlayAgain}
        onExit={handleExit}
      />
    </div>
  );
};
