import React, { useEffect } from "react";


export default function useClickOutside<T extends HTMLElement>(targetRef: React.RefObject<T>, onClickOutside: () => void, ignoredElementsSelectors: string[] = []): void {

    function handleClick(e: Event) {
        if (targetRef.current && !targetRef.current!.contains(e.target as Node)) {
            let passedIgnoredElements = true;

            for (const ignoredElSelector of ignoredElementsSelectors) {
                if ((e.target as Element).closest(ignoredElSelector)) {
                    passedIgnoredElements = false;
                    break;
                }
            }

            if (passedIgnoredElements) {
                onClickOutside();
            }
        }
    }


    useEffect(() => {
        document.body.addEventListener('click', handleClick);

        return () => {
            document.body.removeEventListener('click', handleClick);
        }
    }, []);
}