export type FieldCell = {
  value: string;
  isHightlighted?: boolean;
};

export type Player = {
  name: string;
  moveValue: 'X' | 'O';
  isAutomated: boolean;
  score: number;
};

export type GameField = {
  cells: [
    [FieldCell, FieldCell, FieldCell],
    [FieldCell, FieldCell, FieldCell],
    [FieldCell, FieldCell, FieldCell]
  ];
  isFreezed: boolean;
};

export type GameStatus = "playing" | "won" | "draw";

export type WonCellsColorType =
  (typeof WonCellsColorTypes)[keyof typeof WonCellsColorTypes];
export const WonCellsColorTypes = {
  WinColor: "bg-green-200 dark:bg-green-800",
  LostColor: "bg-red-200 dark:bg-red-900",
};
