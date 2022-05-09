import React from 'react';
import {usePutAway, useStickyData} from '../shared.jsx';
import JITLoad from '~/helpers/jit-load';

export default function LowerStickyNote() {
    const stickyData = useStickyData();
    const [closed, PutAway] = usePutAway();
    const shouldNotDisplay = !stickyData || closed ||
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
