import React from 'react';
import {useParams} from 'react-router-dom';
import useSubjectCategoryContext from '~/contexts/subject-category';
import useRouterContext from '~/components/shell/router-context';
import useSpecificSubjectContext, {SpecificSubjectContextProvider} from './context';
import Navigator from './navigator';
import {NavigatorContextProvider} from './navigator-context';
import {WindowContextProvider} from '~/contexts/window';
import SubjectIntro from './subject-intro';
import BookViewer from './book-viewer';
import {TutorAdThatTakesData} from '../tutor-ad';
import BlogPosts from './blog-posts';
import Webinars from './webinars';
import LearnMore from './learn-more';
import AboutOpenStax from '../about-openstax';
import InfoBoxes from '../info-boxes';
import PhilanthropicSupport from '../philanthropic-support';
import cn from 'classnames';
import './specific.scss';

function LanguageSelectorSection() {
    return (
        <section className="language-selector-section">
            <div className="content">
                We don&apos;t have translations at the subject level
            </div>
        </section>
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

function SubjectInContext({subject}) {
    return (
        <SpecificSubjectContextProvider contextValueParameters={subject.value}>
            <WindowContextProvider>
                <NavigatorContextProvider>
                    <div className="subject-specific">
                        <div className="content">
                            <Navigator subject={subject} />
                            <div className={cn('targets', `${subject?.color}-stripe`)}>
                                <LanguageSelectorSection />
                                <SubjectIntro subjectName={subject.html} />
                                <BookViewer />
                                <TutorAd />
                                <BlogPosts subjectName={subject.html} />
                                <Webinars subjectName={subject.html} />
                                <LearnMore />
                                <AboutOpenStax
                                    forceButtonUrl="/subjects"
                                    forceButtonText="View all sujects"
                                />
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

export default function LoadSubject() {
    const {subject} = useParams();
    const categories = useSubjectCategoryContext();
    const foundSubject = React.useMemo(
        () => categories.find((c) => c.value === subject),
        [categories, subject]
    );
    const {fail} = useRouterContext();

    if (!foundSubject) {
        fail(`Unknown subject ${subject}`);
        return null;
    }

    return (
        <SubjectInContext subject={foundSubject} />
    );
}
