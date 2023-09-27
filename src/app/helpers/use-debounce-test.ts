import React from 'react';

export default function useDebounceTest(test: boolean, delay = 50) {
    const timerRef = React.useRef<number | undefined>();
    const [timedOut, setTimedOut] = React.useState(false);

    React.useEffect(() => {
        if (timerRef.current && !test) {
            window.clearTimeout(timerRef.current);
            setTimedOut(false);
        }
        if (!timerRef.current && test) {
            timerRef.current = window.setTimeout(
                () => setTimedOut(true),
                delay
            );
        }

        return () => window.clearTimeout(timerRef.current);
    }, [test, delay]);

    return timedOut;
}
