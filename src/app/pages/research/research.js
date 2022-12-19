import LoaderPage from '~/components/jsx-helpers/loader-page';
import React from 'react';
import LazyLoad from 'react-lazyload';
import './research.scss';
import {Header} from './components/header';
import {ResearchSection} from './components/research-areas';
import {Funders} from '~/pages/research/components/funders';
import {ContactUs} from '~/pages/research/components/contact-us';
import {Publications} from '~/pages/research/components/publications';
import {MembersSection} from '~/pages/research/components/members';

function ResearchPage({data}) {
    return (
        <React.Fragment>
            <LazyLoad>
                <Header data={data} />
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

export default function ResearchLoader() {
    return (
        <main className="research page">
            <LoaderPage slug="pages/research" Child={ResearchPage} doDocumentSetup />
        </main>
    );
}
