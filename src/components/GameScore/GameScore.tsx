import { useGameState } from "../../reducers/gameReducer/gameReducerContext"

type GameScoreProps = {

}


export function GameScore({}: GameScoreProps) {

    const { players } = useGameState();

    return (
        <>
            <span className="text-xl min-[1600px]:text-2xl font-semibold text-gray-700 dark:text-white">Score</span>
            
            <div className="flex justify-between items-center mb-4 relative">
                {players.map((player, playerIndex) => (
                    <div className="text-center w-2/6 2xl:w-1/6 dark:text-white" key={playerIndex}>
                        <div className="text-sm text-gray-500 dark:text-white">{player.name}</div>
                        <div id="user-score" className="text-xl min-[1600px]:text-2xl font-bold text-gray-500 dark:text-white">{player.score}</div>
                    </div>
                ))}
            </div> 
        </>
    )
}