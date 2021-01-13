import {pageWrapper} from '~/controllers/jsx-wrapper';
import {LoaderPage, useDataFromSlug, useDataFromPromise} from '~/components/jsx-helpers/jsx-helpers.jsx';
import React, {useState, useEffect} from 'react';
import {ProgressBar} from './progress-bar/progress-bar.jsx';
import {Detail} from './detail/detail';
import {getDisplayStatus} from '~/helpers/errata';
import cmsFetch from '~/models/cmsFetch';
import './errata-detail.css';

function ProgressBarBlock({data}) {
    const {status, barStatus} = getDisplayStatus(data);

    return (
        <div className="progress-bar-container body-block">
            <ProgressBar status={status} barStatus={barStatus} />
        </div>
    );
}

export function ErrataDetailBlock({data}) {
    return (
        <div className="errata-detail-block">
            <Detail data={data} />
        </div>
    );
}

function ErrataDetail({data}) {
    if (!data) {
        return null;
    }
    return (
        <React.Fragment>
            <div class="hero padded"><h1>Errata Submission Details</h1></div>
            <div class="boxed">
                <ProgressBarBlock data={data} />
                <ErrataDetailBlock data={data} />
            </div>
        </React.Fragment>
    );
}

function ErrataDetailLoader() {
    return (
        <LoaderPage slug={window.location.pathname.substr(1)} Child={ErrataDetail} doDocumentSetup />
    );
}

const view = {
    classes: ['errata-detail', 'page']
};

export default pageWrapper(ErrataDetailLoader, view);
