import React, { useEffect } from "react";
import {
  useGameDispatch,
  useGameState,
} from "../../reducers/gameReducer/gameReducerContext";
import GameResult from "../GameResult/GameResult";
import { GameScore } from "../GameScore/GameScore";
import { GameField } from "../GameField/GameField";

export default function GameBoard() {
  const { gameField, currentPlayer, gameStatus, winningCells } = useGameState();
  const dispatch = useGameDispatch();

  useEffect(() => {
    if (currentPlayer.isAutomated) {
      handleBotUserMove();
    }

    dispatch({ type: "setWonCellsColor" });
  }, [currentPlayer, dispatch]);

  useEffect(() => {
    if (gameStatus !== "playing" && winningCells.length > 0) {
      highlightGameFieldCells(winningCells, 400);
    }
  }, [gameStatus, winningCells]);

  const handleBotUserMove = React.useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    dispatch({ type: "makeBotMove" });
    await new Promise((resolve) => setTimeout(resolve, 600));
  }, [dispatch]);

  const highlightGameFieldCells = React.useCallback(
    async (cellsCoordinates: Array<[number, number]>, delayMs: number) => {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      dispatch({
        type: "highlightGameFieldCells",
        payload: { cellsCoordinates: cellsCoordinates },
      });
    },
    [dispatch]
  );

  const makeMove = (i: number, j: number) => {
    if (!gameField.isFreezed) {
      dispatch({
        type: "makeMove",
        payload: {
          cellCoordinates: [i, j],
        },
      });
    }
  };

  const handleResetOnClick = () => {
    dispatch({ type: "resetGameField" });
  };

  return (
    <>
      <GameResult onGameFinishedCountdownCompleted={handleResetOnClick} />

      <div className="w-full max-w-[340px] min-[1600px]:max-w-md bg-white dark:bg-neutral-600 rounded-2xl shadow-lg p-4 pt-3 min-[1600px]:p-6 min-[1600px]:pt-4 mt-7 md:mt-10 min-[1600px]:mt-12">
        <GameScore />

        <button
          onClick={handleResetOnClick}
          className="mb-5 !text-xs"
          type="button"
        >
          Reset game-field
        </button>

        <GameField onMove={makeMove} />
      </div>
    </>
  );
}
