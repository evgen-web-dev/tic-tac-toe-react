import { useGameState } from "../../reducers/gameReducer/gameReducerContext"
import { type FieldCell } from "../../types/types";
import GameFieldCell from "../FieldCell/GameFieldCell";


type GameFieldProps = {
    onMove: (i: number, j: number) => void;
}


export function GameField({ onMove }: GameFieldProps) {

    const { gameField } = useGameState();

    return (
        <>
            <div id="board" className="grid grid-cols-3 gap-2 md:gap-3 min-[1600px]:gap-4 aspect-square">

                {gameField && gameField.cells.map((curCellRow: FieldCell[], index: number) => (

                    curCellRow.map((curCell: FieldCell, indexInner: number) => (
                        <GameFieldCell 
                            key={index + '-' + indexInner}
                            cellValue={curCell} 
                            onCellMove={() => onMove(index, indexInner)} 
                        />
                    ))

                ) )}

            </div>
        </>
    )

}