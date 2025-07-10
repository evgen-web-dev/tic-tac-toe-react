import { TicTacToeEngine, type GameEngineProps } from "../../components/GameResult/TicTacToeEngine";
import { WonCellsColorTypes, type DifficultyLevel, type GameFinishedBy, type WonCellsColorType } from "../../types/types";
import type { BaseAction } from "../global";



export type State = GameEngineProps & {
  isGameFinishedBy: GameFinishedBy, // to track whether game is finished and if yes - by which way (look GameFinishedBy type for more details)
  wonCellsColor: WonCellsColorType,
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

type SetDifficultyLevelAction = BaseAction<'setDifficultyLevelAction', {
  level: DifficultyLevel
}>;

type SetUserName = BaseAction<'setUserName', {
  newName: string
}>;

export type Action = MakeMoveAction | ResetGameFieldAction | FreezeGameFieldAction
  | HighlightGameFieldCellsAction | SetWonCellsColorAction | SetDifficultyLevelAction | SetUserName;




export function gameReducerFunction(state: State, action: Action): State {
  const gameEngine = new TicTacToeEngine(state).clone();

  switch (action.type) {

    case 'makeMove': {
      let currentGameResult = state.isGameFinishedBy;

      if (gameEngine.makeMove(action.payload?.cellCoordinates || gameEngine.getNextMoveCoordinates())) {
        currentGameResult = gameEngine.checkIfWin();

        if (currentGameResult === null) {
          gameEngine.switchToNextPlayer();
          gameEngine.freezeGameField(false);
        }

        else if (currentGameResult.type !== 'draw-game') {
          gameEngine.incrementCurrentPlayerScore();
          gameEngine.freezeGameField(true);
        }
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
      const currentPlayer = gameEngine.getCurrentPlayer()!;
      return {
        ...state,
        wonCellsColor: currentPlayer.isAutomated ? WonCellsColorTypes.LostColor : WonCellsColorTypes.WinColor
      }
    }

    case 'setDifficultyLevelAction': {
      gameEngine.setDiffucultyLevel(action.payload?.level || 'simple');

      return {
        ...state,
        difficultyLevel: gameEngine.getDiffucultyLevel()
      }
    }

    case 'setUserName': {
      const userPlayer = TicTacToeEngine.getUserPlayer(gameEngine.getPlayers());
      gameEngine.setUserName(userPlayer.id, action.payload?.newName || TicTacToeEngine.userPlayerDefaultName)

      return {
        ...state,
        players: gameEngine.getPlayers()
      }
    }

  }

  return state;
}
