import LoaderPage from '~/components/jsx-helpers/loader-page';
import React from 'react';
import LazyLoad from 'react-lazyload';
import HeroSection from './hero-section/hero-section';
import ProjectsSection from './projects-section/projects-section';
import PeopleSection from './people-section/people-section';
import PublicationsSection from './publications-section/publications-section';
import './research.scss';

function ResearchPage({data}) {
    return (
        <React.Fragment>
            <HeroSection data={data} />
            <LazyLoad>
                <ProjectsSection data={data} />
            </LazyLoad>
            <LazyLoad>
                <PeopleSection data={data} />
            </LazyLoad>
            <LazyLoad>
                <PublicationsSection data={data} />
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
