export type FieldCell = {
    value: string;
    isHightlighted?: boolean
}



export type Player = {
    name: string,
    moveValue: string,
    isAutomated: boolean,
    score: number
}


export type GameField = {
    cells: [
        [FieldCell, FieldCell, FieldCell],
        [FieldCell, FieldCell, FieldCell],
        [FieldCell, FieldCell, FieldCell],
    ];
    isFreezed: boolean;
}


type GameFinishedByDiagonalWon = {
    type: 'diagonal-won', diagonalType: 'left' | 'right';
}
type GameFinishedByColWon = {
    type: 'col-won', colIndex: number;
}
type GameFinishedByRowWon = {
    type: 'row-won', rowIndex: number;
}
type GameFinishedByDraw = {
    type: 'draw-game'
}
export type GameFinishedBy = null | GameFinishedByDiagonalWon | GameFinishedByColWon | GameFinishedByRowWon | GameFinishedByDraw;


export type WonCellsColorType = typeof WonCellsColorTypes[keyof typeof WonCellsColorTypes];
export const WonCellsColorTypes = {
    WinColor: 'bg-green-200 dark:bg-green-800', 
    LostColor: 'bg-red-200 dark:bg-red-900'
}