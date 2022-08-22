import React, {useEffect} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import useSubjectsContext, {SubjectsContextProvider} from './context';
import $ from '~/helpers/$';
import {useCanonicalLink} from '~/components/jsx-helpers/jsx-helpers.jsx';
import Hero from './hero';
import LanguageSelectorSection from './language-selector-section';
import SubjectsListing from './subjects-listing';
import TutorAd from './tutor-ad';
import {AllSubjectsAboutOpenStax} from './about-openstax';
import InfoBoxes from './info-boxes';
import PhilanthropicSupport from './philanthropic-support';
import LoadSubject from './specific/specific';
import './subjects.scss';

function SEOSetup() {
    const {title, pageDescription} = useSubjectsContext();

    useCanonicalLink();
    useEffect(
        () => $.setPageTitleAndDescription(title, $.htmlToText(pageDescription)),
        [title, pageDescription]
    );

    return null;
}

export function SubjectsPage() {
    const {translations} = useSubjectsContext();
    const otherLocales = translations.length ?
        translations[0].value.map((t) => t.locale) :
        []
    ;

    return (
        <main className="subjects-page">
            <SEOSetup />
            <Hero />
            <img className="strips" src="/dist/images/components/strips.svg" height="10" alt="" role="separator" />
            <LanguageSelectorSection otherLocales={otherLocales} />
            <SubjectsListing />
            <TutorAd />
            <AllSubjectsAboutOpenStax />
            <InfoBoxes />
            <PhilanthropicSupport />
        </main>
    );
}

export default function SubjectsRouter() {
    return (
        <SubjectsContextProvider>
            <Routes>
                <Route path="" element={<SubjectsPage />} />
                <Route path="view-all" element={<Navigate to="/subjects" replace />} />
                <Route path=":subject" element={<LoadSubject />} />
            </Routes>
        </SubjectsContextProvider>
    );
}
