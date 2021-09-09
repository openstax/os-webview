import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import $ from '~/helpers/$';
import useDetailsContext from '~/pages/details/context';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUserPlus} from '@fortawesome/free-solid-svg-icons/faUserPlus';
import './let-us-know.scss';

const localizedTexts = {
    'en': {
        text1: 'Sign up to<br>learn more',
        text2: 'Using this book? Let us know.'
    },
    'es': {
        text1: 'Suscríbase<br>para más información',
        text2: '¿Utiliza este libro? Háganoslo saber.'
    }
};

function useDataStuffFor(title) {
    const {language} = useDetailsContext();

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
        ...localizedTexts[language]
    };
}

export default function LetUsKnow({title}) {
    const {url1, url2, text1, text2} = useDataStuffFor(title);

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
