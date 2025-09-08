import LoaderPage from '~/components/jsx-helpers/loader-page';
import React from 'react';
import ProgressBar from './progress-bar/progress-bar';
import Detail from './detail/detail';
import {getDisplayStatus, Errata} from '~/helpers/errata';
import {useLocation} from 'react-router-dom';
import './errata-detail.scss';


function ProgressBarBlock({data}: {data: Errata}) {
    const {status, barStatus} = getDisplayStatus(data);

    return (
        <div className="progress-bar-container body-block">
            <ProgressBar status={status} barStatus={barStatus} />
        </div>
    );
}

export function ErrataDetailBlock({data}: {data: Errata}) {
    return (
        <div className="errata-detail-block">
            <Detail data={data} />
        </div>
    );
}

function ErrataDetail({data}: {data: Errata}) {
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
    const slug = useLocation().pathname.substring(1);

    return (
        <div className="errata-detail page">
            <LoaderPage slug={slug} Child={ErrataDetail} doDocumentSetup />
        </div>
    );
}
