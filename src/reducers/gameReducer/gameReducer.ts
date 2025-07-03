import {
  WonCellsColorTypes,
  type GameField,
  type GameStatus,
  type Player,
  type WonCellsColorType,
} from "../../types/types";
import { hasNumericValue } from "../../utils/utils";
import type { BaseAction } from "../global";
import { TicTacToeEngine, type Position } from "../../game/TicTacToeEngine";

const convertEngineStateToGameField = (engine: TicTacToeEngine): GameField => {
  const gameState = engine.getGameState();
  const cells = gameState.board.map(row => 
    row.map(cell => ({ value: cell.toLowerCase() }))
  ) as GameField['cells'];
  
  return {
    cells,
    isFreezed: gameState.result !== 'playing'
  };
};

const positionToCoords = (pos: Position): [number, number] => [pos.row, pos.col];

const updateGameField = (
  gameField: GameField,
  updates: Partial<GameField> = {}
): GameField => ({
  ...gameField,
  cells: [...gameField.cells],
  ...updates,
});

const getNextPlayer = (players: Player[], currentPlayer: Player): Player => {
  const currentIndex = players.findIndex((p) => p.name === currentPlayer.name);
  return players[(currentIndex + 1) % players.length];
};


export type State = {
  gameField: GameField;
  gameStatus: GameStatus;
  winner: Player | null;
  winningCells: Array<[number, number]>;
  players: Player[];
  currentPlayer: Player;
  wonCellsColor: WonCellsColorType;
  gameEngine: TicTacToeEngine;
};

type MakeMoveAction = BaseAction<
  "makeMove",
  { cellCoordinates: [number, number] }
>;
type ResetGameFieldAction = BaseAction<"resetGameField">;
type HighlightGameFieldCellsAction = BaseAction<
  "highlightGameFieldCells",
  { cellsCoordinates: Array<[number, number]> }
>;
type SetWonCellsColorAction = BaseAction<"setWonCellsColor">;
type MakeBotMoveAction = BaseAction<"makeBotMove">;

export type Action =
  | MakeMoveAction
  | ResetGameFieldAction
  | HighlightGameFieldCellsAction
  | SetWonCellsColorAction
  | MakeBotMoveAction;

export function gameReducerFunction(state: State, action: Action): State {
  switch (action.type) {
    case "makeMove": {
      const [row, col] = action.payload?.cellCoordinates || [];
      if (!hasNumericValue(row, col)) return state;

      const newEngine = state.gameEngine.clone();
      const moveSuccess = newEngine.makeMove(row!, col!);
      
      if (!moveSuccess) return state;

      const gameState = newEngine.getGameState();
      const newGameField = convertEngineStateToGameField(newEngine);
      
      let newState: State = {
        ...state,
        gameEngine: newEngine,
        gameField: newGameField,
      };

      if (gameState.result === 'win') {
        newState = {
          ...newState,
          gameStatus: "won",
          winner: state.currentPlayer,
          winningCells: gameState.winningCells.map(positionToCoords),
          players: state.players.map((player) =>
            player.name === state.currentPlayer.name
              ? { ...player, score: player.score + 1 }
              : player
          ),
        };
      } else if (gameState.result === 'draw') {
        newState = {
          ...newState,
          gameStatus: "draw",
          winner: null,
          winningCells: [],
        };
      } else {
        newState = {
          ...newState,
          currentPlayer: getNextPlayer(state.players, state.currentPlayer),
        };
      }

      return newState;
    }

    case "makeBotMove": {
      const newEngine = state.gameEngine.clone();
      const bestMove = newEngine.getBestMove();
      
      if (!bestMove) return state;
      
      const moveSuccess = newEngine.makeMove(bestMove.row, bestMove.col);
      if (!moveSuccess) return state;

      const gameState = newEngine.getGameState();
      const newGameField = convertEngineStateToGameField(newEngine);
      
      let newState: State = {
        ...state,
        gameEngine: newEngine,
        gameField: newGameField,
      };

      if (gameState.result === 'win') {
        newState = {
          ...newState,
          gameStatus: "won",
          winner: state.currentPlayer,
          winningCells: gameState.winningCells.map(positionToCoords),
          players: state.players.map((player) =>
            player.name === state.currentPlayer.name
              ? { ...player, score: player.score + 1 }
              : player
          ),
        };
      } else if (gameState.result === 'draw') {
        newState = {
          ...newState,
          gameStatus: "draw",
          winner: null,
          winningCells: [],
        };
      } else {
        newState = {
          ...newState,
          currentPlayer: getNextPlayer(state.players, state.currentPlayer),
        };
      }

      return newState;
    }

    case "resetGameField": {
      const newEngine = new TicTacToeEngine();
      return {
        ...state,
        gameEngine: newEngine,
        gameField: convertEngineStateToGameField(newEngine),
        gameStatus: "playing",
        winner: null,
        winningCells: [],
        currentPlayer: state.players[0],
      };
    }

    case "highlightGameFieldCells": {
      const newGameField = updateGameField(state.gameField);
      const cellsCoordinates = action.payload?.cellsCoordinates || [];

      cellsCoordinates.forEach(([i, j]) => {
        newGameField.cells[i][j].isHightlighted = true;
      });

      return { ...state, gameField: newGameField };
    }

    case "setWonCellsColor": {
      return {
        ...state,
        wonCellsColor: state.currentPlayer.isAutomated
          ? WonCellsColorTypes.LostColor
          : WonCellsColorTypes.WinColor,
      };
    }
  }
}
