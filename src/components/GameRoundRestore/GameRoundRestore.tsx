import { useEffect, useState, type ActionDispatch } from "react"
import type { Action, State } from "../../reducers/gameReducer/gameReducer";
import { TicTacToeEngine } from "../GameResult/TicTacToeEngine";
import Modal from "../Modal/Modal";

type GameRoundRestoreProps = {
    state: State,
    dispatch: ActionDispatch<[Action]>
}


export default function GameRoundRestore({ state, dispatch }: GameRoundRestoreProps) {
    const [openRestoreBoardUI, setOpenRestoreBoardUI] = useState<boolean>(false);

    useEffect(() => {
        const gameEngine = new TicTacToeEngine(state).clone();
        if (gameEngine.getSavedBoardFromLocalStorage() !== null) {
            setOpenRestoreBoardUI(true);
        }
    }, []);


    function handleOnRestore(toRestore: boolean) {
        dispatch({ type: 'tryRestoreGameFieldBoard', payload: { toRestore: toRestore } });
        setOpenRestoreBoardUI(false);
    }


    if (!openRestoreBoardUI) return null;

    return (
        <>
            <Modal isOpened={openRestoreBoardUI} onClose={() => setOpenRestoreBoardUI(false)}>
                <div className="w-[95vw] md:w-[450px] rounded-xl bg-white dark:bg-neutral-800 p-6 lg:p-8">
                    <h2 className="text-2xl">Note</h2>

                    <p className="mt-6">There is unfinished game-round saved.</p>
                    <p>Would you like to <span className="font-bold">restore it</span> or <span className="font-bold">start a new round</span>?</p>

                    <div className="mt-10 flex gap-4">
                        <button type="submit" onClick={() => handleOnRestore(true)} id="restore-game" className="button">Restore</button>
                        <button type="button" onClick={() => handleOnRestore(false)} id="play-new-game" className="button">New Round</button>
                    </div>
                </div>
            </Modal>
        </>
    )
}