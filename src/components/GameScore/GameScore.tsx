import { type State } from "../../reducers/gameReducer/gameReducer";
import { TicTacToeEngine } from "../GameResult/TicTacToeEngine";


type GameScoreProps = {
    state: State
}


export function GameScore({state}: GameScoreProps) {

    const { players } = state;

    const currentPlayer = TicTacToeEngine.getActivePlayer(players);

    return (
        <>
            <span className="text-xl min-[1600px]:text-2xl font-semibold text-gray-700 dark:text-white">Score</span>
            
            <div className="flex justify-between items-center mb-4 mt-2 relative">
                {players.map(player => (
                    <div className={"text-center w-[44%] lg:w-5/12 2xl:w-1/6 text-gray-500 dark:text-white" + (player.id === currentPlayer.id ? ' !text-blue-700 dark:!text-blue-300' : '')} key={player.id}>
                        <span title={player.name} className={"cursor-default text-xs min-[400px]:text-sm duration-200 block truncate" + (player.name === currentPlayer.name ? ' scale-[1.05]' : '')}>{player.name}</span>
                        <span id="user-score" className="text-xl min-[1600px]:text-2xl font-bold">{player.score}</span>
                    </div>
                ))}
            </div> 
        </>
    )
}