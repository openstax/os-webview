import React, {useState} from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {useStickyData, useSeenCounter} from '../shared.jsx';

const SEEN_ENOUGH = 3;


export default function useStickyMicrosurveyContent() {
    const stickyData = useStickyData();
    const [hasBeenSeenEnough, incrementSeenCount] = useSeenCounter(SEEN_ENOUGH);
    const ready = Boolean(
        stickyData && stickyData.mode === 'popup' && !hasBeenSeenEnough
    );

    function StickyContent() {
        incrementSeenCount();

        return (
            <div className="microsurvey-content">
                <RawHTML className="blurb" html={stickyData.body} />
                <a className="btn primary" href={stickyData.link}>
                    {stickyData.link_text}
                </a>
            </div>
        );
    }

    return [ready, StickyContent];
}
