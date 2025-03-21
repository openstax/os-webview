import React from 'react';
import {usePutAway, useStickyData} from '../shared';
import JITLoad from '~/helpers/jit-load';
import Cookies from 'js-cookie';

const cookieKey = 'lower-sticky-note-closed';

export default function LowerStickyNote() {
    const stickyData = useStickyData();
    const [closed, PutAway] = usePutAway();
    const shouldNotDisplay =
        !stickyData ||
        closed ||
        stickyData?.mode !== 'banner' ||
        Boolean(Cookies.get(cookieKey));

    React.useEffect(() => {
        if (closed) {
            Cookies.set(cookieKey, 'true', {expires: 7});
        }
    }, [closed]);

    if (shouldNotDisplay) {
        return null;
    }

    return (
        <JITLoad
            importFn={() => import('./load-lsn-content.js')}
            stickyData={stickyData}
            PutAway={PutAway as () => JSX.Element}
        />
    );
}
