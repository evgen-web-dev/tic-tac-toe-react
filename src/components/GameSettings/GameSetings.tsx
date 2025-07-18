import { useState, type ActionDispatch, type ChangeEvent, type ComponentProps, type PropsWithChildren, type ReactNode } from "react"
import Modal from "../Modal/Modal";
import type { Action, State } from "../../reducers/gameReducer/gameReducer";
import type { DifficultyLevel } from "../../types/types";
import { slugify } from "../../utils/utils";
import InlineEdit from "../InlineEdit/InlineEdit";
import { difficultyLevelInputName, newUserNameInputName } from "./constants";
import { TicTacToeEngine } from "../GameResult/TicTacToeEngine";
import GameScoreResetModal from "../GameScoreResetModal/GameScoreResetModal";
import { type GameScoreResetType } from "../GameScoreResetModal/types";
import Tooltip from "../Tooltip/Tooltip";



type GameSettingsProps = PropsWithChildren<{
    state: State,
    dispatch: ActionDispatch<[Action]>
}> & ComponentProps<'div'>;


export default function GameSettings({ state, dispatch, className }: GameSettingsProps) {
    const { difficultyLevel, players } = state;

    const userPlayer = players.find(player => !player.isAutomated)!;

    const [isSettingsModalOpened, setIsSettingsModalOpened] = useState<boolean>(false);
    const [isResetScoreModalOpened, setIsResetScoreModalOpened] = useState<boolean>(false);

    const [newDifficultyLevel, setNewDifficultyLevel] = useState<DifficultyLevel>(difficultyLevel || 'simple');
    const [newUserName, setNewUserName] = useState<string>(userPlayer.name);

    const [scoreResetType, setResetScoreType] = useState<GameScoreResetType>('manual');

    const [isTooltipOpened, setIsTooltipOpened] = useState<boolean>(true);


    function handleOnClose() {
        setNewDifficultyLevel(difficultyLevel);
        setNewUserName(userPlayer.name);
        setIsSettingsModalOpened(false);
    }

    function handleOnDifficultyLevelChange(e: ChangeEvent<HTMLInputElement>) {
        setNewDifficultyLevel((e.target.value || 'simple') as DifficultyLevel);
    }

    function handleOnUserNameChange(newName: string) {
        setNewUserName(newName);
    }

    function handleOnSave(formData: FormData) {
        const newLevel = (formData.get(difficultyLevelInputName)?.toString() || 'simple') as DifficultyLevel;
        const newNameForUser = formData.get(newUserNameInputName)?.toString() || TicTacToeEngine.userPlayerDefaultName;

        if (newNameForUser !== userPlayer.name) {
            setResetScoreType('user-name-triggered');
            setIsResetScoreModalOpened(true);
        }

        dispatch({ type: 'setDifficultyLevelAction', payload: { level: newLevel } });
        dispatch({ type: 'setUserName', payload: { newName: newNameForUser } });

        setIsSettingsModalOpened(false);
    }

    function handleScoreResetModalOnClose(toReset: boolean) {
        if (toReset) {
            dispatch({ type: 'resetGameScore' });
        }
        setIsResetScoreModalOpened(false);
        setResetScoreType('manual'); // resetting to default
    }


    const levels: DifficultyLevel[] = ['simple', 'hard'];

    const settingsSections: Array<{ title: string, settingsUI: ReactNode }> = [
        {
            title: 'Your Name',
            settingsUI: <div className="mt-5">
                <InlineEdit maxLength={20} inputTextName={newUserNameInputName} text={newUserName}
                    onTextEditFinished={handleOnUserNameChange} />
            </div>
        },
        {
            title: 'Difficulty Level',
            settingsUI: <div className="mt-4 flex items-center gap-5">
                {levels && levels.map((level) =>
                (
                    <div key={level} className="flex items-center">
                        <input onChange={handleOnDifficultyLevelChange} checked={newDifficultyLevel === level} id={`${level}-level`} type="radio" value={level} name={difficultyLevelInputName}
                            className="" />
                        <label htmlFor={`${level}-level`} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 capitalize">{`${level} level`}</label>
                    </div>
                ))}
            </div>
        },
        {
            title: 'Reset Game Score',
            settingsUI: <div className="mt-5">
                <button type="button" onClick={() => setIsResetScoreModalOpened(true)} className="button !text-xs">Reset game-score</button>
            </div>
        },
    ];


    return (
        <div className={className}>
            <Tooltip
                positionType="bottom-right"
                renderContent={attachRef => (
                    <button ref={attachRef} onClick={() => setIsSettingsModalOpened(true)} type="button"
                        className="w-9 h-9 md:w-10 md:h-10 p-1.5 rounded-md flex items-center justify-center">
                        <svg className="w-full h-auto block stroke-black dark:stroke-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path strokeWidth="2" d="M20 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6h-2m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4" />
                        </svg>
                    </button>
                )}
                onClose={() => setIsTooltipOpened(false)} 
                title="Game settings & customizations can be found here" 
                open={isTooltipOpened}
                positionIndent={{top: 0, left: -7}}
            />

            <GameScoreResetModal isOpened={isResetScoreModalOpened} resetType={scoreResetType} onClosed={handleScoreResetModalOnClose} />

            <Modal isOpened={isSettingsModalOpened} onClose={handleOnClose}>
                <div className="w-[95vw] md:w-[500px] rounded-xl bg-white dark:bg-neutral-800 p-6 lg:p-8 max-h-[86vh] overflow-auto">

                    <form action={handleOnSave}>
                        <div>
                            {settingsSections && settingsSections.map((section) => (
                                <div className="mb-10 last:mb-0 p-5 border border-neutral-400/30 dark:border-neutral-400/10 rounded-lg" key={slugify(section.title)}>
                                    <h2 className="text-2xl block">{section.title}</h2>
                                    {section.settingsUI}
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 flex justify-start gap-4">
                            <button type="submit" id="game-settings-save" className="button">Save</button>
                            <button type="button" onClick={handleOnClose} id="game-settings-cancel" className="button">Cancel</button>
                        </div>
                    </form>

                </div>
            </Modal>
        </div>
    )
}