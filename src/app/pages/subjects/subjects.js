import React, {useEffect} from 'react';
import {
    BrowserRouter as Router, Switch, Route,
    Redirect
} from 'react-router-dom';
import useSubjectsContext, {SubjectsContextProvider} from './context';
import $ from '~/helpers/$';
import {useCanonicalLink} from '~/components/jsx-helpers/jsx-helpers.jsx';
import Hero from './hero';
import LanguageSelector from '~/components/language-selector/language-selector';
import SubjectsListing from './subjects-listing';
import TutorAd from './tutor-ad';
import AboutOpenStax from './about-openstax';
import InfoBoxes from './info-boxes';
import PhilanthropicSupport from './philanthropic-support';
// import useSubjectCategoryContext from '~/contexts/subject-category';
// import useSavingsDataIn, {linkClickTracker} from '~/helpers/savings-blurb';
// import LanguageSelector from '~/components/language-selector/language-selector';
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

const leadInText = {
    en: 'We have textbooks in',
    es: 'Tenemos libros de texto en'
};

function SubjectsPage() {
    const {translations} = useSubjectsContext();
    const otherLocales = translations.length ?
        translations[0].value.map((t) => t.locale) :
        []
    ;

    return (
        <main className="subjects-page">
            <SEOSetup />
            <Hero />
            <img className="strips" src="/images/components/strips.svg" height="10" alt="" role="separator" />
            <section className="language-selector-section">
                <div className="content">
                    <LanguageSelector leadInText={leadInText} otherLocales={otherLocales} />
                </div>
            </section>
            <SubjectsListing />
            <TutorAd />
            <AboutOpenStax />
            <InfoBoxes />
            <PhilanthropicSupport />
        </main>
    );
}

function LoadSubject() {
    return (
        <h1>Load subject...</h1>
    );
}

export default function SubjectsRouter() {
    return (
        <Router>
            <Switch>
                <Route exact path="/subjects">
                    <SubjectsContextProvider>
                        <SubjectsPage />
                    </SubjectsContextProvider>
                </Route>
                <Route exact path="/subjects/view-all">
                    <Redirect to="/subjects" />
                </Route>
                <Route path="/subjects/:subject">
                    <LoadSubject />
                </Route>
            </Switch>
        </Router>
    );
}
