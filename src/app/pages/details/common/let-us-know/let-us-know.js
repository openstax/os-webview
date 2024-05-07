import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import $ from '~/helpers/$';
import {useIntl} from 'react-intl';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUserPlus} from '@fortawesome/free-solid-svg-icons/faUserPlus';
import {faBook} from '@fortawesome/free-solid-svg-icons/faBook';
import cn from 'classnames';
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

function ButtonWithIcon({url, icon, text, reverse=false}) {
    return (
        <a className="button-with-icon" href={url}>
            <span className={cn('book-icon', {reverse})}>
                <FontAwesomeIcon icon={icon} />
            </span>
            <RawHTML Tag="span" className="text" html={text} />
        </a>
    );
}

export default function LetUsKnow({title}) {
    const {url1, url2, text1, text2} = useDataStuffFor(title);

    if (!title) {
        return null;
    }
    return (
        <div className="let-us-know">
            <ButtonWithIcon url={url1} icon={faUserPlus} text={text1} />
            <ButtonWithIcon url={url2} icon={faBook} text={text2} reverse />
        </div>
    );
}
