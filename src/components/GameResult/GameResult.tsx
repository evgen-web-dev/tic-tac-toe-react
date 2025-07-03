import { useGameState } from "../../reducers/gameReducer/gameReducerContext";
import CountdownTimer from "../CountdownTimes/CountdownTimer";

type GameResultProps = {
  onGameFinishedCountdownCompleted: () => void;
};

export default function GameResult({
  onGameFinishedCountdownCompleted,
}: GameResultProps) {
  const { gameStatus, winner } = useGameState();

  const isGameFinished = gameStatus !== "playing";

  return (
    <>
      <div
        className={
          isGameFinished
            ? "scale-y-100 opacity-100 duration-200"
            : "scale-y-0 opacity-0"
        }
      >
        <p
          className={
            (isGameFinished ? "animate-my-bounce" : "") +
            " text-[24px] min-[380px]:text-[28px] md:text-4xl text-black text-center text-grey-300 dark:text-white leading-[1.1]"
          }
        >
          <span>
            {gameStatus === "draw" ? (
              <span>
                It's a <span className="block md:inline">draw game</span>
              </span>
            ) : (
              <span>
                <span className="font-bold max-sm:block">{winner?.name}</span>{" "}
                has won the game!
              </span>
            )}
          </span>

          <span className="text-xs min-[380px]:text-sm block italic mt-4">
            new round will be started in{" "}
            <span className="font-bold">
              {isGameFinished && (
                <CountdownTimer
                  startTimerValue={5}
                  onTimerFinished={onGameFinishedCountdownCompleted}
                />
              )}
            </span>{" "}
            sec...
          </span>
        </p>
      </div>
    </>
  );
}
