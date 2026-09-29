export type CellOwner = "player1" | "player2" | null;

export type Cell = {
  id: string;
  row: number;
  col: number;
  owner: CellOwner;
};
