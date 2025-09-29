import React from 'react';
import JITLoad from '~/helpers/jit-load';
import {useDataFromSlug, camelCaseKeys} from '~/helpers/page-data-utils';
import type {TakeoverData} from './common';

const RECENT_DELTA_MS = 16 * 60 * 60 * 1000; // 16 hours
const LS_KEY = 'takeoverLastDisplay';

function deserialize(key: string): unknown {
    try {
        return JSON.parse(window.localStorage.getItem(key) || '');
    } catch {
        return null;
    }
}

function useLocalStorage(key: string, defaultValue: string | number = ''): [
    string | number,
    React.Dispatch<React.SetStateAction<string | number>>
] {
    const storedValue = deserialize(key);
    const initialValue = storedValue === null ? defaultValue : storedValue;
    const [value, setValue] = React.useState<string | number>(initialValue as string | number);

    React.useEffect(
        () => window.localStorage?.setItem(key, JSON.stringify(value)),
        [key, value]
    );

    return [value, setValue];
}

function useDisplayedRecently(): [boolean, () => void] {
    const [lastDisplay, setLastDisplay] = useLocalStorage(LS_KEY, 0);
    const msSince = Date.now() - (lastDisplay as number);
    const setDisplayed = React.useCallback(
        () => setLastDisplay(Date.now()),
        [setLastDisplay]
    );

    return [msSince < RECENT_DELTA_MS, setDisplayed];
}

export default function TakeOverDialogGateKeeper() {
    const [data] = ([] as unknown[]).concat(camelCaseKeys(useDataFromSlug('donations/fundraiser')));
    const [displayedRecently, setDisplayed] = useDisplayedRecently();

    if (!data || displayedRecently) {
        return null;
    }

    return (
        <JITLoad
            importFn={() => import('./load-content.js')}
            data={data as TakeoverData} setDisplayed={setDisplayed}
        />
    );
}
