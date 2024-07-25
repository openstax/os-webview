import React from 'react';
import {usePutAway, useStickyData} from '../shared.js';
import {useLocation} from 'react-router-dom';
import JITLoad from '~/helpers/jit-load';

function useIsTemporarilyBanned() {
    const {pathname} = useLocation();
    const econBanUntil = new Date('2024-05-16').valueOf();
    const inBanPeriod = Date.now().valueOf() < econBanUntil;

    return ((/princ.*econ.*/).test(pathname) && inBanPeriod);
}

export default function LowerStickyNote() {
    const stickyData = useStickyData();
    const [closed, PutAway] = usePutAway();
    const isTemporarilyBanned = useIsTemporarilyBanned();
    const shouldNotDisplay = !stickyData || closed ||
        isTemporarilyBanned ||
        stickyData.mode !== 'banner';

    if (shouldNotDisplay) {
        return null;
    }

    return (
        <JITLoad
            importFn={() => import('./lsn-content')} stickyData={stickyData}
            PutAway={PutAway}
        />
    );
}
