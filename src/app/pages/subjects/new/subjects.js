import React, {useEffect} from 'react';
import {
    Switch, Route,
    Redirect
} from 'react-router-dom';
import useSubjectsContext, {SubjectsContextProvider} from './context';
import $ from '~/helpers/$';
import {useCanonicalLink} from '~/components/jsx-helpers/jsx-helpers.jsx';
import Hero from './hero';
import useLanguageContext from '~/contexts/language';
import LanguageSelector from '~/components/language-selector/language-selector';
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

const leadInText = {
    en: 'We have textbooks in',
    es: 'Tenemos libros de texto en'
};

function useConsistentLanguage() {
    const {language, setLanguage} = useLanguageContext();
    const {translations, meta: {locale}} = useSubjectsContext();

    useEffect(
        () => {
            if (language !== locale) {
                if ((translations.length === 0 || !translations[0].find((t) => locale === t))) {
                    setLanguage(locale);
                }
            }
        },
        [language, locale, setLanguage, translations]
    );
}

function SubjectsPage() {
    const {translations} = useSubjectsContext();
    const otherLocales = translations.length ?
        translations[0].value.map((t) => t.locale) :
        []
    ;

    useConsistentLanguage();

    return (
        <main className="subjects-page">
            <SEOSetup />
            <Hero />
            <img className="strips" src="/dist/images/components/strips.svg" height="10" alt="" role="separator" />
            <section className="language-selector-section">
                <div className="content">
                    <LanguageSelector leadInText={leadInText} otherLocales={otherLocales} />
                </div>
            </section>
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
            <Switch>
                <Route exact path="/subjects">
                    <SubjectsPage />
                </Route>
                <Route exact path="/subjects/view-all">
                    <Redirect to="/subjects" />
                </Route>
                <Route path="/subjects/:subject">
                    <LoadSubject />
                </Route>
            </Switch>
        </SubjectsContextProvider>
    );
}
