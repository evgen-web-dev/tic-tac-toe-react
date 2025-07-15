import type { ReactNode } from "react";
import Modal from "../Modal/Modal"
import type { GameScoreResetType } from "./types";


type GameScoreResetModalProps = {
    isOpened: boolean,
    onClosed: (toRestore: boolean) => void;
    heading?: string,
    text?: ReactNode,
    resetType?: GameScoreResetType
}


export default function GameScoreResetModal({ isOpened, resetType = 'manual', onClosed }: GameScoreResetModalProps) {

    let textContent: string = ''; 
    switch (resetType) {
        case 'manual': textContent = 'Please confirm or cancel resetting game-score'; break;
        case 'user-name-triggered': textContent = 'Your name was changed. Do you want to reset current game-score?'; break;
    }

    return (
        <>
            <Modal isOpened={isOpened} onClose={() => onClosed(false)}>
                <div className="w-[95vw] md:w-[450px] rounded-xl bg-white dark:bg-neutral-800 p-6 lg:p-8">
                    <h2 className="text-2xl">Game Score Reset</h2>

                    <p className="mt-6">{textContent}</p>

                    <div className="mt-10 flex gap-4">
                        <button type="submit" onClick={() => onClosed(true)} id="restore-game" className="button">Reset</button>
                        <button type="button" onClick={() => onClosed(false)} id="play-new-game" className="button">Cancel</button>
                    </div>
                </div>
            </Modal>
        </>
    )
}