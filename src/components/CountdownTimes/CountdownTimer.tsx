import { useEffect, useRef, useState } from 'react';

type CountdownTimerProps = {
    startTimerValue: number,
    onTimerFinished: (...args: any[]) => void;
}

export default function CountdownTimer({startTimerValue, onTimerFinished}: CountdownTimerProps) {

    const [countdownCounter, setCountdownCounter] = useState<number>(startTimerValue);

    const interval = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (countdownCounter <= 0) {
            clearInterval(interval.current!);
            onTimerFinished();
        }
    }, [countdownCounter]);

    useEffect(() => {
        interval.current = setInterval(() => setCountdownCounter((prevCounter) => prevCounter - 1), 1000);

        return () => {
            if (interval.current) clearInterval(interval.current);
        };
    }, []);

    return (
        <>
            <span>{countdownCounter}</span>
        </>
    )

}