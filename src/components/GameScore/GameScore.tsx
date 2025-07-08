import { type State } from "../../reducers/gameReducer/gameReducer";

type GameScoreProps = {
    state: State
}


export function GameScore({state}: GameScoreProps) {

    const { players, currentPlayer } = state;

    return (
        <>
            <span className="text-xl min-[1600px]:text-2xl font-semibold text-gray-700 dark:text-white">Score</span>
            
            <div className="flex justify-between items-center mb-4 relative">
                {players.map((player, playerIndex) => (
                    <div className={"text-center w-2/6 2xl:w-1/6 text-gray-500 dark:text-white" + (player.name === currentPlayer.name ? ' !text-blue-700' : '')} key={playerIndex}>
                        <div className={"text-sm duration-200" + (player.name === currentPlayer.name ? ' scale-[1.05]' : '')}>{player.name}</div>
                        <div id="user-score" className="text-xl min-[1600px]:text-2xl font-bold">{player.score}</div>
                    </div>
                ))}
            </div> 
        </>
    )
}