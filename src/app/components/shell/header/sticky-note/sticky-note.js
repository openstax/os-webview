import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {usePutAway} from '../../shared.js';
import './sticky-note.scss';

export default function StickyNote({stickyData}) {
    const [closed, PutAway] = usePutAway();

    if (!stickyData || closed || stickyData.mode !== 'emergency') {
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
                <RawHTML className="html-content" html={stickyData.emergency_content} />
            </div>
        </div>
    );
}
