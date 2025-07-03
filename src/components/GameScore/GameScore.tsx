import { useGameState } from "../../reducers/gameReducer/gameReducerContext";

export function GameScore() {
  const { players, currentPlayer } = useGameState();

  return (
    <>
      <span className="text-xl min-[1600px]:text-2xl font-semibold text-gray-700 dark:text-white">
        Score
      </span>

      <div className="flex justify-between items-center mb-4 relative">
        {players.map((player) => (
          <div
            key={player.name}
            className={`text-center w-2/6 2xl:w-1/6 transition-all duration-300 ${
              currentPlayer.name === player.name
                ? "text-blue-600 dark:text-blue-400 scale-105"
                : "text-gray-700 dark:text-white"
            }`}
          >
            <div className="text-sm text-gray-500 dark:text-gray-300">
              {player.name}
            </div>
            <div className="text-xl min-[1600px]:text-2xl font-bold">
              {player.score}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
