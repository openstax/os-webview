import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import $ from '~/helpers/$';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './let-us-know.css';

function dataStuffFor(title) {
    if ($.isPolish(title)) {
        return {
            url1: 'https://openstax.pl/pl/newsletter',
            text1: 'Zarejestruj się,<br>aby dowiedzieć się więcej',
            url2: 'https://docs.google.com/forms/d/e/1FAIpQLSc87Eu8-nNJ6c-vW0FTuMXi-B_5I1x92wuvS_jryzOILRpqMQ/viewform',
            text2: 'Korzystasz z tej książki? Daj nam znać.'
        };
    }

    return {
        url1: `/interest?${encodeURIComponent(title)}`,
        url2: `/adoption?${encodeURIComponent(title)}`,
        text1: 'Sign up to<br>learn more',
        text2: 'Using this book? Let us know.'
    };
}

export default function LetUsKnow({title}) {
    const {url1, url2, text1, text2} = dataStuffFor(title);

    return (
        <div className="let-us-know">
            <a className="top" href={url1}>
                <span className="book-icon">
                    <FontAwesomeIcon icon="user-plus" />
                </span>
                <RawHTML Tag="span" className="text" html={text1} />
            </a>
            <a className="link" href={url2}>{text2}</a>
        </div>
    );
}
