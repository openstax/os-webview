import React from 'react';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {usePutAway, useStickyData} from '../../shared.jsx';
import './sticky-note.css';

function StickyNote() {
    const stickyData = useStickyData();
    const [closed, PutAway] = usePutAway();

    if (!stickyData || closed || stickyData.mode !== 'emergency') {
        return null;
    }

    return (
        <div className="sticky-note">
            <div class="text-content" role="alert">
                <PutAway />
                <RawHTML className="html-content" html={stickyData.emergency_content} />
            </div>
        </div>
    );
}

export default new (pageWrapper(StickyNote))();
