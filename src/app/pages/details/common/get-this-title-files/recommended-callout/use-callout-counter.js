import React from 'react';

const MAX_CALLOUTS = 3;
const RESET_DATE = new Date('2020/01/29');

export default function useCalloutCounter(slug) {
    const [incremented, setIncremented] = React.useState(false);
    const index = React.useMemo(
        () => {
            if (slug === null) {
                throw new Error('calloutCounter: no slug set');
            }
            return `callout-${slug}`;
        },
        [slug]
    );
    const savedCount = React.useMemo(
        () => Number(window.localStorage?.getItem(index)) || 0,
        [index]
    );
    const [count, setCount] = React.useState(savedCount);
    const resetIndex = React.useMemo(
        () => `callout-reset-${slug}`,
        [slug]
    );
    const savedLastReset = React.useMemo(
        () => new Date(
            Number(window.localStorage?.getItem(resetIndex)) ||
                Number(RESET_DATE) - 100
        ),
        [resetIndex]
    );
    const [lastReset, setLastReset] = React.useState(savedLastReset);
    const showCallout = React.useMemo(
        () => count < MAX_CALLOUTS,
        [count]
    );
    const hideForever = React.useCallback(
        () => setCount(MAX_CALLOUTS),
        []
    );

    React.useEffect(
        () => {
            setIncremented(false);
            if (slug && Date.now() > RESET_DATE && lastReset < RESET_DATE) {
                setCount(0);
                setLastReset(Date.now());
            }
        },
        [slug, lastReset]
    );

    React.useEffect(
        () => {
            if (slug && !incremented) {
                setCount(count + 1);
                setIncremented(true);
            }
        },
        [slug, incremented, count]
    );

    React.useEffect(
        () => {
            window.localStorage?.setItem(resetIndex, Number(Date.now()).toString());
        },
        [resetIndex]
    );

    React.useEffect(
        () => window.localStorage?.setItem(index, count),
        [index, count]
    );

    return [showCallout, hideForever];
}
