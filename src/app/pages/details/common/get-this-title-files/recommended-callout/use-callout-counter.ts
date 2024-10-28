import React from 'react';

const MAX_CALLOUTS = 3;
const RESET_DATE = new Date('2020/01/29');

export default function useCalloutCounter(
    slug: string
): [show: boolean, hideForever: () => void] {
    const [incremented, setIncremented] = React.useState(false);
    const index = `callout-${slug}`;
    const savedCount = React.useMemo(
        () => Number(window.localStorage?.getItem(index)) || 0,
        [index]
    );
    const [count, setCount] = React.useState(savedCount);
    const resetIndex = `callout-reset-${slug}`;
    const savedLastReset = React.useMemo(
        () =>
            new Date(
                Number(window.localStorage?.getItem(resetIndex)) ||
                    Number(RESET_DATE) - 100
            ),
        [resetIndex]
    );
    const [lastReset, setLastReset] = React.useState(savedLastReset);
    const showCallout = React.useMemo(() => count < MAX_CALLOUTS, [count]);
    const hideForever = React.useCallback(() => setCount(MAX_CALLOUTS), []);

    React.useEffect(() => {
        setIncremented(false);
        const now = new Date(Date.now());

        if (slug && now > RESET_DATE && lastReset < RESET_DATE) {
            setCount(0);
            setLastReset(now);
        }
    }, [slug, lastReset]);

    React.useEffect(() => {
        if (slug && !incremented) {
            setCount(count + 1);
            setIncremented(true);
        }
    }, [slug, incremented, count]);

    React.useEffect(() => {
        window.localStorage?.setItem(resetIndex, Number(Date.now()).toString());
    }, [resetIndex]);

    React.useEffect(
        () => window.localStorage?.setItem(index, count.toString()),
        [index, count]
    );

    return [showCallout, hideForever];
}
