import React from 'react';
import {PutAway} from '../shared';
import useMSQueue from './queue';
import './microsurvey-popup.scss';

export default function MicroSurvey() {
    const [QueuedItem, nextItem] = useMSQueue();

    if (!QueuedItem) {
        return null;
    }

    return (
        <div id='microsurvey'>
            <QueuedItem onDone={nextItem}>
                <PutAway onClick={nextItem} />
            </QueuedItem>
        </div>
    );
}

const SF_DURATION = 200; // sticky-footer animation duration
