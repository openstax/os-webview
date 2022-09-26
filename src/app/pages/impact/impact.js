import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import LazyLoad from 'react-lazyload';
import Hero from '~/components/hero/hero';
import OurReach from './our-reach';
import Quote from './quote';
import Testimonials from './testimonials';
import Disruption from './disruption';
import Give from './give';
import './impact.scss';

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
            <LazyLoad>
                <Quote model={data.quote.content} />
            </LazyLoad>
            <LazyLoad>
                <Testimonials model={data.makingADifference.content} />
            </LazyLoad>
            <LazyLoad>
                <Disruption model={data.disruption.content} />
            </LazyLoad>
            <LazyLoad>
                <Quote supporter noStrips model={data.supporterCommunity.content} />
            </LazyLoad>
            <Give model={data.giving.content} />
        </React.Fragment>
    );
}

const slug = 'pages/impact';

export default function ImpactLoader() {
    return (
        <main className="annual-report page">
            <LoaderPage slug={slug} Child={ImpactPage} doDocumentSetup />
        </main>
    );
}
