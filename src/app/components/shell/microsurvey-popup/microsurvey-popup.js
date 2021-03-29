import React, {useState} from 'react';
import {PutAway} from '../shared.jsx';
import useMSQueue from './queue';
import './microsurvey-popup.css';

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
