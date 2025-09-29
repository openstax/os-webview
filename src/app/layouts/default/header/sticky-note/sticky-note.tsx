import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {usePutAway} from '../../shared';
import './sticky-note.scss';

export type StickyNoteProps = {
    stickyData: {
        mode: 'emergency';
        emergency_content: string;
    } | object | null;
};

export default function StickyNote({stickyData}: StickyNoteProps) {
    const [closed, PutAway] = usePutAway();

    if (!stickyData || closed || !('emergency_content' in stickyData)) {
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
