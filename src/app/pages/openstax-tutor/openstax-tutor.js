import {LoaderPage} from '~/components/jsx-helpers/jsx-helpers.jsx';
import React from 'react';
import LazyLoad from 'react-lazyload';
import Banner from './banner/banner';
import QuoteBox from './quote-box/quote-box';
import Features from './features/features';
import Materials from './materials/materials';
import Cost from './cost/cost';
import Webinars from './webinars/webinars';
import Feedback from './feedback/feedback';
import FAQ from './faq/faq';
import StickyFooter from '~/components/sticky-footer/sticky-footer-wrapper';
import ButtonRow from './button-row/button-row';
import './openstax-tutor.css';

export function TutorMarketingPage({data}) {
    return (
        <React.Fragment>
            <Banner model={data} />
            <QuoteBox model={data} />
            <div className="reset-odd-counter" />
            <LazyLoad>
                <Features model={data} />
                <Materials model={data} />
            </LazyLoad>
            <LazyLoad>
                <Cost model={data} />
                <Feedback model={data} />
            </LazyLoad>
            <div className="reset-odd-counter" />
            <LazyLoad>
                <Webinars model={data} />
                <FAQ model={data} />
            </LazyLoad>
            <StickyFooter>
                <ButtonRow model={data} />
            </StickyFooter>
        </React.Fragment>
    );
}

export default function Loader() {
    return (
        <main className="openstax-tutor-page page">
            <LoaderPage slug="pages/openstax-tutor" Child={TutorMarketingPage} doDocumentSetup />
        </main>
    );
}
