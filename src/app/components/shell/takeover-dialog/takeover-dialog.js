import React from 'react';
import JITLoad from '~/helpers/jit-load';
import {useDataFromSlug} from '~/components/jsx-helpers/jsx-helpers.jsx';
import $ from '~/helpers/$';

const RECENT_DELTA_MS = 16 * 60 * 60 * 1000; // 16 hours
const LS_KEY = 'takeoverLastDisplay';

function deserialize(key) {
    try {
        return JSON.parse(window.localStorage.getItem(key));
    } catch {
        return null;
    }
}

function useLocalStorage(key, defaultValue='') {
    const storedValue = deserialize(key);
    const initialValue = storedValue === null ? defaultValue : storedValue;
    const [value, setValue] = React.useState(initialValue);

    React.useEffect(
        () => window.localStorage.setItem(key, JSON.stringify(value)),
        [key, value]
    );

    return [value, setValue];
}

function useDisplayedRecently() {
    const [lastDisplay, setLastDisplay] = useLocalStorage(LS_KEY, 0);
    const msSince = Date.now() - lastDisplay;
    const setDisplayed = React.useCallback(
        () => setLastDisplay(Date.now()),
        [setLastDisplay]
    );

    return [msSince < RECENT_DELTA_MS, setDisplayed];
}

export default function TakeOverDialogGateKeeper() {
    const [data] = [].concat($.camelCaseKeys(useDataFromSlug('donations/fundraiser')));
    const [displayedRecently, setDisplayed] = useDisplayedRecently();

    if (!data || displayedRecently) {
        return null;
    }

    return (
        <JITLoad
            importFn={() => import('./takeover-dialog-content')}
            data={data} setDisplayed={setDisplayed}
        />
    );
}
