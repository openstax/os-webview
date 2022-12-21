import LoaderPage from '~/components/jsx-helpers/loader-page';
import React from 'react';
import LazyLoad from 'react-lazyload';
import '~/pages/learning-research/research.scss';
import {Banner, Header} from '~/pages/learning-research/components/header';
import {ResearchSection} from '~/pages/learning-research/components/research-areas';
import {Funders} from '~/pages/learning-research/components/funders';
import {ContactUs} from '~/pages/learning-research/components/contact-us';
import {Publications} from '~/pages/learning-research/components/publications';
import {MembersSection} from '~/pages/learning-research/components/members';

function LearningResearchPage({data}) {
    return (
        <React.Fragment>
            <Header data={data} />
            <Banner data={data} />
            <ResearchSection data={data} />
            <LazyLoad>
                <Publications data={data} />
            </LazyLoad>
            <LazyLoad>
                <MembersSection data={data} />
            </LazyLoad>
            <LazyLoad>
                <Funders />
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
