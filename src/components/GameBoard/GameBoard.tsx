import { useEffect, useReducer } from "react";
import GameResult from "../GameResult/GameResult";
import { GameScore } from "../GameScore/GameScore";
import { GameField } from "../GameField/GameField";
import { type State, type Action, gameReducerFunction } from "../../reducers/gameReducer/gameReducer";
import { WonCellsColorTypes } from "../../types/types";


type GameBoardProps = {
    
}


export default function GameBoard({ }: GameBoardProps) {

    const initialPlayers = [
      { name: 'User', moveValue: 'x', isAutomated: false, score: 0 },
      { name: 'Computer', moveValue: 'o', isAutomated: true, score: 0 },
    ];
    
      const [state, dispatch] = useReducer<State, [Action]>(gameReducerFunction, {
          gameField: {
              cells: [
              [ {value: ''}, {value: ''}, {value: ''} ],
              [ {value: ''}, {value: ''}, {value: ''} ],
              [ {value: ''}, {value: ''}, {value: ''} ],
              ],
              isFreezed: false
          },
          isGameFinishedBy: null,
          players: initialPlayers,
          currentPlayer: initialPlayers[0],
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
        if (!isGameFinishedBy && !isGameFieldEmpty()) {
            checkIfWin();
        }
    }, [gameField.cells]);



    useEffect(() => {
        /* 
        if game was finished - we might want to perform some actions: 
          - when some of players won - we collect for coordinates for cells which are of winning combination - to hightlight them with color
        */

        if (isGameFinishedBy) {
            const coordinatesToHightlight: Array<[number, number]> = [];

            switch (isGameFinishedBy.type) {

                case 'diagonal-won': {
                    coordinatesToHightlight.push([1, 1]); // will always need to hightlight center cell if game is won by diagonal

                    switch (isGameFinishedBy.diagonalType) {
                        case 'left': coordinatesToHightlight.push([0, 0], [2, 2]); break;
                        case 'right': coordinatesToHightlight.push([0, 2], [2, 0]); break;
                    }
                    break;
                }

                case 'col-won': {
                    for (let i = 0; i < 3; i++) { coordinatesToHightlight.push([i, isGameFinishedBy.colIndex]); }
                    break;
                }

                case 'row-won': {
                    for (let j = 0; j < 3; j++) { coordinatesToHightlight.push([isGameFinishedBy.rowIndex, j]); }
                    break;
                }

                case 'draw-game': {
                    break;
                }

            }

            toogleGameFieldFreezed(true);
            highlightGameFieldCells(coordinatesToHightlight, 400);
        }
    }, [isGameFinishedBy]);



    function toogleGameFieldFreezed(isGameFieldFreezed: boolean) {
        dispatch({ type: 'freezeGameField', payload: { isFreezed: isGameFieldFreezed } });
    }



    async function highlightGameFieldCells(cellsCoordinates: Array<[number, number]>, delayMs: number) {
        // If executing highlightGameFieldCells() without any delay inside - AND if current player won - user sees colors changed to green or red 
        // while in last clicked cell - icon (X or O) is still being animated - so color-chaning happens a bit too fast.

        // So - calling highlightGameFieldCells() with delay inside simulates waiting till 
        // last clicked cell's icon will finish it animation and will show-up completely - and after that - needed cells will be highlighted with color.

        await new Promise((resolve, _) => setTimeout(resolve, delayMs));
        dispatch({ type: 'highlightGameFieldCells', payload: { cellsCoordinates: cellsCoordinates } })
    }



    // wrapping bot-user move with async fn to make his move be made with time-delay
    async function makeBotUserMove() {
        await new Promise((resolve => setTimeout(resolve, 1000))); // making bot users move with a delay
        const [i, j] = getNextMoveCoordinates();
        makeMove(i, j);
        await new Promise((resolve => setTimeout(resolve, 600))); // waiting till icon will finish its animation in the cell where bot-user made a move 
    }



    function checkIfWin() {
        let hasCurrentPlayerWon = false;

        for (let i = 0; i < 3; i++) {
            if (gameField.cells[i][0].value === currentPlayer.moveValue
                && gameField.cells[i][1].value === currentPlayer.moveValue
                && gameField.cells[i][2].value === currentPlayer.moveValue
            ) {
                hasCurrentPlayerWon = true;
                dispatch({ type: 'setIsGameFinishedBy', payload: { newSetIsGameFinishedBy: { type: 'row-won', rowIndex: i } } })
            }
        }

        for (let j = 0; j < 3; j++) {
            if (gameField.cells[0][j].value === currentPlayer.moveValue
                && gameField.cells[1][j].value === currentPlayer.moveValue
                && gameField.cells[2][j].value === currentPlayer.moveValue
            ) {
                hasCurrentPlayerWon = true;
                dispatch({ type: 'setIsGameFinishedBy', payload: { newSetIsGameFinishedBy: { type: 'col-won', colIndex: j } } })
            }
        }

        if (gameField.cells[0][0].value === currentPlayer.moveValue
            && gameField.cells[1][1].value === currentPlayer.moveValue
            && gameField.cells[2][2].value === currentPlayer.moveValue
        ) {
            hasCurrentPlayerWon = true;
            dispatch({ type: 'setIsGameFinishedBy', payload: { newSetIsGameFinishedBy: { type: 'diagonal-won', diagonalType: 'left' } } })
        }
        if (gameField.cells[0][2].value === currentPlayer.moveValue
            && gameField.cells[1][1].value === currentPlayer.moveValue
            && gameField.cells[2][0].value === currentPlayer.moveValue
        ) {
            hasCurrentPlayerWon = true;
            dispatch({ type: 'setIsGameFinishedBy', payload: { newSetIsGameFinishedBy: { type: 'diagonal-won', diagonalType: 'right' } } })
        }


        if (hasCurrentPlayerWon) {
            // if some of players won
            incrementPlayerScore(currentPlayer.name);
            toogleGameFieldFreezed(true);
        }
        else if (isGameFieldFilled()) {
            // if it's draw game
            dispatch({ type: 'setIsGameFinishedBy', payload: { newSetIsGameFinishedBy: { type: 'draw-game' } } });
        }
        else {
            // if game still is going on - passing gamefield for move to other player
            // and unfreezing game-field for next player's move
            switchToNextPlayer();
            toogleGameFieldFreezed(false);
        }
    }


    function incrementPlayerScore(playerName: string) {
        dispatch({ type: 'incrementPlayerScore', payload: { playerName: playerName } });
    }





    function getNextMoveCoordinates(): [number, number] {
        // needs refactoring - for more complicated logic
        for (let i = 0; i < gameField.cells.length; i++) {
            for (let j = 0; j < gameField.cells.length; j++) {
                if (gameField.cells[i][j].value === '') {
                    return [i, j];
                }
            }
        }

        return [0, 0];
    }



    function switchToNextPlayer() {
        dispatch({ type: 'switchToNextPlayer' });
    }



    function isGameFieldEmpty(): boolean {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (gameField.cells[i][j].value !== '') {
                    return false;
                }
            }
        }

        return true;
    }



    function isGameFieldFilled(): boolean {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (gameField.cells[i][j].value === '') {
                    return false;
                }
            }
        }

        return true;
    }



    function makeMove(i: number, j: number) {
        if ( !gameField.isFreezed ) dispatch({ type: 'makeMove', payload: { cellCoordinates: [i, j], moveValue: currentPlayer.moveValue } });
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