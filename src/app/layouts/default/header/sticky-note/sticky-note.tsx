import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {usePutAway, BannerDataWithEmergency} from '../../shared';
import './sticky-note.scss';

export default function StickyNote({bannerData}: {bannerData: BannerDataWithEmergency | null}) {
    const [closed, PutAway] = usePutAway();

    if (!bannerData || closed || bannerData.mode !== 'emergency') {
        return null;
    }

    return (
        <div
            className="sticky-note"
            data-analytics-view
            data-analytics-nudge="emergency"
            data-nudge-placement="banner"
        >
            <div className="text-content" role="alert">
                <PutAway />
                <RawHTML className="html-content" html={bannerData.emergency_content} />
            </div>
        </div>
    );
}
