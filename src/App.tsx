import { useEffect, useState } from 'react'
import './App.css'
import { type Player, type FieldCell, type GameField, type GameFinishedBy } from './types'
import CountdownTimer from './components/CountdownTimes/CountdownTimer';

function App() {

  const [gameField, setGameField] = useState<GameField>({
    cells: [
      [ {value: ''}, {value: ''}, {value: ''} ],
      [ {value: ''}, {value: ''}, {value: ''} ],
      [ {value: ''}, {value: ''}, {value: ''} ],
    ],
    isFreezed: false
  });

  // to track whether game is finished and if yes - by which way (look GameFinishedBy type for more details)
  const [isGameFinishedBy, setIsGameFinishedBy] = useState<GameFinishedBy>(null);

  // players - user (us) and computer (bot-user)
  const [players, setPlayers] = useState<Player[]>([
    { name: 'User', moveValue: 'x', isAutomated: false, score: 0 },
    { name: 'Computer', moveValue: 'o', isAutomated: true, score: 0 },
  ]);
  

  const [currentPlayer, setCurrentPlayer] = useState<Player>(players[0]);


  // to highlight cells of "winning" combination - with green color when we won and with red color - when computer won
  const [wonCellsColor, setWonCellsColor] = useState<'bg-green-200 dark:bg-green-800' | 'bg-red-200 dark:bg-red-900'>('bg-green-200 dark:bg-green-800');


  useEffect( () => {
    // // wrapping bot-user move with async fn to make his move be made with time-delay
    // async function makeBotUserMove() {
    //   await new Promise((resolve => setTimeout(resolve, 1000))); // making bot users move with a delay
    //   const [i, j] = getNextMoveCoordinates();
    //   makeMove(i, j);
    //   await new Promise((resolve => setTimeout(resolve, 600))); // waiting till icon will finish its animation in the cell where bot-user made a move 
    // }

    if (currentPlayer.isAutomated) {
      // freezing gamefield as automated users (bots) are making their moves with delay so 
      // we might not want to prevent user from being able to interact with gamefield
      toogleGameFieldFreezed(true);
      makeBotUserMove().then(() => toogleGameFieldFreezed(false));
    }

    setWonCellsColor(currentPlayer.isAutomated ? 'bg-red-200 dark:bg-red-900' : 'bg-green-200 dark:bg-green-800');
  }, [currentPlayer] );



  useEffect( () => {
    if (!isGameFinishedBy && !isGameFieldEmpty()) {
      checkIfWon();
    }

  }, [gameField.cells]);



  useEffect( () => {
    /* 
    if game was finished - we might want to perform some actions: 
      - when some of players won - we collect for coordinates for cells which are of winning combination - to hightlight them with color
    */

    if (isGameFinishedBy) {
      const coordinatesToHightlight: Array<[number, number]> = [];
      
      switch (isGameFinishedBy.type) {

        case 'diagonal-won': {
          coordinatesToHightlight.push([1,1]); // will always need to hightlight center cell if game is won by diagonal

          switch (isGameFinishedBy.diagonalType) {
            case 'left': coordinatesToHightlight.push([0,0], [2,2]); break;
            case 'right': coordinatesToHightlight.push([0,2], [2,0]); break;
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
      highlightGameFieldCells(coordinatesToHightlight, 600);
    }
  }, [isGameFinishedBy]);



  function toogleGameFieldFreezed(isGameFieldFreezed: boolean) {
    setGameField((prevGameField) => ({...prevGameField, isFreezed: isGameFieldFreezed}));
  }



  async function highlightGameFieldCells(cellsCoordinates: Array<[number, number]>, delayMs: number) {
    // If executing highlightGameFieldCells() without any delay inside - AND if current player won - user sees colors changed to green or red 
    // while in last clicked cell - icon (X or O) is still being animated - so color-chaning happens a bit too fast.

    // So - calling highlightGameFieldCells() with delay inside simulates waiting till 
    // last clicked cell's icon will finish it animation and will show-up completely - and after that - needed cells will be highlighted with color.

    await new Promise((resolve, _) => setTimeout(resolve, delayMs));
    
    setGameField((prevGameField) => {
      const newGameField = {...prevGameField};
      newGameField.cells = [...newGameField.cells];

      for (const curCoordinatesPair of cellsCoordinates) {
        const [i, j] = curCoordinatesPair;
        newGameField.cells[i][j].isHightlighted = true;
      }

      return newGameField;
    });
  }



  // wrapping bot-user move with async fn to make his move be made with time-delay
  async function makeBotUserMove() {
    await new Promise((resolve => setTimeout(resolve, 1000))); // making bot users move with a delay
    const [i, j] = getNextMoveCoordinates();
    makeMove(i, j);
    await new Promise((resolve => setTimeout(resolve, 600))); // waiting till icon will finish its animation in the cell where bot-user made a move 
  }



  function checkIfWon() {
    let hasCurrentPlayerWon = false;

    for (let i = 0; i < 3; i++) {
      if (gameField.cells[i][0].value === currentPlayer.moveValue 
        && gameField.cells[i][1].value === currentPlayer.moveValue 
        && gameField.cells[i][2].value === currentPlayer.moveValue
      ) {
          hasCurrentPlayerWon = true;
          setIsGameFinishedBy({ type: 'row-won', rowIndex: i });
      }
    }

    for (let j = 0; j < 3; j++) {
      if (gameField.cells[0][j].value === currentPlayer.moveValue 
        && gameField.cells[1][j].value === currentPlayer.moveValue 
        && gameField.cells[2][j].value === currentPlayer.moveValue
      ) {
          hasCurrentPlayerWon = true;
          setIsGameFinishedBy({ type: 'col-won', colIndex: j });
      }
    }

    if (gameField.cells[0][0].value === currentPlayer.moveValue 
        && gameField.cells[1][1].value === currentPlayer.moveValue 
        && gameField.cells[2][2].value === currentPlayer.moveValue 
      ) {
      hasCurrentPlayerWon = true;
      setIsGameFinishedBy({ type: 'diagonal-won', diagonalType: 'left' });
    }
    if (gameField.cells[0][2].value === currentPlayer.moveValue 
        && gameField.cells[1][1].value === currentPlayer.moveValue 
        && gameField.cells[2][0].value === currentPlayer.moveValue 
      ) {
      hasCurrentPlayerWon = true;
      setIsGameFinishedBy({ type: 'diagonal-won', diagonalType: 'right' });
    }

    
    if (hasCurrentPlayerWon) {
      // if some of players won
      incrementPlayerScore(currentPlayer.name);
    }
    else if (isGameFieldFilled()) {
      // if it's draw game
      setIsGameFinishedBy({ type: 'draw-game'});
    }
    else {
      // if game still is going on - passing gamefield for move to other player
      switchToNextPlayer();
    }
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
    setCurrentPlayer((prevPlayer: Player) => {
      const prevPlayerIndex = players.findIndex( (curPlayer: Player) => curPlayer.name === prevPlayer.name );
      return players[ prevPlayerIndex === (players.length - 1) ? 0 : prevPlayerIndex + 1 ]; // setting next (or first) player as active
    });
  }



  function isGameFieldEmpty(): boolean {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (gameField.cells[i][j].value) {
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



  function resetGameField() {
    setGameField((prevGameField) => ({...prevGameField, cells: [
      [ {value: ''}, {value: ''}, {value: ''} ],
      [ {value: ''}, {value: ''}, {value: ''} ],
      [ {value: ''}, {value: ''}, {value: ''} ],
    ]}));
    
    setIsGameFinishedBy(null);

    setCurrentPlayer(players[0]);

    toogleGameFieldFreezed(false);
  }


  function makeMove(i: number, j: number) {
    setGameField( (prevGameField: GameField) => {
      const newGameField: GameField = {...prevGameField};
      newGameField.cells = [...newGameField.cells];

      newGameField.cells[ i ][ j ].value = currentPlayer.moveValue;

      return newGameField;
    });
  }



  function incrementPlayerScore(playerName: string) {
    setPlayers((prevPlayers) => prevPlayers.map((player: Player) => (player.name === playerName ? {...player, score: player.score + 1} : player)));
  }


  function handleCellOnClick(index: number, innerIndex: number) {
    if (!gameField.isFreezed) makeMove(index, innerIndex);
  }



  function handleResetOnClick() {
    if (!gameField.isFreezed) resetGameField();
  }



  return (
    <>
      <div className="bg-gray-100 dark:bg-neutral-800 flex items-center justify-center flex-col p-5 pb-10 md:p-10 md:pb-15 flex-grow rounded-3xl shadow-xl overflow-auto">

        <div className={(isGameFinishedBy ? 'scale-y-100 opacity-100 duration-200' : 'scale-y-0 opacity-0')}>
          <p className={(isGameFinishedBy ? 'animate-my-bounce' : '') + " text-[24px] min-[380px]:text-[28px] md:text-4xl text-black text-center text-grey-300 dark:text-white leading-[1.1]"}>
            <span>
              {isGameFinishedBy?.type === 'draw-game' ? <span>It's a <span className='block md:inline'>draw game</span></span> : <span><span className="font-bold max-sm:block">{currentPlayer.name}</span> has won the game!</span>}
            </span>
            
            <span className='text-xs min-[380px]:text-sm block italic mt-4'>
              new round will be started in <span className='font-bold'>{isGameFinishedBy && <CountdownTimer startTimerValue={5} onTimerFinished={resetGameField} />}</span> sec...
            </span>
          </p>
        </div>
        

        <div className="w-full max-w-[340px] min-[1600px]:max-w-md bg-white dark:bg-neutral-600 rounded-2xl shadow-lg p-4 pt-3 min-[1600px]:p-6 min-[1600px]:pt-4 mt-7 md:mt-10 min-[1600px]:mt-12">

          <span className="text-xl min-[1600px]:text-2xl font-semibold text-gray-700 dark:text-white">Score</span>

          <div className="flex justify-between items-center mb-4 relative">
            {players.map((player, playerIndex) => (
              <div className="text-center w-2/6 2xl:w-1/6 dark:text-white" key={playerIndex}>
                <div className="text-sm text-gray-500 dark:text-white">{player.name}</div>
                <div id="user-score" className="text-xl min-[1600px]:text-2xl font-bold text-gray-500 dark:text-white">{player.score}</div>
              </div>
            ))}
          </div>

          <button onClick={handleResetOnClick} className='mb-5 !text-xs' type='button'>Reset game-field</button>

          <div id="board" className="grid grid-cols-3 gap-2 md:gap-3 min-[1600px]:gap-4 aspect-square">
            { gameField && gameField.cells.map( (curCellRow: FieldCell[], index: number) => (
              curCellRow.map( (curCell: FieldCell, indexInner: number) => 
                (
                  <button onClick={() => handleCellOnClick(index, indexInner)} key={index + '-' + indexInner} 
                    className="relative overflow-hidden lowercase rounded-lg flex items-center justify-center !text-4xl font-semibold !p-0">
                      <span className={(curCell.isHightlighted ? (wonCellsColor + ' ') : '') + " duration-300 absolute flex items-center justify-center translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%] w-full h-full"}>

                          <svg className={(curCell.value === 'x' ? 'block' : 'hidden') + " w-[30%] h-[30%] min-[380px]:w-[35%] min-[380px]:h-[35%] stroke-black dark:stroke-white animate-svg"} 
                              width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path style={{'--strokeDashoffsetStart': '41', 'strokeDasharray': '41'} as React.CSSProperties} d="M3 31.2843L31.2843 3.00003" strokeWidth="5" strokeLinecap="round"/>
                            <path style={{'--strokeDashoffsetStart': '41', 'strokeDasharray': '41'} as React.CSSProperties} d="M3 3L31.2843 31.2843" strokeWidth="5" strokeLinecap="round"/>
                          </svg>

                          <svg className={(curCell.value === 'o' ? 'block' : 'hidden') + " w-[30%] h-[30%] min-[380px]:w-[35%] min-[380px]:h-[35%] stroke-black dark:stroke-white animate-svg"} 
                              width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path style={{'--strokeDashoffsetStart': '101', 'strokeDasharray': '101'} as React.CSSProperties} d="M18.5 2.5C27.3366 2.5 34.5 9.66344 34.5 18.5C34.5 27.3366 27.3366 34.5 18.5 34.5C9.66344 34.5 2.5 27.3366 2.5 18.5C2.5 9.66344 9.66344 2.5 18.5 2.5Z" strokeWidth="5"/>
                          </svg>

                      </span>
                  </button>
                ) 
              )
            )) }
          </div>
        </div>
      </div>
    </>
  )
}

export default App;
