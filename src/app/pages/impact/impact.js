import React from 'react';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import {LoaderPage, RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import Hero from '~/components/hero/hero';
import OurReach from './our-reach';
import Quote from './quote';
import Testimonials from './testimonials';
import Disruption from './disruption';
import Give from './give';
import './impact.css';

function ImpactPage({data}) {
    const {
        heading: headline,
        image: {image: imageSrc, altText: imageAlt},
        description,
        buttonHref,
        buttonText
    } = data.improvingAccess.content;

    return (
        <React.Fragment>
            <Hero src={imageSrc} alt={imageAlt}>
                <h1>{headline}</h1>
                <RawHTML className="strip-outer-margins" html={description} />
                <a className="btn primary" href={buttonHref}>{buttonText}</a>
            </Hero>
            <OurReach model={data.reach.content} />
            <Quote model={data.quote.content} />
            <Testimonials model={data.makingADifference.content} />
            <Disruption model={data.disruption.content} />
            <Quote supporter noStrips model={data.supporterCommunity.content} />
            <Give model={data.giving.content} />
        </React.Fragment>
    );
}

const slug = 'pages/impact';
const view = {
    classes: ['annual-report', 'page'],
    tag: 'main'
};

function ImpactLoader() {
    return (
        <LoaderPage slug={slug} Child={ImpactPage} doDocumentSetup />
    );
}

export default pageWrapper(ImpactLoader, view);
