import { type State } from "../../reducers/gameReducer/gameReducer";
import CountdownTimer from "../CountdownTimer/CountdownTimer";


type GameResultProps = {
    state: State
    onGameFinishedCountdownCompleted: () => void;
}


export default function GameResult({ state, onGameFinishedCountdownCompleted }: GameResultProps) {

    const { isGameFinishedBy, currentPlayer } = state;

    return (
        <>
            <div className={(isGameFinishedBy ? 'scale-y-100 opacity-100 duration-200' : 'scale-y-0 opacity-0')}>
                <p className={(isGameFinishedBy ? 'animate-my-bounce' : '') + " text-[24px] min-[380px]:text-[28px] md:text-4xl text-black text-center text-grey-300 dark:text-white leading-[1.1]"}>
                    <span>
                    {isGameFinishedBy?.type === 'draw-game' ? <span>It's a <span className='block md:inline'>draw game</span></span> : <span><span className="font-bold max-sm:block">{currentPlayer.name}</span> has won the game!</span>}
                    </span>
                    
                    <span className='text-xs min-[380px]:text-sm block italic mt-4'>
                        new round will be started in <span className='font-bold'>{isGameFinishedBy && <CountdownTimer startTimerValue={5} onTimerFinished={onGameFinishedCountdownCompleted} />}</span> sec...
                    </span>
                </p>
            </div>
        </>
    )
}