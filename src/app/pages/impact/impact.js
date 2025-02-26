import React from 'react';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import LazyLoad from 'react-lazyload';
import FourSquare from './four-square';
import Quote from './quote';
import Testimonials from './testimonials';
import Disruption from './disruption';
import Give from './give';
import './impact.scss';

function ImpactPage({data}) {
    return (
        <React.Fragment>
            <FourSquare top={data.improvingAccess.content} bottom={data.reach.content} />
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
