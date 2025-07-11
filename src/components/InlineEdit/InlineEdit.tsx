import { useEffect, useRef, useState, type ComponentProps, type RefObject } from "react"
import useClickOutside from "../../hooks/useClickOutside";


type CurrentMode = 'default' | 'editing';

type InlineEditProps = {
    text: string,
    maxLength: number,
    inputTextName: string,
    onTextEditFinished: (editedText: string) => void;
} & ComponentProps<'div'>

export default function InlineEdit({ text, maxLength = 30, inputTextName = 'text-to-edit', onTextEditFinished }: InlineEditProps) {

    const [textToEdit, setTextToEdit] = useState<string>(text);
    const [currentMode, setCurrentMode] = useState<CurrentMode>('default');

    const inputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useClickOutside<HTMLDivElement>(wrapperRef as RefObject<HTMLDivElement>, () => setCurrentMode('default') );

    useEffect(() => {
        if (currentMode === 'editing') {
            inputRef.current!.focus();
        }
        else {
            onTextEditFinished(textToEdit.trim());
        }
    }, [currentMode]);


    return (
        <div ref={wrapperRef} className={"inline-block cursor-pointer rounded-md px-3 py-1 border border-neutral-700/10 dark:border-neutral-400/10 " + (currentMode === 'default' ? 'hover:bg-neutral-300/30 dark:hover:bg-neutral-400/30' : '!p-0')}
            onClick={() => { setCurrentMode('editing') }}
        >
            <span className={currentMode === 'default' ? '' : 'hidden'}>{textToEdit}</span>
            <input maxLength={maxLength} className={(currentMode === 'editing' ? '' : 'hidden') + " px-3 py-1 rounded-md bg-neutral-300/50 dark:bg-neutral-500/50"} ref={inputRef} type="text" name={inputTextName} value={textToEdit} 
                    onChange={(e) => setTextToEdit(e.target.value)} />
        </div>
    )

}