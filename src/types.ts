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