import { TicTacToeEngine, type GameEngineProps } from "../../components/GameResult/TicTacToeEngine";
import { WonCellsColorTypes, type GameFinishedBy, type WonCellsColorType } from "../../types/types";
import type { BaseAction } from "../global";



export type State = GameEngineProps & {
  isGameFinishedBy: GameFinishedBy, // to track whether game is finished and if yes - by which way (look GameFinishedBy type for more details)
  wonCellsColor: WonCellsColorType
}



type MakeMoveAction = BaseAction<'makeMove', {
  cellCoordinates?: [number, number]
}>

type ResetGameFieldAction = BaseAction<'resetGameField'>;

type FreezeGameFieldAction = BaseAction<'freezeGameField', {
  isFreezed: boolean
}>;

type HighlightGameFieldCellsAction = BaseAction<'highlightGameFieldCells'>;

type SetWonCellsColorAction = BaseAction<'setWonCellsColor'>;

export type Action = MakeMoveAction | ResetGameFieldAction | FreezeGameFieldAction 
| HighlightGameFieldCellsAction | SetWonCellsColorAction;




export function gameReducerFunction(state: State, action: Action): State {
  const gameEngine = new TicTacToeEngine(state).clone();

  switch (action.type) {

    case 'makeMove': {
      gameEngine.makeMove(action.payload?.cellCoordinates || gameEngine.getNextMoveCoordinates());
      
      const currentGameResult = gameEngine.checkIfWin();

      if (currentGameResult === null) {
        gameEngine.switchToNextPlayer();
        gameEngine.freezeGameField(false);
      }

      else if (currentGameResult.type !== 'draw-game') {
        gameEngine.incrementCurrentPlayerScore();
        gameEngine.freezeGameField(true);
      }

      return {
        ...state,
        ...gameEngine.getGame(),
        isGameFinishedBy: currentGameResult
      }
    }

    case 'resetGameField': {
      gameEngine.resetGame();

      return {
        ...state,
        ...gameEngine.getGame(),
        isGameFinishedBy: null,
      }
    }

    case 'freezeGameField': {
      gameEngine.freezeGameField(action.payload?.isFreezed || false);
      return {
        ...state,
        gameField: gameEngine.getGameField()
      }
    }

    case 'highlightGameFieldCells': {
      gameEngine.highlightFromGameResult(state.isGameFinishedBy);

      return {
        ...state,
        gameField: gameEngine.getGameField()
      }
    }

    case 'setWonCellsColor': {
      return {
        ...state,
        wonCellsColor: state.currentPlayer.isAutomated ? WonCellsColorTypes.LostColor : WonCellsColorTypes.WinColor
      }
    }

  }

  return state;
}
