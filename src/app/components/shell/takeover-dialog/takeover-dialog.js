import React from 'react';
import {useDialog} from '~/components/dialog/dialog';
import {useDataFromSlug} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {TakeoverContextProvider} from './takeover-context';
import {useLocation} from 'react-router-dom';
import $ from '~/helpers/$';
import cn from 'classnames';
import DesktopContent from './content-desktop';
import MobileContent from './content-mobile';
import './takeover-dialog.scss';

const RECENT_DELTA_MS = 16 * 60 * 60 * 1000; // 16 hours
const LS_KEY = 'takeoverLastDisplay';

function useLocalStorage(key, defaultValue='') {
    const storedValue = JSON.parse(window.localStorage.getItem(key));
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

export default function TakeoverBanner() {
    const [Dialog, _, close, isOpen] = useDialog(true);
    const [displayedRecently, setDisplayed] = useDisplayedRecently();
    const [data] = [].concat($.camelCaseKeys(useDataFromSlug('donations/fundraiser')));
    const location = useLocation();
    const initialLoc = React.useRef(location);

    React.useEffect(() => {
        if (location !== initialLoc.current) {
            close();
        }
    }, [location, initialLoc, close]);

    React.useEffect(
        () => {
            if (!isOpen) {
                setDisplayed();
            }
        },
        [isOpen, setDisplayed]
    );

    if (!data || displayedRecently) {
        return null;
    }


    data.image = data.fundraiserImage;
    return (
        <Dialog className={cn('takeover-dialog', data.colorScheme)}>
            <TakeoverContextProvider contextValueParameters={{close}}>
                <DesktopContent data={data} />
                <MobileContent data={data} />
            </TakeoverContextProvider>
        </Dialog>
    );
}
