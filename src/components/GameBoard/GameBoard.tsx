import { useEffect, useReducer } from "react";
import GameResult from "../GameResult/GameResult";
import { GameScore } from "../GameScore/GameScore";
import { GameField } from "../GameField/GameField";
import { type State, type Action, gameReducerFunction } from "../../reducers/gameReducer/gameReducer";
import { WonCellsColorTypes } from "../../types/types";
import { TicTacToeEngine } from "../GameResult/TicTacToeEngine";
import { hasNumericValue } from "../../utils/utils";


type GameBoardProps = {

}


export default function GameBoard({ }: GameBoardProps) {
    const [state, dispatch] = useReducer<State, [Action]>(gameReducerFunction, {
        ...(new TicTacToeEngine()).getGame(),
        isGameFinishedBy: null,
        wonCellsColor: WonCellsColorTypes.LostColor
    });

    const { gameField, currentPlayer, isGameFinishedBy } = state;


    useEffect(() => {
        if (currentPlayer.isAutomated) {
            // freezing gamefield as automated users (bots) are making their moves with delay so 
            // we might not want to prevent user from being able to interact with gamefield
            toogleGameFieldFreezed(true);
            makeBotUserMove();
        }

        dispatch({ type: 'setWonCellsColor' });

    }, [currentPlayer]);



    useEffect(() => {
        /* 
        if game was finished - we might want to perform some actions: 
          - when some of players won - we collect for coordinates for cells which are of winning combination - to hightlight them with color
        */

        if (isGameFinishedBy) {
            toogleGameFieldFreezed(true);
            highlightGameFieldCells(400);
        }
    }, [isGameFinishedBy]);



    function toogleGameFieldFreezed(isGameFieldFreezed: boolean) {
        dispatch({ type: 'freezeGameField', payload: { isFreezed: isGameFieldFreezed } });
    }



    async function highlightGameFieldCells(delayMs: number) {
        // If executing highlightGameFieldCells() without any delay inside - AND if current player won - user sees colors changed to green or red 
        // while in last clicked cell - icon (X or O) is still being animated - so color-chaning happens a bit too fast.

        // So - calling highlightGameFieldCells() with delay inside simulates waiting till 
        // last clicked cell's icon will finish it animation and will show-up completely - and after that - needed cells will be highlighted with color.

        await new Promise((resolve, _) => setTimeout(resolve, delayMs));
        dispatch({ type: 'highlightGameFieldCells' })
    }



    // wrapping bot-user move with async fn to make his move be made with time-delay
    async function makeBotUserMove() {
        await new Promise((resolve => setTimeout(resolve, 1000))); // making bot users move with a delay
        // const [i, j] = getNextMoveCoordinates();
        // makeMove(i, j);
        makeMove();
        await new Promise((resolve => setTimeout(resolve, 600))); // waiting till icon will finish its animation in the cell where bot-user made a move 
    }


    function makeMove(i?: number, j?: number) {
        // console.log(currentPlayer.name, gameField.isFreezed, '\n\n',)
        const coordinates = hasNumericValue(i, j) ? [i, j] as [number, number] : undefined;
        if (!gameField.isFreezed) dispatch({ type: 'makeMove', payload: { cellCoordinates: coordinates } });
    }


    function handleResetOnClick() {
        if (!gameField.isFreezed) resetGameField();
    }


    function resetGameField() {
        dispatch({ type: 'resetGameField' });
    }

    return (
        <>
            <GameResult state={state} onGameFinishedCountdownCompleted={resetGameField} />

            <div className="w-full max-w-[340px] min-[1600px]:max-w-md bg-white dark:bg-neutral-600 rounded-2xl shadow-lg p-4 pt-3 min-[1600px]:p-6 min-[1600px]:pt-4 mt-7 md:mt-10 min-[1600px]:mt-12">

                <GameScore state={state} />

                <button onClick={handleResetOnClick} className='mb-5 !text-xs' type='button'>Reset game-field</button>

                <GameField state={state} onMove={makeMove} />

            </div>

        </>
    )
}