import React from 'react';
import {useParams} from 'react-router-dom';
import useSubjectCategoryContext from '~/contexts/subject-category';
import useSpecificSubjectContext, {SpecificSubjectContextProvider} from './context';
import Navigator from './navigator';
import {NavigatorContextProvider} from './navigator-context';
import {WindowContextProvider} from '~/contexts/window';
import TranslationSelector from './translation-selector';
import SubjectIntro from './subject-intro';
import BookViewer from './book-viewer';
import {TutorAdThatTakesData} from '../tutor-ad';
import BlogPosts from './blog-posts';
import Webinars from './webinars';
import LearnMore from './learn-more';
import AboutOpenStax from '../about-openstax';
import InfoBoxes from '../info-boxes';
import PhilanthropicSupport from '../philanthropic-support';
import usePageData from '~/components/jsx-helpers/page-loader';
import useLanguageContext from '~/contexts/language';
import cn from 'classnames';
import './specific.scss';

// Had to make this layer to use the context
function Translations() {
    const {translations: [translations]} = useSpecificSubjectContext();

    return (
        <TranslationSelector translations={translations} />
    );
}

function TutorAd() {
    const {tutorAd} = useSpecificSubjectContext();

    if (!tutorAd.content) {
        return null;
    }
    const {
        content: {image, heading, adHtml: html, linkHref: ctaLink, linkText: ctaText}
    } = tutorAd;

    return (
        <TutorAdThatTakesData {...{heading, image, html, ctaLink, ctaText}} />
    );
}

function SpecificSubjectAboutOpenStax() {
    const {aboutOs} = useSpecificSubjectContext();

    return (
        <AboutOpenStax
            forceButtonUrl="/subjects"
            forceButtonText="View all sujects"
            aboutOs={aboutOs.content}
        />
    );
}

function SubjectInContext({subject}) {
    return (
        <SpecificSubjectContextProvider contextValueParameters={subject.value}>
            <WindowContextProvider>
                <NavigatorContextProvider>
                    <div className="subject-specific">
                        <div className="content">
                            <Navigator subject={subject} />
                            <div className={cn('targets', `${subject?.color}-stripe`)}>
                                <Translations />
                                <SubjectIntro subjectName={subject.html} />
                                <BookViewer />
                                <TutorAd />
                                <BlogPosts />
                                <Webinars />
                                <LearnMore />
                                <SpecificSubjectAboutOpenStax />
                                <InfoBoxes />
                                <PhilanthropicSupport />
                            </div>
                        </div>
                    </div>
                </NavigatorContextProvider>
            </WindowContextProvider>
        </SpecificSubjectContextProvider>
    );
}

function useFoundSubject() {
    const {subject} = useParams();
    const categories = useSubjectCategoryContext();
    const foundSubject = React.useMemo(
        () => categories.find((c) => c.value === subject),
        [subject, categories]
    );

    return foundSubject;
}

function useConsistentLanguage(subject, foundSubject) {
    const pageData = usePageData(`pages/${subject}`);
    const {setLanguage} = useLanguageContext();

    React.useEffect(
        () => {
            if (!foundSubject && pageData?.meta?.locale) {
                setLanguage(pageData.meta.locale);
            }
        },
        [foundSubject, pageData, setLanguage]
    );
}

export default function LoadSubject() {
    const {subject} = useParams();
    const foundSubject = useFoundSubject();

    useConsistentLanguage(subject, foundSubject);

    if (!foundSubject) {
        console.warn(`Unknown subject ${subject}`);
        return null;
    }

    return (
        <SubjectInContext subject={foundSubject} />
    );
}
