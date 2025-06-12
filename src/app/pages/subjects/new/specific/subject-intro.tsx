import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import useSpecificSubjectContext from './context';
import {JumpToSection} from './navigator';
import useToggleContext from '~/components/toggle/toggle-context';
import Toggle from '~/components/toggle/toggle';
import {FormattedMessage} from 'react-intl';
import cn from 'classnames';
import './subject-intro.scss';

function IntroContent({subjectName}: {subjectName: string}) {
    const introHtml = useSpecificSubjectContext().pageDescription ?? '';
    const {isOpen} = useToggleContext();

    return (
        <div className={cn('content', {open: isOpen})}>
            <div>
                <FormattedMessage
                    id="subject.introText"
                    defaultMessage="Open textbooks"
                />
            </div>
            <h1>{subjectName}</h1>
            <RawHTML className="paragraph-html" html={introHtml} />
            <JumpToSection subjectName={subjectName} />
        </div>
    );
}

export default function SubjectIntro({subjectName}: {subjectName: string}) {
    return (
        <section className="subject-intro">
            <Toggle>
                <IntroContent subjectName={subjectName} />
            </Toggle>
        </section>
    );
}
