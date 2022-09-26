import LoaderPage from '~/components/jsx-helpers/loader-page';
import React from 'react';
import ProgressBar from './progress-bar/progress-bar.jsx';
import Detail from './detail/detail';
import {getDisplayStatus} from '~/helpers/errata';
import './errata-detail.scss';

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
            <div className="hero padded"><h1>Errata Submission Details</h1></div>
            <div className="boxed">
                <ProgressBarBlock data={data} />
                <ErrataDetailBlock data={data} />
            </div>
        </React.Fragment>
    );
}

export default function ErrataDetailLoader() {
    return (
        <div className="errata-detail page">
            <LoaderPage slug={window.location.pathname.substr(1)} Child={ErrataDetail} doDocumentSetup />
        </div>
    );
}
