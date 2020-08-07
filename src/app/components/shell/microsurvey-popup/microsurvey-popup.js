import React, {useState} from 'react';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {usePutAway, useStickyData, useSeenCounter} from '../shared.jsx';
import './microsurvey-popup.css';

const SEEN_ENOUGH = 3;

function MicrodonationMicroSurvey() {
    const stickyData = useStickyData();
    const [closed, PutAway] = usePutAway();
    const [hasBeenSeenEnough, incrementSeenCount] = useSeenCounter(SEEN_ENOUGH);

    if (!stickyData || closed || stickyData.mode !== 'popup') {
        return null;
    }

    return (
        <React.Fragment>
            <PutAway />
            <div className="microsurvey-content">
                <RawHTML className="blurb" html={stickyData.body} />
                <a className="btn primary" href={stickyData.link}>
                    {stickyData.link_text}
                </a>
            </div>
        </React.Fragment>
    );
}

export default new (pageWrapper(MicrodonationMicroSurvey))();
