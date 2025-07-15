import { useEffect, useState } from "react";


type VerticalDirection = 'top' | 'bottom';
type HorizontallDirection = 'left' | 'right' | 'center';

export type PositionIndent = {
    top: number, left: number;
}

export type ElementAbsolutePositionType = `${VerticalDirection}-${HorizontallDirection}`;

type ElementAbsolutePosition = {
    top: number, left: number, adjustedPositionBy?: 'right' | 'left';
}

export default function useElementAbsolutePosition(
    targetEl: HTMLElement, 
    positionParentEl: HTMLElement, 
    positionType: ElementAbsolutePositionType = 'bottom-center', 
    additionalIndents?: PositionIndent):
    ElementAbsolutePosition {

    const [position, setPosition] = useState<ElementAbsolutePosition>({
        top: 0, left: 0
    });


    useEffect(() => {

        if (targetEl && positionParentEl) {
            const positionToSet: ElementAbsolutePosition = {
                top: 0, left: 0
            };

            const { width: targetElWidth, height: targetElHeigt } = targetEl.getBoundingClientRect();
            const { left: positionParentElLeft, top: positionParentElTop, width: positionParentElWidth, height: positionParentElHeigt } = positionParentEl.getBoundingClientRect();

            if (positionType.includes('bottom-')) {
                positionToSet.top = (window.scrollY + positionParentElTop + targetElHeigt * 0.1 + positionParentElHeigt);
            }
            else if (positionType.includes('top-')) {
                positionToSet.top = (window.scrollY + positionParentElTop - targetElHeigt * 0.1 - positionParentElHeigt);
            }
            
            if (positionType.includes('-left')) {
                positionToSet.left = positionParentElLeft;
            }
            else if (positionType.includes('-center')) {
                positionToSet.left = positionParentElLeft + (positionParentElWidth / 2) - (targetElWidth / 2);
            }
            else if (positionType.includes('-right')) {
                positionToSet.left = positionParentElLeft + (positionParentElWidth / 1) - (targetElWidth / 1);
            }



            if ((positionToSet.left + targetElWidth) >= document.documentElement.clientWidth) {
                positionToSet.left = positionParentElLeft - targetElWidth + positionParentElWidth;
                positionToSet.adjustedPositionBy = 'right';
            }

            else if (positionToSet.left <= 0) {
                // console.log('positionParentElLeft = ', positionParentElLeft, 'positionToSet.left = ', positionToSet.left)
                positionToSet.left = positionParentElLeft;
                positionToSet.adjustedPositionBy = 'left';
                // console.log('positionParentElLeft = ', positionParentElLeft, 'positionToSet.left = ', positionToSet.left)
            }

            positionToSet.top += (additionalIndents?.top || 0);
            positionToSet.left += (additionalIndents?.left || 0);

            setPosition(() => ({ ...positionToSet }))
        }

        // return () => {

        // }
    }, [targetEl, positionParentEl]);


    return position;
}