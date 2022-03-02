import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import useSpecificSubjectContext from './context';
import {JumpToSection} from './navigator';
import useToggleContext, {ToggleContextProvider} from '~/components/toggle/toggle-context';
import cn from 'classnames';
import './subject-intro.scss';

function IntroContent({subjectName}) {
    const introText = 'Open textbooks';
    const {pageDescription: introHtml} = useSpecificSubjectContext();
    const {isOpen} = useToggleContext();

    return (
        <div className={cn('content', {open: isOpen})}>
            <div>{introText}</div>
            <h1>{subjectName}</h1>
            <RawHTML className="paragraph-html" html={introHtml} />
            <JumpToSection subjectName={subjectName} />
        </div>
    );
}

export default function SubjectIntro({subjectName}) {
    return (
        <section className="subject-intro">
            <ToggleContextProvider>
                <IntroContent subjectName={subjectName} />
            </ToggleContextProvider>
        </section>
    );
}
