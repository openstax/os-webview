import React from 'react';
import {Routes, Route, Navigate, useLocation} from 'react-router-dom';
import useSubjectsContext, {SubjectsContextProvider} from './context';
import {htmlToText, assertDefined} from '~/helpers/data';
import useDocumentHead, {useCanonicalLink} from '~/helpers/use-document-head';
import Hero from './hero';
import JITLoad from '~/helpers/jit-load';
import {AllSubjectsAboutOpenStax} from './about-openstax';
import LoadSubject from './specific/specific';
import './subjects.scss';

const importLanguageSelector = () => import('./import-language-selector-section.js');
const importSubjectsListing = () => import('./import-subjects-listing.js');
const importTutorAd = () => import('./import-tutor-ad.js');
const importInfoBoxes = () => import('./import-info-boxes.js');
const importPhilanthropicSupport = () =>
    import('./import-philanthropic-support.js');

function SEOSetup() {
    const {title, pageDescription} = assertDefined(useSubjectsContext());

    useDocumentHead({
        title,
        description: pageDescription ? htmlToText(pageDescription) : undefined
    });
    useCanonicalLink();

    return null;
}

export function SubjectsPage() {
    const {translations} = assertDefined(useSubjectsContext());
    const otherLocales = translations?.length
        ? translations[0].value.map((t) => t.locale)
        : [];

    return (
        <main className="subjects-page">
            <SEOSetup />
            <Hero />
            <img
                className="strips"
                src="/dist/images/components/strips.svg"
                height="10"
                alt=""
                role="separator"
            />
            <JITLoad
                importFn={importLanguageSelector}
                otherLocales={otherLocales}
                addPolish={true}
            />
            <JITLoad importFn={importSubjectsListing} />
            <JITLoad importFn={importTutorAd} />
            <AllSubjectsAboutOpenStax />
            <JITLoad importFn={importInfoBoxes} />
            <JITLoad importFn={importPhilanthropicSupport} />
        </main>
    );
}

function RedirectSlash() {
    const {pathname} = useLocation();

    if (pathname.endsWith('/')) {
        return <Navigate to={pathname.slice(0, -1)} replace />;
    }
    return <SubjectsPage />;
}

export default function SubjectsRouter() {
    return (
        <SubjectsContextProvider>
            <Routes>
                <Route path="/" element={<RedirectSlash />} />
                <Route
                    path="view-all"
                    element={<Navigate to="/subjects" replace />}
                />
                <Route
                    path="ap"
                    element={<Navigate to="/subjects/high-school" replace />}
                />
                <Route path=":subject" element={<LoadSubject />} />
            </Routes>
        </SubjectsContextProvider>
    );
}
