import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import ClippedImage from '~/components/clipped-image/clipped-image';
import './foundation.scss';

const slug = 'pages/supporters';

function Funder({data}) {
    return (
        data.url ?
            <a href={data.url}>{data.funderName}</a> :
            <span>{data.funderName}</span>
    );
}

function Funders({data}) {
    return (
        <div className="funders">
            {data.map((f, i) => <Funder key={i} data={f} />)}
        </div>
    );
}

function FundersWithImage({data, image}) {
    return (
        <div className="funders-with-image">
            <Funders data={data} />
            <img src={image.file} alt="" />
        </div>
    );
}

function FoundationGroup({data}) {
    return (
        <div className="funder-group">
            <h2>{data.groupTitle}</h2>
            <div className="description">{data.description}</div>
            {
                data.image ?
                    <FundersWithImage data={data.funders} image={data.image} /> :
                    <Funders data={data.funders} />
            }
        </div>
    );
}

function FoundationPage({data: model}) {
    return (
        <React.Fragment>
            <div className="banner">
                <ClippedImage src={model.bannerImage.meta.downloadUrl} alt="" />
                <div className="text-block">
                    <div className="text-content">
                        <h1>{model.bannerHeading}</h1>
                        <RawHTML html={model.bannerDescription} />
                    </div>
                </div>
            </div>
            {model.funderGroups.map((g, i) => <FoundationGroup key={i} data={g} />)}
            <div className="disclaimer">{model.disclaimer}</div>
        </React.Fragment>
    );
}

export default function FoundationLoader() {
    return (
        <main className="foundation-page page">
            <LoaderPage slug={slug} Child={FoundationPage} doDocumentSetup />
        </main>
    );
}
