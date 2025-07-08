import { type State } from "../../reducers/gameReducer/gameReducer";
import { type FieldCell } from "../../types/types";
import GameFieldCell from "../GameFieldCell/GameFieldCell";


type GameFieldProps = {
    state: State;
    onMove: (i: number, j: number) => void;
}


export function GameField({ state, onMove }: GameFieldProps) {

    const { gameField } = state;

    return (
        <>
            <div id="board" className="grid grid-cols-3 gap-2 md:gap-3 min-[1600px]:gap-4 aspect-square">

                {gameField && gameField.board.map((curCellRow: FieldCell[], index: number) => (

                    curCellRow.map((curCell: FieldCell, indexInner: number) => (
                        <GameFieldCell 
                            state={state}
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