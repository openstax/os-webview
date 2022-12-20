import LoaderPage from '~/components/jsx-helpers/loader-page';
import React from 'react';
import LazyLoad from 'react-lazyload';
import './research.scss';
import {Banner, Header} from './components/header';
import {ResearchSection} from './components/research-areas';
import {Funders} from '~/pages/learning-research/components/funders';
import {ContactUs} from '~/pages/learning-research/components/contact-us';
import {Publications} from '~/pages/learning-research/components/publications';
import {MembersSection} from '~/pages/learning-research/components/members';

function LearningResearchPage({data}) {
    return (
        <React.Fragment>
            <LazyLoad>
                <Header data={data} />
            </LazyLoad>
            <LazyLoad>
                <Banner data={data} />
            </LazyLoad>
            <LazyLoad>
                <ResearchSection data={data} />
            </LazyLoad>
            <LazyLoad>
                <Publications data={data} />
            </LazyLoad>
            <LazyLoad>
                <MembersSection data={data} />
            </LazyLoad>
            <LazyLoad>
                <Funders />
            </LazyLoad>
            <LazyLoad>
                <ContactUs />
            </LazyLoad>
        </React.Fragment>
    );
}

export default function LearningResearchLoader() {
    return (
        <main className="research page">
            <LoaderPage slug="pages/learning-research" Child={LearningResearchPage} doDocumentSetup />
        </main>
    );
}
