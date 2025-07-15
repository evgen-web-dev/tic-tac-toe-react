import { type PropsWithChildren, type ComponentProps, useRef, useEffect, type MouseEvent } from "react"
import { createPortal } from "react-dom";
import { modalsRootElementId } from "./constants";



type ModalProps = PropsWithChildren<{
    isOpened: boolean,
    onClose: (...args: []) => void,
    onOpen?: (...args: []) => void,
}> & ComponentProps<'dialog'>

export default function Modal({ isOpened, onClose, onOpen, children }: ModalProps) {

    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (onOpen) {
            onOpen();
        }
    }, [])

    function handleOnClick(e: MouseEvent<HTMLDialogElement>) {
        if (!contentRef.current!.contains(e.target as Node)) {
            onClose();
        }
    }

    if (!isOpened) return null;

    return createPortal(
        <>
            <dialog data-modal onClick={handleOnClick} className="top-0 left-0 fixed w-screen h-screen bg-black/60 flex justify-center items-center">
                <div ref={contentRef}>
                    {children}
                </div>
            </dialog>
        </>,
        document.getElementById(modalsRootElementId)!
    )

}