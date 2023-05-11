import React from 'react';
import {PutAway} from '../shared.js';
import useMSQueue from './queue';
import './microsurvey-popup.scss';

export default function MicroSurvey() {
    const [QueuedItem, nextItem] = useMSQueue();

    if (!QueuedItem) {
        return null;
    }

    return (
        <React.Fragment>
            <QueuedItem onDone={nextItem}>
                <PutAway onClick={nextItem} />
            </QueuedItem>
        </React.Fragment>
    );
}
