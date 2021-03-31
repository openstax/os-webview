import {LoaderPage} from '~/components/jsx-helpers/jsx-helpers.jsx';
import React from 'react';
import HeroSection from './hero-section/hero-section';
import ProjectsSection from './projects-section/projects-section';
import PeopleSection from './people-section/people-section';
import PublicationsSection from './publications-section/publications-section';
import './research.css';

function ResearchPage({data}) {
    return (
        <React.Fragment>
            <HeroSection data={data} />
            <ProjectsSection data={data} />
            <PeopleSection data={data} />
            <PublicationsSection data={data} />
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
