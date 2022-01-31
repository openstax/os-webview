import React from 'react';
import {useParams} from 'react-router-dom';
import useSubjectCategoryContext from '~/contexts/subject-category';
import useRouterContext from '~/components/shell/router-context';
import {SpecificSubjectContextProvider} from './context';
import {WindowContextProvider} from '~/contexts/window';
import Navigator from './navigator';
import SubjectIntro from './subject-intro';
import BookViewer from './book-viewer';
import TutorAd from '../tutor-ad';
import BlogPosts from './blog-posts';
import Webinars from './webinars';
// import LearnMore from './learn-more';
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

function SubjectInContext({subject}) {
    // <LearnMore subjectName={subject.html} />
    return (
        <SpecificSubjectContextProvider>
            <div className="subject-specific">
                <WindowContextProvider>
                    <div className="content">
                        <Navigator subject={subject} />
                        <div className={cn('targets', `${subject?.color}-stripe`)}>
                            <LanguageSelectorSection />
                            <SubjectIntro subjectName={subject.html} />
                            <BookViewer />
                            <TutorAd />
                            <BlogPosts subjectName={subject.html} />
                            <Webinars subjectName={subject.html} />

                            <AboutOpenStax
                                forceButtonUrl="/subjects"
                                forceButtonText="View all sujects"
                            />
                            <InfoBoxes />
                            <PhilanthropicSupport />
                        </div>
                    </div>
                </WindowContextProvider>
            </div>
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
