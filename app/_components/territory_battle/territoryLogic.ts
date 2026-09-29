import { Cell, CellOwner } from './types';

export const BOARD_SIZE = 8;
export const GRID_SIZE = BOARD_SIZE;

export interface BaseLocation {
  row: number;
  col: number;
}

/**
 * Permanent base coordinates.
 * P1 Base = top-left (0,0)
 * P2 Base = bottom-right (GRID_SIZE-1, GRID_SIZE-1) -> (7,7) for 8x8
 */
export const P1_BASE: BaseLocation = { row: 0, col: 0 };
export const P2_BASE: BaseLocation = { row: BOARD_SIZE - 1, col: BOARD_SIZE - 1 };

export function getBaseLocation(
  player: CellOwner,
  size: number = BOARD_SIZE
): BaseLocation | null {
  if (player === 'player1') return { row: 0, col: 0 };
  if (player === 'player2') return { row: size - 1, col: size - 1 };
  return null;
}

/**
 * Centralized Game & AI Configuration Constants
 */
export const MATCH_DURATION = 120; // 2 minutes (120 seconds)
export const AI_CAPTURE_INTERVAL = 5000;
export const AI_ACCEPT_CHALLENGE_PROBABILITY = 0.5;
export const AI_CORRECT_ANSWER_PROBABILITY = 0.3;
export const DUEL_DURATION = 10_000; // in milliseconds (10 seconds)
export const PLAYER_CHALLENGE_COST = 2;
export const AI_REJECTION_REFUND = 1;
export const AI_CHALLENGE_PROBABILITY = 0.35; // Probability that AI challenges an adjacent P1 cell on its tick

/**
 * Initializes an 8x8 territory grid:
 * - 64 cells total (rows 0..7, cols 0..7)
 * - (0,0) belongs to player1 (P1 Base)
 * - (7,7) belongs to player2 (P2 Base)
 * - All other cells have owner: null
 */
export function createInitialBoard(size: number = BOARD_SIZE): Cell[] {
  const cells: Cell[] = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      let owner: CellOwner = null;
      if (row === 0 && col === 0) {
        owner = 'player1';
      } else if (row === size - 1 && col === size - 1) {
        owner = 'player2';
      }

      cells.push({
        id: `cell-${row}-${col}`,
        row,
        col,
        owner,
      });
    }
  }
  return cells;
}

/**
 * Helper to retrieve a cell at specific row and col from the flat board array.
 */
export function getCellAt(
  board: Cell[],
  row: number,
  col: number,
  size: number = BOARD_SIZE
): Cell | undefined {
  if (row < 0 || row >= size || col < 0 || col >= size) {
    return undefined;
  }
  const index = row * size + col;
  const candidate = board[index];
  if (candidate && candidate.row === row && candidate.col === col) {
    return candidate;
  }
  return board.find((c) => c.row === row && c.col === col);
}

/**
 * Returns all orthogonally adjacent cells within the grid bounds.
 * Diagonal adjacency is strictly excluded.
 */
export function getOrthogonalAdjacentCells(
  board: Cell[],
  cell: Cell,
  size: number = BOARD_SIZE
): Cell[] {
  const { row, col } = cell;
  const directions = [
    { row: row - 1, col }, // UP
    { row: row + 1, col }, // DOWN
    { row, col: col - 1 }, // LEFT
    { row, col: col + 1 }, // RIGHT
  ];

  const adjacent: Cell[] = [];
  for (const dir of directions) {
    const neighbor = getCellAt(board, dir.row, dir.col, size);
    if (neighbor) {
      adjacent.push(neighbor);
    }
  }
  return adjacent;
}

/**
 * Starting from the player's base location, performs BFS across orthogonally adjacent cells
 * owned by the same player to compute the connected territory set.
 *
 * Rules:
 * - Uninterrupted orthogonal path back to the base only. Diagonal connections do NOT count.
 * - If the base cell itself is not owned by that player, returns an empty set.
 * - Returns a Set of cell IDs that have an unbroken path back to the base.
 */
