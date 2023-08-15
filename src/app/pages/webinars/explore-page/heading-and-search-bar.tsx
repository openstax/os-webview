import React from 'react';
import {HeadingAndSearchBar} from '~/components/search-bar/search-bar';
import useWebinarContext from '../webinar-context';
import {Category} from '~/components/explore-by-subject/types';

export default function WebinarHSB({topic}: {topic: string}) {
    const {searchFor, subjects} = useWebinarContext();
    const subject = subjects.find((s) => s.name === topic);
    const heading = subject ? `OpenStax ${topic} Textbooks` : topic;

    return (
        <HeadingAndSearchBar searchFor={searchFor} amongWhat='webinars'>
            <HeadingForExplorePage {...{subject, heading}} />
        </HeadingAndSearchBar>
    );
}

type HeadingArgs = {
    subject: Category | undefined;
    heading: string;
};

function HeadingForExplorePage({subject, heading}: HeadingArgs) {
    return (
        <h1>
            {subject?.subjectIcon && <img src={subject.subjectIcon} alt='' />}
            <span>{heading}</span>
        </h1>
    );
}
