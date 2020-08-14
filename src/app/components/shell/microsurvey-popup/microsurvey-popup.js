import React, {useState} from 'react';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import {PutAway} from '../shared.jsx';
import useMSQueue from './queue';
import './microsurvey-popup.css';

function MicroSurvey() {
    const [QueuedItem, nextItem] = useMSQueue();

    if (!QueuedItem) {
        return null;
    }

    return (
        <React.Fragment>
            <PutAway onClick={nextItem}/>
            <QueuedItem />
        </React.Fragment>
    );
}

export default new (pageWrapper(MicroSurvey))();