export function getConnectedTerritory(
  board: Cell[],
  player: CellOwner,
  base: BaseLocation = player === 'player1' ? P1_BASE : P2_BASE,
  size: number = BOARD_SIZE
): Set<string> {
  const connectedSet = new Set<string>();
  if (!player) return connectedSet;

  const baseCell = getCellAt(board, base.row, base.col, size);
  if (!baseCell || baseCell.owner !== player) {
    // Base is not owned by the player -> zero connected territory
    return connectedSet;
  }

  const queue: Cell[] = [baseCell];
  connectedSet.add(baseCell.id);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const neighbors = getOrthogonalAdjacentCells(board, current, size);

    for (const neighbor of neighbors) {
      if (neighbor.owner === player && !connectedSet.has(neighbor.id)) {
        connectedSet.add(neighbor.id);
        queue.push(neighbor);
      }
    }
  }

  return connectedSet;
}

/**
 * Checks whether a specific cell is connected back to its owner's base.
 */
export function isConnectedToBase(
  board: Cell[],
  cell: Cell,
  size: number = BOARD_SIZE
): boolean {
  if (!cell.owner) return false;
  const base = getBaseLocation(cell.owner, size);
  if (!base) return false;
  const connected = getConnectedTerritory(board, cell.owner, base, size);
  return connected.has(cell.id);
}

/**
 * Checks whether the given player can capture the specified empty cell.
 *
 * Rule:
 * An empty cell is capturable ONLY when it is orthogonally adjacent
 * to at least one CONNECTED cell owned by `player`.
 * Isolated/disconnected cells cannot project expansion.
 */
export function canCaptureCell(
  board: Cell[],
  cell: Cell,
  player: CellOwner,
  connectedCells?: Set<string>,
  size: number = BOARD_SIZE
): boolean {
  if (!player || cell.owner !== null) {
    return false;
  }

  const base = getBaseLocation(player, size);
  if (!base) return false;

  const connected =
    connectedCells ?? getConnectedTerritory(board, player, base, size);

  if (connected.size === 0) return false;

  const adjacent = getOrthogonalAdjacentCells(board, cell, size);
  return adjacent.some(
    (neighbor) => neighbor.owner === player && connected.has(neighbor.id)
  );
}

/**
 * Checks whether a player can challenge an enemy-owned cell.
 *
 * Rule:
 * A player may challenge an enemy-owned cell ONLY if that enemy cell
 * is orthogonally adjacent to at least one CONNECTED cell owned by `challenger`.
 * Isolated/disconnected regions cannot attack enemy territory.
 * The opponent's base cell is challengeable if orthogonally adjacent to connected territory!
 */
export function canChallengeCell(
  board: Cell[],
  cell: Cell,
  challenger: CellOwner,
  connectedCells?: Set<string>,
  size: number = BOARD_SIZE
): boolean {
  if (!challenger || cell.owner === null || cell.owner === challenger) {
    return false;
  }

  const base = getBaseLocation(challenger, size);
  if (!base) return false;

  const connected =
    connectedCells ?? getConnectedTerritory(board, challenger, base, size);

  if (connected.size === 0) return false;

  const adjacent = getOrthogonalAdjacentCells(board, cell, size);
  return adjacent.some(
    (neighbor) => neighbor.owner === challenger && connected.has(neighbor.id)
  );
}

/**
 * Finds all enemy cells that a player can challenge (orthogonally adjacent to CONNECTED player territory).
 */
export function getChallengeableEnemyCells(
  board: Cell[],
  challenger: CellOwner,
  connectedCells?: Set<string>,
  size: number = BOARD_SIZE
): Cell[] {
  if (!challenger) return [];
  const targetOwner: CellOwner = challenger === 'player1' ? 'player2' : 'player1';
  const enemyCells = board.filter((c) => c.owner === targetOwner);

  const base = getBaseLocation(challenger, size);
  if (!base) return [];

  const connected =
    connectedCells ?? getConnectedTerritory(board, challenger, base, size);

  if (connected.size === 0) return [];

  return enemyCells.filter((c) =>
    canChallengeCell(board, c, challenger, connected, size)
  );
}

