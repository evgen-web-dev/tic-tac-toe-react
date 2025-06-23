import { WonCellsColorTypes, type GameField, type GameFinishedBy, type Player, type WonCellsColorType } from "../types/types";
import { hasNumericValue } from "../utils/utils";
import type { BaseAction } from "./global";

export type State = {
    gameField: GameField,   // to highlight cells of "winning" combination - with green color when we won and with red color - when computer won
    isGameFinishedBy: GameFinishedBy, // to track whether game is finished and if yes - by which way (look GameFinishedBy type for more details)
    players: Player[],
    currentPlayer: Player,
    wonCellsColor: WonCellsColorType
}



type MakeMoveAction = BaseAction<'makeMove', {
    cellCoordinates: [number, number],
    moveValue: string
}>

type IncrementPlayerScoreAction = BaseAction<'incrementPlayerScore', {
    playerName: string
}>

type ResetGameFieldAction = BaseAction<'resetGameField'>;

type FreezeGameFieldAction = BaseAction<'freezeGameField', {
    isFreezed: boolean
}>;

type SwitchToNextPlayerAction = BaseAction<'switchToNextPlayer'>;

type HighlightGameFieldCellsAction = BaseAction<'highlightGameFieldCells', {
    cellsCoordinates: Array<[number, number]>
}>;

type SetWonCellsColorAction = BaseAction<'setWonCellsColor'>;

type SetIsGameFinishedByAction = BaseAction<'setIsGameFinishedBy', {
    newSetIsGameFinishedBy: GameFinishedBy
}>;


export type Action = MakeMoveAction | IncrementPlayerScoreAction | ResetGameFieldAction 
| FreezeGameFieldAction | SwitchToNextPlayerAction | HighlightGameFieldCellsAction | SetWonCellsColorAction
| SetIsGameFinishedByAction;


    

export function gameReducerFunction(state: State, action: Action): State {
    switch (action.type) {

        case 'makeMove': {
            const [i, j] = action.payload?.cellCoordinates || [];

            const newGameField: GameField = {...state.gameField};
            newGameField.cells = [...newGameField.cells];

            if (hasNumericValue(i, j)) {
                newGameField.cells[ i! ][ j! ].value = state.currentPlayer.moveValue;
            }

            return {
                ...state,
                gameField: newGameField
            }
        }

        case 'incrementPlayerScore': {
            return {
                ...state, 
                players: state.players.map((player: Player) => (player.name === (action.payload?.playerName || '') ? {...player, score: player.score + 1} : player)) 
            }
        }

        case 'resetGameField': {
            return {
                ...state, 
                gameField: {
                    ...state.gameField, 
                    cells: [
                        [ {value: ''}, {value: ''}, {value: ''} ],
                        [ {value: ''}, {value: ''}, {value: ''} ],
                        [ {value: ''}, {value: ''}, {value: ''} ],
                    ],
                    isFreezed: false
                },
                isGameFinishedBy: null,
                currentPlayer: state.players[0],
            }
        }

        case 'freezeGameField': {
            return {
                ...state, 
                gameField: {
                    ...state.gameField, isFreezed: (action.payload?.isFreezed || false)
                }
            }
        }

        case 'switchToNextPlayer': {
            const prevPlayerIndex = state.players.findIndex( (curPlayer: Player) => curPlayer.name === state.currentPlayer.name );

            return {
                ...state, 
                currentPlayer: state.players[ prevPlayerIndex === (state.players.length - 1) ? 0 : prevPlayerIndex + 1 ] // setting next (or first) player as active
            }
        }

        case 'highlightGameFieldCells': {
            const newGameField = {...state.gameField};
            newGameField.cells = [...newGameField.cells];

            for (const curCoordinatesPair of (action.payload?.cellsCoordinates || [])) {
                const [i, j] = curCoordinatesPair;
                newGameField.cells[i][j].isHightlighted = true;
            }
      
            return {
                ...state,
                gameField: newGameField
            }
        }

        case 'setWonCellsColor': {
            return {
                ...state,
                wonCellsColor: state.currentPlayer.isAutomated ? WonCellsColorTypes.LostColor : WonCellsColorTypes.WinColor
            }
        }

        case 'setIsGameFinishedBy': {
            return {
                ...state,
                isGameFinishedBy: action.payload!.newSetIsGameFinishedBy || null
            }
        }

    }
    return state;
}
