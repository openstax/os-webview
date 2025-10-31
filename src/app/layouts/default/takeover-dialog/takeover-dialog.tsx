import React from 'react';
import JITLoad from '~/helpers/jit-load';
import {useDataFromSlug, camelCaseKeys} from '~/helpers/page-data-utils';
import {TakeoverData} from './common';

const RECENT_DELTA_MS = 16 * 60 * 60 * 1000; // 16 hours
const LS_KEY = 'takeoverLastDisplay';

function deserialize(key: string) {
    try {
        return JSON.parse(window.localStorage.getItem(key) || 'null');
    } catch {
        return null;
    }
}

function useLocalStorage(key: string, defaultValue: number) {
    const storedValue = deserialize(key);
    const initialValue = storedValue === null ? defaultValue : storedValue;
    const [value, setValue] = React.useState(initialValue);

    React.useEffect(
        () => window.localStorage?.setItem(key, JSON.stringify(value)),
        [key, value]
    );

    return [value, setValue] as const;
}

function useDisplayedRecently() {
    const [lastDisplay, setLastDisplay] = useLocalStorage(LS_KEY, 0);
    const msSince = Date.now() - Number(lastDisplay);
    const setDisplayed = React.useCallback(
        () => setLastDisplay(Date.now()),
        [setLastDisplay]
    );

    return [msSince < RECENT_DELTA_MS, setDisplayed] as const;
}

export default function TakeOverDialogGateKeeper() {
    const rawData = camelCaseKeys(useDataFromSlug('donations/fundraiser'));
    const [data] = rawData ? ([] as Array<unknown>).concat(rawData) : [];
    const [displayedRecently, setDisplayed] = useDisplayedRecently();

    if (!data || displayedRecently) {
        return null;
    }

    return (
        <JITLoad
            importFn={() => import('./import-takeover-dialog-content.js')}
            data={data as TakeoverData}
            setDisplayed={setDisplayed}
        />
    );
}
