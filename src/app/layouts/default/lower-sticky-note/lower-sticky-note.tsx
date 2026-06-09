import React from 'react';
import {
    usePutAway,
    useBannerData,
    useFilteredBanners,
    useSelectedBanner
} from '../shared';
import JITLoad from '~/helpers/jit-load';
import Cookies from 'js-cookie';

const cookieKey = 'lower-sticky-note-closed';

function useBannerToShow() {
    const bannerData = useBannerData();
    const filteredBanners = useFilteredBanners(bannerData?.bannerConfigs);
    const selectedBanner = useSelectedBanner(filteredBanners);

    if (!bannerData || bannerData.mode !== 'banner') {
        return null;
    }
    return selectedBanner;
}

export default function LowerStickyNote() {
    const bannerInfo = useBannerToShow();
    const [closed, PutAway] = usePutAway();
    const dismissed = closed || Boolean(Cookies.get(cookieKey));

    React.useEffect(() => {
        if (closed) {
            Cookies.set(cookieKey, 'true', {expires: 7});
        }
    }, [closed]);

    if (!bannerInfo || dismissed) {
        return null;
    }

    return (
        <JITLoad
            importFn={() => import('./load-lsn-content.js')}
            bannerInfo={bannerInfo}
            PutAway={PutAway as () => JSX.Element}
        />
    );
}
