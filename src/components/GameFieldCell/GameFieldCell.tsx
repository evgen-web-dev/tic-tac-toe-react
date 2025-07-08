import { type State } from "../../reducers/gameReducer/gameReducer";
import { type FieldCell } from "../../types/types";


type GameFieldCellProps = {
    state: State
    cellValue: FieldCell;
    onCellMove: () => void;
}


export default function GameFieldCell({ state, cellValue, onCellMove }: GameFieldCellProps) {

    const { wonCellsColor } = state;

    const commonSvgClasses = ' w-[30%] h-[30%] min-[380px]:w-[35%] min-[380px]:h-[35%] stroke-black dark:stroke-white animate-svg';

    /*
    --strokeDashoffsetStart for <path /> elements is needed for animate-svg-content-stroke animation - for defining 
    starting value in @keyframe by taking starting value from <path /> element itself via localized css-variable,
    so starting point for animating stroke-dashoffset css-prop is not hardcoded, but dynamical for every <path />
    */

    return (
        <>
            <button 
                onClick={onCellMove}
                className="relative overflow-hidden lowercase rounded-lg flex items-center justify-center !text-4xl font-semibold !p-0">
                
                <span className={(cellValue.isHightlighted ? (wonCellsColor + ' ') : '') 
                    + " duration-300 absolute flex items-center justify-center translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%] w-full h-full"}>

                    <svg className={(cellValue.value === 'x' ? 'block' : 'hidden') + commonSvgClasses}
                        width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">

                        <path style={{ '--strokeDashoffsetStart': '41', 'strokeDasharray': '41' } as React.CSSProperties} 
                            d="M3 31.2843L31.2843 3.00003" strokeWidth="5" strokeLinecap="round" />
                        <path style={{ '--strokeDashoffsetStart': '41', 'strokeDasharray': '41' } as React.CSSProperties} 
                            d="M3 3L31.2843 31.2843" strokeWidth="5" strokeLinecap="round" />
                    </svg>

                    <svg className={(cellValue.value === 'o' ? 'block' : 'hidden') + commonSvgClasses}
                        width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                        
                        <path style={{ '--strokeDashoffsetStart': '101', 'strokeDasharray': '101' } as React.CSSProperties} 
                            d="M18.5 2.5C27.3366 2.5 34.5 9.66344 34.5 18.5C34.5 27.3366 27.3366 34.5 18.5 34.5C9.66344 34.5 2.5 27.3366 2.5 18.5C2.5 9.66344 9.66344 2.5 18.5 2.5Z" 
                            strokeWidth="5" />
                    </svg>

                </span>

            </button>
        </>
    )

}