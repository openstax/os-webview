import React from 'react';
import {LoaderPage, RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import ClippedImage from '~/components/clipped-image/clipped-image';
import './foundation.scss';

const slug = 'pages/foundation';

function stubModel(model) {
    Object.assign(model, {
        bannerImage: 'https://via.placeholder.com/785x405.png?text=Supporters+Image',
        bannerHeading: 'Supporters',
        bannerDescriptionHtml: `
        <p>
        OpenStax works with individuals and organizations to address the many challenges
        and complex inequalities facing students around the world. Our supporters offer
        more than financial resources - they contribute their ideas, passion, and
        in-kind support to improve open education for all. They are an integral part of
        our success and we are grateful to them for their partnership.
        </p>
        <p>
        Learn how your company or organization can join our vibrant group of supporters
        and help make a difference for learning communities around the world. To find
        out how you can give to OpenStax today, please click here.
        </p>`,
        groupings: [
            {
                title: 'Founding Funders',
                description: ` Founding funders are individuals and
                organizations who partnered with OpenStax from the very
                beginning. They not only believe in OpenStax, they believe in
                every student's pursuit of a life-changing education. `,
                funders: [
                    {
                        name: 'Bill & Melinda Gates Foundation',
                        link: 'https://www.gatesfoundation.org'
                    },
                    ...(
                        [
                            'Cvent', 'GitHub', 'Gitpod', 'Hootsuite', 'PagerDuty',
                            'Privacy Ref, Inc.', 'Pulse Insights', 'Salesforce', 'Sentry',
                            'Slack', 'Small Improvements', 'Tech Scout', 'User Testing',
                            'ZenDesk', 'ZenHub', 'Zoom'
                        ].map((n) => ({name: n}))
                    )
                ]
            },
            {
                title: 'In-Kind Partners',
                description: ` The following organizations have provided
                OpenStax with invaluable in-kind contributions of goods and
                services, other than cash funds. These generous gifts help to
                further our work of providing free and low-cost resources to
                students.`,
                image: 'https://via.placeholder.com/450x410.png?text=In-Kind+Image',
                funders: [
                    'Cvent', 'GitHub', 'Gitpod', 'Hootsuite', 'PagerDuty',
                    'Privacy Ref, Inc.', 'Pulse Insights', 'Salesforce', 'Sentry',
                    'Slack', 'Small Improvements', 'Tech Scout', 'User Testing',
                    'ZenDesk', 'ZenHub', 'Zoom'
                ].map((n) => ({name: n}))
            }
        ],
        disclaimer: ` *The contents were developed under a grant from the Fund
        for the Improvement of Postsecondary Education, (FIPSE), U.S. Department
        of Education. However, those contents do not necessarily represent the
        policy of the Department of Education, and you should not assume
        endorsement by the Federal Government. `
    });
}

function Funder({data}) {
    return (
        data.link ?
            <a href={data.link}>{data.name}</a> :
            <span>{data.name}</span>
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
            <img src={image} alt="" />
        </div>
    );
}

function FoundationGroup({data}) {
    return (
        <div className="funder-group">
            <h2>{data.title}</h2>
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
    stubModel(model);

    return (
        <React.Fragment>
            <div className="banner">
                <ClippedImage src={model.bannerImage} alt="" />
                <div className="text-block">
                    <div className="text-content">
                        <h1>{model.bannerHeading}</h1>
                        <RawHTML html={model.bannerDescriptionHtml} />
                    </div>
                </div>
            </div>
            {model.groupings.map((g, i) => <FoundationGroup key={i} data={g} />)}
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
