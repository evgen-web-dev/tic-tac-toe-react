import React, { useEffect } from "react";


export default function useClickOutside<T extends HTMLElement>(targetRef: React.RefObject<T>, onClickOutside: () => void): void {

    function handleClick(e: Event) {
        if (targetRef.current && !targetRef.current!.contains(e.target as Node)) {
            onClickOutside();
        }
    }


    useEffect(() => {
        document.body.addEventListener('click', handleClick);

        return () => {
            document.body.removeEventListener('click', handleClick);
        }
    }, []);
}