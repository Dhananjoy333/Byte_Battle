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
import { useGameStore } from '@/app/_store/useGameStore';
import { getCharacterById } from '@/app/_data/characters';
import Image from 'next/image';

const CELL_CAPTURE_COST = 1;

const IMAGEKIT_URL = process.env.NEXT_PUBLIC_IMAGEKIT_URL;


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

  // Character selection integration from store (with graceful fallback to Raze)
  const { selectedCharacterId } = useGameStore();
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const activeChar = getCharacterById(mounted && selectedCharacterId ? selectedCharacterId : 'raze');
  const playerCharImg = activeChar?.id && activeChar.id !== 'raze' 
    ? `/selec_char/${activeChar.id}.png` 
    : '/territory_img/raze.png';
  const playerCharName = activeChar?.hudName || 'RAZE';

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
      if (prev.status === 'finished') return prev;

      cancelCurrentConflict();
      setIsQuestionModalOpen(false);
      setSelectedCellId(null);

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

  // 13. Challengeable enemy cell IDs for Player 1
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

  // Territories count
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

      if (cell.owner === null) {
        if (!canCaptureCell(board, cell, localPlayer, connectedP1CellIds, BOARD_SIZE)) return;
        setSelectedCellId((prev) => (prev === cell.id ? null : cell.id));
        return;
      }

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

  // Banking reward from question session
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

  // Low-time visual urgency: <=30s amber highlight, <=10s urgent pulse
  const isLowTime = remainingSeconds <= 30;
  const isCriticalTime = remainingSeconds <= 10;

  return (
    <div className="flex flex-col items-center w-full select-none">
      {/* ============================================================== */}
      {/* Unified Gameplay Arena (Player HUD | Center Arena | Enemy HUD) */}
      {/* ============================================================== */}
      <div className="flex flex-row items-start justify-center gap-2 sm:gap-3 lg:gap-4 xl:gap-6 2xl:gap-0 w-full max-w-480 2xl:max-w-600 px-1 sm:px-2">
        {/* ============================================================ */}
        {/* LEFT COLUMN: Player 1 (You)                                   */}
        {/* Character Bust + Point Card + Answer Questions Button        */}
        {/* ============================================================ */}
        <div
          className="flex 2xl:translate-y-20 2xl:translate-x-25 flex-col items-center xl:items-end shrink-0"
          style={{ width: 'clamp(270px, 23vw, 460px)' }}
        >
          {/* Character Bust & Graffiti Tag */}
          <div className="flex items-end gap-1.5 sm:gap-2 relative -mb-4 sm:-mb-6 md:-mb-8 xl:-mb-10 z-10 w-full justify-center xl:justify-end ">
            {/* Player Bust Image */}
            <div
              className="relative shrink-0 overflow-visible"
              style={{
                width: 'clamp(130px, 12vw, 240px)',
                height: 'clamp(130px, 12vw, 240px)',
              }}
            >
              <div className="absolute inset-0 rounded-full bg-amber-400/25 blur-2xl pointer-events-none scale-125" />
              <Image
                src={playerCharImg}
                alt={playerCharName}
                fill
                className="w-full h-full object-contain object-bottom drop-shadow-[0_0_20px_rgba(250,204,21,0.7)] pointer-events-none scale-110 origin-bottom"
              />
            </div>

            {/* Stylized Graffiti Text */}
            <div className="mb-2 sm:mb-3 md:mb-15 select-none">
              <span className="font-black italic text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl text-yellow-300 tracking-tighter drop-shadow-[0_3px_6px_rgba(0,0,0,0.9),0_0_15px_rgba(250,204,21,0.8)] -rotate-6 block font-sans">
                {playerCharName}
              </span>
            </div>
          </div>

          {/* Player Point Card Frame using hero_point_card.png */}
          <div className="relative w-full 2xl:w-150 z-10 aspect-3244/1312 select-none shrink-0 drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]">
            <Image
              src={`${IMAGEKIT_URL}/territory_img/hero_point_card.png`}
              alt="Player HUD Card Frame"
              fill
              className="w-full h-full object-contain pointer-events-none select-none"
            />

            {/* Top Tab Overlay */}
            <div className="absolute top-[12%] left-[16%] right-[16%] flex items-center justify-center pointer-events-none">
              <span className="font-black text-[10px] sm:text-xs md:text-sm lg:text-base text-white uppercase tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                PLAYER (YOU)
              </span>
            </div>

            {/* Dynamic Cells Count */}
            <div className="absolute top-[34%] left-[47%] right-[6%] flex items-center pointer-events-none">
              <span className="font-black text-xs sm:text-sm md:text-base lg:text-lg 2xl:text-xl text-zinc-900 tracking-wide font-sans">
                {player1Count} Cells
              </span>
              {player1Count !== connectedP1CellIds.size && (
                <span className="ml-1 text-[9px] sm:text-[10px] md:text-xs font-mono font-bold text-emerald-600">
                  ({connectedP1CellIds.size} act)
                </span>
              )}
            </div>

            {/* Dynamic Bits Count (Clickable to open questions) */}
            <div className="absolute top-[59%] left-[47%] right-[6%] flex items-center">
              <button
                type="button"
                disabled={isConflictActive || isGameFinished}
                onClick={() => setIsQuestionModalOpen(true)}
                className={`flex items-center gap-1.5 font-black text-xs sm:text-sm md:text-base lg:text-lg 2xl:text-xl tracking-wide font-sans transition-all cursor-pointer ${
                  isConflictActive || isGameFinished
                    ? 'text-zinc-500 cursor-not-allowed'
                    : 'text-zinc-900 hover:text-amber-600 active:scale-95'
                }`}
                title="Earn more Bits"
              >
                <span>Bits: {bankedBits}</span>
                {!isGameFinished && (
                  <span className="text-[10px] sm:text-xs bg-yellow-400 hover:bg-yellow-300 text-zinc-950 px-1.5 py-0.5 rounded-md font-black shadow-xs">
                    +
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Answer Question Action Button (Positioned directly below Player Card) */}
          <div className="w-full flex justify-center mt-1 sm:mt-2 2xl:mt-3 2xl:mr-20">
            <button
              type="button"
              aria-label="Answer Question"
              disabled={isConflictActive || isGameFinished}
              onClick={() => setIsQuestionModalOpen(true)}
              className={`group relative aspect-2114/744 w-full max-w-67.5 sm:max-w-[320px] md:max-w-90 xl:max-w-100 2xl:max-w-[460px] flex items-center justify-center transition-all duration-150 ease-out select-none ${
                isConflictActive || isGameFinished
                  ? 'opacity-50 grayscale cursor-not-allowed pointer-events-none'
                  : 'cursor-pointer hover:scale-[1.03] hover:brightness-105 active:scale-[0.98] active:brightness-95 drop-shadow-[0_6px_16px_rgba(0,0,0,0.5)] hover:drop-shadow-[0_8px_22px_rgba(250,204,21,0.4)]'
              }`}
            >
              {/* Ornate Fantasy Game UI Button Frame Asset */}
              <Image
                src={`${IMAGEKIT_URL}/territory_img/button.png`}
                alt="Answer Question Button Frame"
                fill
                priority
                sizes="(max-width: 640px) 270px, (max-width: 1024px) 360px, 460px"
                className="w-full h-full object-contain pointer-events-none select-none"
              />

              {/* Centered Arcade Text inside Creamy Gold Center Area */}
              <span className="absolute inset-x-[15%] top-[56.8%] -translate-y-1/2 flex items-center justify-center font-zentry font-black text-xs sm:text-sm md:text-base lg:text-lg 2xl:text-xl tracking-wider uppercase text-[#0a1936] drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)] [text-shadow:0_1px_0_rgba(255,255,255,0.9),0_-1px_0_rgba(255,255,255,0.7),1px_0_0_rgba(255,255,255,0.8),-1px_0_0_rgba(255,255,255,0.8)] pointer-events-none select-none transition-transform duration-150">
                ANSWER QUESTION
              </span>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CENTER COLUMN: Arena (Logo -> Timer -> Large Board -> Caption) */}
        {/* ============================================================ */}
        <div className="flex flex-col items-center shrink-0">
          {/* Byte Battle Logo */}
          <div
            className="relative mb-0.5 sm:mb-1 select-none flex justify-center"
            style={{ width: 'clamp(220px, 22vw, 440px)' }}
          >
            <Image
              src={`${IMAGEKIT_URL}/territory_img/byte_battle_logo.png`}
              alt="Byte Battle - Territory Protocol"
              width={400}
              height={200}
              className="w-full h-auto object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.85)] pointer-events-none"
              priority
            />
          </div>

          {/* Match Timer HUD using timer_layout.png (Nestled directly above the Board) */}
          <div
            className="relative aspect-3974/1056 select-none shrink-0 drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)] flex items-center justify-center -mb-2 sm:-mb-3 md:-mb-4 z-20"
            style={{ width: 'clamp(240px, 21vw, 440px)' }}
          >
            <Image
              src={`${IMAGEKIT_URL}/territory_img/timer_layout.png`}
              alt="Match Timer Frame"
              fill
              className="w-full h-full object-contain pointer-events-none select-none"
            />

            {/* Top Plate Header */}
            <div className="absolute top-[10%] inset-x-0 flex items-center justify-center pointer-events-none">
              <span className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-black uppercase tracking-[0.2em] text-slate-800">
                TIME LEFT
              </span>
            </div>

            {/* Digital Timer Value */}
            <div className="absolute top-[30%] bottom-[12%] inset-x-[20%] flex items-center justify-center pointer-events-none">
              <span
                className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-mono font-black tracking-widest ${
                  isCriticalTime
                    ? 'text-rose-400 animate-pulse drop-shadow-[0_0_10px_rgba(244,63,94,0.9)]'
                    : isLowTime
                    ? 'text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.9)]'
                    : 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]'
                }`}
              >
                {formatMatchTime(remainingSeconds)}
              </span>
            </div>
          </div>

          {/* Center 7x7 Territory Grid inside Frame Bezel */}
          <div
            className="relative aspect-square flex items-center justify-center select-none"
            style={{
              width: 'clamp(420px, min(80vw, 63vh), 1020px)',
              height: 'clamp(420px, min(80vw, 63vh), 1020px)',
            }}
          >
            {/* Frame Image Overlay from /territory_img/grid_layout.png */}
            <Image
              src={`${IMAGEKIT_URL}/territory_img/grid_layout.png`}
              alt="Grid Frame Bezel"
              fill
              className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-[0_15px_40px_rgba(0,0,0,0.85)]"
              priority
            />

            {/* Inner Grid Area (fitted precisely within transparent window of grid_layout.png: 20.6% inset has 0% frame overlap in all 4 corners) */}
            <div className="absolute left-[20.6%] right-[20.6%] top-[20.5%] bottom-[20.5%] z-10 flex flex-col p-1.5 sm:p-2 md:p-2.5 bg-[#171f2f]/95 rounded-xl sm:rounded-2xl border border-white/10 shadow-[inset_0_2px_12px_rgba(0,0,0,0.9)] backdrop-blur-xs">
              {/* Column Coordinate Labels (0..6) - Horizontally synchronized with the 7 columns */}
              <div className="flex w-full mb-1 sm:mb-1.5 shrink-0">
                {/* Spacer exactly matching row coordinate column width + right margin */}
                <div className="w-3.5 sm:w-4.5 md:w-5.5 lg:w-6.5 shrink-0 mr-1 sm:mr-1.5" />

                {/* 7 Column Labels sharing identical grid tracks and gap as cell grid */}
                <div className="grid grid-cols-7 gap-1 sm:gap-1.5 md:gap-2 lg:gap-2.5 flex-1 items-center">
                  {Array.from({ length: BOARD_SIZE }).map((_, i) => (
                    <span
                      key={i}
                      className="text-center font-mono text-[10px] sm:text-xs md:text-sm font-extrabold text-slate-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] select-none"
                    >
                      {i}
                    </span>
                  ))}
                </div>
              </div>

              {/* Main Grid Area: Left Row Labels + 7x7 Cells Grid */}
              <div className="flex flex-1 w-full min-h-0">
                {/* Row Coordinate Labels (0..6) - Vertically synchronized with the 7 rows */}
                <div className="grid grid-rows-7 gap-1 sm:gap-1.5 md:gap-2 lg:gap-2.5 w-3.5 sm:w-4.5 md:w-5.5 lg:w-6.5 shrink-0 mr-1 sm:mr-1.5 items-center">
                  {Array.from({ length: BOARD_SIZE }).map((_, i) => (
                    <span
                      key={i}
                      className="flex items-center justify-center font-mono text-[10px] sm:text-xs md:text-sm font-extrabold text-slate-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] select-none"
                    >
                      {i}
                    </span>
                  ))}
                </div>

                {/* 7x7 Territory Grid of Cells */}
                <div className="grid grid-cols-7 grid-rows-7 gap-1 sm:gap-1.5 md:gap-2 lg:gap-2.5 flex-1 h-full w-full">
                  {board.map((cell) => {
                    const isInteractable = interactableCellIds.has(cell.id);
                    const isChallengeable = challengeableEnemyCellIds.has(cell.id);
                    const isSelected = selectedCellId === cell.id;
                    const isRecentlyCaptured = lastAICapturedId === cell.id;
                    const isContested = conflictState.cell?.id === cell.id;

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
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: Enemy (AI)                                     */}
        {/* Boss Avatar + Point Card                                     */}
        {/* ============================================================ */}
        <div
          className="flex flex-col 2xl:translate-y-20 2xl:-translate-x-20 items-center xl:items-start shrink-0"
          style={{ width: 'clamp(270px, 23vw, 460px)' }}
        >
          {/* Boss Bust & Graffiti Tag */}
          <div className="flex items-end gap-1.5 sm:gap-2 relative -mb-4 sm:-mb-6 md:-mb-8 xl:-mb-10 z-10 w-full justify-center xl:justify-start">
            {/* Stylized Graffiti Text */}
            <div className="mb-2 sm:mb-3 md:mb-4 select-none">
              <span className="font-black italic text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl text-rose-500 tracking-tighter drop-shadow-[0_3px_6px_rgba(0,0,0,0.9),0_0_15px_rgba(244,63,94,0.8)] rotate-6 block font-sans">
                BOSS
              </span>
            </div>

            {/* Boss Bust Image */}
            <div
              className="relative shrink-0 overflow-visible"
              style={{
                width: 'clamp(130px, 12vw, 240px)',
                height: 'clamp(130px, 12vw, 240px)',
              }}
            >
              <div className="absolute inset-0 rounded-full bg-rose-500/25 blur-2xl pointer-events-none scale-125" />
              <Image
                src={`${IMAGEKIT_URL}/territory_img/boss.png`}
                alt="Boss"
                fill
                className="w-full h-full object-contain object-bottom drop-shadow-[0_0_20px_rgba(244,63,94,0.7)] pointer-events-none scale-110 origin-bottom"
              />
            </div>
          </div>

          {/* Enemy Point Card Frame using enemy_point_card.png */}
          <div className="relative w-full 2xl:w-150 aspect-3360/1274 select-none shrink-0 drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]">
            <Image
              src={`${IMAGEKIT_URL}/territory_img/enemy_point_card.png`}
              alt="Enemy HUD Card Frame"
              fill
              className="w-full h-full object-contain pointer-events-none select-none"
            />

            {/* Top Tab Overlay */}
            <div className="absolute top-[6%] left-[16%] right-[16%] flex items-center justify-center pointer-events-none">
              <span className="font-black text-[10px] sm:text-xs md:text-sm lg:text-base text-white uppercase tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                ENEMY (AI)
              </span>
            </div>

            {/* Dynamic Cells Count */}
            <div className="absolute top-[34%] left-[28%] right-[25%] flex items-center pointer-events-none">
              <span className="font-black text-xs sm:text-sm md:text-base lg:text-lg 2xl:text-xl text-zinc-900 tracking-wide font-sans">
                {player2Count} Cells
              </span>
              {player2Count !== connectedP2CellIds.size && (
                <span className="ml-1 text-[9px] sm:text-[10px] md:text-xs font-mono font-bold text-rose-600">
                  ({connectedP2CellIds.size} act)
                </span>
              )}
            </div>

            {/* Dynamic Bits Count */}
            <div className="absolute top-[60%] left-[28%] right-[25%] flex items-center pointer-events-none">
              <span className="font-black text-xs sm:text-sm md:text-base lg:text-lg 2xl:text-xl text-zinc-900 tracking-wide font-sans">
                Bits: 0
              </span>
            </div>
          </div>
        </div>
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
