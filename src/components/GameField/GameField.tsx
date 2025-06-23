import { useGameState } from "../../GameProvider"
import type { FieldCell } from "../../types/types";


type GameFieldProps = {
    onMove: (i: number, j: number) => void;
}


export function GameField({ onMove }: GameFieldProps) {

    const { gameField, wonCellsColor } = useGameState();

    return (
        <>
            <div id="board" className="grid grid-cols-3 gap-2 md:gap-3 min-[1600px]:gap-4 aspect-square">

                {gameField && gameField.cells.map((curCellRow: FieldCell[], index: number) => (

                    curCellRow.map((curCell: FieldCell, indexInner: number) =>
                    (
                        <button onClick={() => onMove(index, indexInner)} key={index + '-' + indexInner}
                            className="relative overflow-hidden lowercase rounded-lg flex items-center justify-center !text-4xl font-semibold !p-0">
                            <span className={(curCell.isHightlighted ? (wonCellsColor + ' ') : '') + " duration-300 absolute flex items-center justify-center translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%] w-full h-full"}>

                                <svg className={(curCell.value === 'x' ? 'block' : 'hidden') + " w-[30%] h-[30%] min-[380px]:w-[35%] min-[380px]:h-[35%] stroke-black dark:stroke-white animate-svg"}
                                    width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path style={{ '--strokeDashoffsetStart': '41', 'strokeDasharray': '41' } as React.CSSProperties} d="M3 31.2843L31.2843 3.00003" strokeWidth="5" strokeLinecap="round" />
                                    <path style={{ '--strokeDashoffsetStart': '41', 'strokeDasharray': '41' } as React.CSSProperties} d="M3 3L31.2843 31.2843" strokeWidth="5" strokeLinecap="round" />
                                </svg>

                                <svg className={(curCell.value === 'o' ? 'block' : 'hidden') + " w-[30%] h-[30%] min-[380px]:w-[35%] min-[380px]:h-[35%] stroke-black dark:stroke-white animate-svg"}
                                    width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path style={{ '--strokeDashoffsetStart': '101', 'strokeDasharray': '101' } as React.CSSProperties} d="M18.5 2.5C27.3366 2.5 34.5 9.66344 34.5 18.5C34.5 27.3366 27.3366 34.5 18.5 34.5C9.66344 34.5 2.5 27.3366 2.5 18.5C2.5 9.66344 9.66344 2.5 18.5 2.5Z" strokeWidth="5" />
                                </svg>

                            </span>
                        </button>
                    )
                    )
                )
                
                )}

            </div>
        </>
    )

}