import React from 'react';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import LazyLoad from 'react-lazyload';
import FourSquare, {Model as FourSquareModel} from './four-square';
import Quote, {QuoteModel} from './quote';
import Testimonials, {TestimonialModel} from './testimonials';
import Disruption, {DisruptionModel} from './disruption';
import Give, {GiveModel} from './give';
import './impact.scss';

type ImpactData = {
    improvingAccess: {
        content: FourSquareModel;
    };
    reach: {
        content: FourSquareModel;
    };
    quote: {
        content: QuoteModel;
    };
    supporterCommunity: {
        content: QuoteModel;
    };
    disruption: {
        content: DisruptionModel;
    };
    makingADifference: {
        content: TestimonialModel;
    };
    giving: {
        content: GiveModel;
    };
};

function ImpactPage({data}: {data: ImpactData}) {
    return (
        <React.Fragment>
            <FourSquare
                top={data.improvingAccess.content}
                bottom={data.reach.content}
            />
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
                <Quote noStrips model={data.supporterCommunity.content} />
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
