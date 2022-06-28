import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import $ from '~/helpers/$';
import {useIntl} from 'react-intl';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUserPlus} from '@fortawesome/free-solid-svg-icons/faUserPlus';
import './let-us-know.scss';


function useDataStuffFor(title) {
    const intl = useIntl();
    const [text1, text2] = [
        intl.formatMessage({id: 'letusknow.text1'}),
        intl.formatMessage({id: 'letusknow.text2'})
    ];

    if ($.isPolish(title)) {
        return {
            url1: 'https://openstax.pl/pl/newsletter',
            text1: 'Zarejestruj się,<br>aby dowiedzieć się więcej',
            url2: 'https://openstax.pl/formularz-adopcyjny',
            text2: 'Korzystasz z tej książki? Daj nam znać.'
        };
    }

    return {
        url1: `/interest?${encodeURIComponent(title)}`,
        url2: `/adoption?${encodeURIComponent(title)}`,
        text1, text2
    };
}

export default function LetUsKnow({title}) {
    const {url1, url2, text1, text2} = useDataStuffFor(title);
    const {locale} = useIntl();

    if (locale !== 'en') {
        return null;
    }
    return (
        <div className="let-us-know">
            <a className="top" href={url1}>
                <span className="book-icon">
                    <FontAwesomeIcon icon={faUserPlus} />
                </span>
                <RawHTML Tag="span" className="text" html={text1} />
            </a>
            <a className="link" href={url2}>{text2}</a>
        </div>
    );
}
