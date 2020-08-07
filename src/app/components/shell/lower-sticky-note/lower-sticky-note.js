import React, {useState} from 'react';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {usePutAway, useStickyData, useSeenCounter} from '../shared.jsx';
import './lower-sticky-note.css';

const SEEN_ENOUGH = 7;

// eslint-disable-next-line complexity
function LowerStickyNote() {
    const stickyData = useStickyData();
    const [closed, PutAway] = usePutAway();
    const [hasBeenSeenEnough, incrementSeenCount] = useSeenCounter(SEEN_ENOUGH);
    const shouldNotDisplay = !stickyData || closed || hasBeenSeenEnough ||
        stickyData.mode !== 'banner';

    if (shouldNotDisplay) {
        return null;
    }

    incrementSeenCount();

    return (
        <div className="lower-sticky-note-content">
            <PutAway />
            <div className="content">
                <h1>{stickyData.header}</h1>
                <RawHTML className="blurb" html={stickyData.body} />
                <a className="btn primary" href={stickyData.link}>
                    {stickyData.link_text}
                </a>
            </div>
        </div>
    );
}

export default new (pageWrapper(LowerStickyNote))();