/**
 * Finds all valid empty expansion candidate cells for a given player.
 *
 * Rule:
 * Expansion candidates are generated ONLY from cells connected to the base.
 * Isolated/disconnected cells cannot expand.
 */
export function getValidExpansionCells(
  board: Cell[],
  player: CellOwner = 'player2',
  connectedCells?: Set<string>,
  size: number = BOARD_SIZE
): Cell[] {
  if (!player) return [];

  const base = getBaseLocation(player, size);
  if (!base) return [];

  const connected =
    connectedCells ?? getConnectedTerritory(board, player, base, size);

  if (connected.size === 0) return [];

  const candidateMap = new Map<string, Cell>();

  for (const cellId of connected) {
    const ownedCell = board.find((c) => c.id === cellId);
    if (!ownedCell) continue;

    const neighbors = getOrthogonalAdjacentCells(board, ownedCell, size);
    for (const neighbor of neighbors) {
      if (neighbor.owner === null) {
        candidateMap.set(neighbor.id, neighbor);
      }
    }
  }

  return Array.from(candidateMap.values());
}

/**
 * Randomly selects one cell from an array of candidate cells.
 */
export function chooseRandomCell(cells: Cell[]): Cell | null {
  if (!cells || cells.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * cells.length);
  return cells[randomIndex];
}

/**
 * Executes one step of autonomous AI territory expansion into an empty cell
 * originating exclusively from cells connected to Player 2's base.
 */
export function performAIExpansion(
  board: Cell[],
  player: CellOwner = 'player2',
  connectedCells?: Set<string>,
  size: number = BOARD_SIZE
): { updatedBoard: Cell[]; capturedCell: Cell | null } {
  const candidates = getValidExpansionCells(board, player, connectedCells, size);
  const targetCell = chooseRandomCell(candidates);

  if (!targetCell) {
    return { updatedBoard: board, capturedCell: null };
  }

  const updatedBoard = board.map((cell) =>
    cell.id === targetCell.id ? { ...cell, owner: player } : cell
  );

  return {
    updatedBoard,
    capturedCell: { ...targetCell, owner: player },
  };
}

/**
 * Checks if either player's base has been captured.
 * Immediate victory occurs as soon as an opponent controls the enemy base.
 */
export function checkBaseCapture(
  board: Cell[],
  size: number = BOARD_SIZE
): {
  isCaptured: boolean;
  winner: CellOwner | null;
  capturedBase: 'player1' | 'player2' | null;
} {
  const p1Base = getCellAt(board, P1_BASE.row, P1_BASE.col, size);
  const p2Base = getCellAt(board, P2_BASE.row, P2_BASE.col, size);

  if (p1Base && p1Base.owner === 'player2') {
    return { isCaptured: true, winner: 'player2', capturedBase: 'player1' };
  }
  if (p2Base && p2Base.owner === 'player1') {
    return { isCaptured: true, winner: 'player1', capturedBase: 'player2' };
  }

  return { isCaptured: false, winner: null, capturedBase: null };
}

/**
 * Counts all owned cells for Player 1 and Player 2 across the entire board.
 * Note: Uses total ownership, including isolated cells.
 */
export function getTerritoryCounts(board: Cell[]): {
  p1Cells: number;
  p2Cells: number;
} {
  const p1Cells = board.filter((c) => c.owner === 'player1').length;
  const p2Cells = board.filter((c) => c.owner === 'player2').length;
  return { p1Cells, p2Cells };
}

/**
 * Determines match winner when timer expires by comparing total territory counts.
 */
export function determineTimedResult(
  p1Cells: number,
  p2Cells: number
): {
  result: 'p1-win' | 'p2-win' | 'draw';
  winner: CellOwner | 'draw';
} {
  if (p1Cells > p2Cells) {
    return { result: 'p1-win', winner: 'player1' };
  }
  if (p2Cells > p1Cells) {
    return { result: 'p2-win', winner: 'player2' };
  }
  return { result: 'draw', winner: 'draw' };
}
