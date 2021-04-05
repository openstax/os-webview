import React from 'react';
import {PutAway} from '../shared.jsx';
import useMSQueue from './queue';
import './microsurvey-popup.scss';

export default function MicroSurvey() {
    const [QueuedItem, nextItem] = useMSQueue();

    if (!QueuedItem) {
        return null;
    }

    return (
        <React.Fragment>
            <PutAway onClick={nextItem} />
            <QueuedItem onDone={nextItem} />
        </React.Fragment>
    );
}
