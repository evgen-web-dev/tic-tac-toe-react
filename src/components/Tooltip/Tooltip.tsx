import { useCallback, useEffect, useRef, type ComponentProps, type ReactNode, type RefObject } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import useElementAbsolutePosition, { type ElementAbsolutePositionType, type PositionIndent } from "../../hooks/useElementAbsolutePosition";
import { createPortal } from "react-dom";


type AttachRefFn = (el: HTMLElement | null) => void;

type TooltipProps = {
    title: string,
    open: boolean,
    positionType: ElementAbsolutePositionType,
    renderContent: (attachRef: AttachRefFn) => ReactNode,
    positionIndent?: PositionIndent,
    onOpen?: () => void;
    onClose?: () => void;
} & ComponentProps<'div'>;


export default function Tooltip({ title, open, positionType, renderContent, positionIndent, onClose, onOpen }: TooltipProps) {

    const triggerRef = useRef<HTMLElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useClickOutside<HTMLElement>(triggerRef as RefObject<HTMLElement>, () => { if (onClose) { onClose(); } }, [
        'dialog[data-modal]'
    ]);

    const position = useElementAbsolutePosition(tooltipRef.current!, triggerRef.current!, positionType, positionIndent);

    const attachRef: AttachRefFn = useCallback((el: HTMLElement | null) => {
        triggerRef.current = el;
    }, []);


    useEffect(() => {
        if (onOpen) {
            onOpen();
        }
    }, []);


    useEffect(() => {
        tooltipRef.current!.style.position = 'absolute';
        tooltipRef.current!.style.top = position.top + 'px';
        tooltipRef.current!.style.left = position.left + 'px';
        tooltipRef.current!.classList.add('tooltip--placed');
    }, [position]);


    const baseCssClassPart = 'tooltip--arrow--';
    let cssPositioningClasses = positionType.includes('-')
        ? positionType.split('-').map(positionPart => baseCssClassPart + positionPart).join(' ')
        : '';
    cssPositioningClasses += (position.adjustedPositionBy ? (' ' + baseCssClassPart + 'adjusted-by-' + position.adjustedPositionBy) : '');

    return (
        <>
            {renderContent(attachRef)}
            {
                createPortal(
                    open && <div ref={tooltipRef} className={"tooltip tooltip--arrow " + cssPositioningClasses}>
                        <div className="tooltip__content animate-scale">
                            <span className="tooltip__title">{title}</span>
                        </div>
                    </div>,
                    document.getElementById('tooltips-root')!
                )
            }
        </>
    )

}