import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import $ from '~/helpers/$';
import {useIntl} from 'react-intl';
import {FontAwesomeIcon, FontAwesomeIconProps} from '@fortawesome/react-fontawesome';
import {faUserPlus} from '@fortawesome/free-solid-svg-icons/faUserPlus';
import {faBook} from '@fortawesome/free-solid-svg-icons/faBook';
import usePortalContext from '~/contexts/portal';
import cn from 'classnames';
import './let-us-know.scss';

function useDataStuffFor(title:string) {
    const intl = useIntl();
    const {portalPrefix} = usePortalContext();
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
        url1: `${portalPrefix}/interest?${encodeURIComponent(title)}`,
        url2: `${portalPrefix}/adoption?${encodeURIComponent(title)}`,
        text1, text2
    };
}

function ButtonWithIcon({url, icon, text, reverse=false}: {
    url: string;
    icon: FontAwesomeIconProps['icon'];
    text: string;
    reverse?: boolean;
}) {
    return (
        <a className="button-with-icon" href={url} data-analytics-link>
            <span className={cn('book-icon', {reverse})}>
                <FontAwesomeIcon icon={icon} />
            </span>
            <RawHTML Tag="span" className="text" html={text} />
        </a>
    );
}

function LetUsKnow({title}: {title: string}) {
    const {url1, url2, text1, text2} = useDataStuffFor(title);

    return (
        <div className="let-us-know">
            <ButtonWithIcon url={url1} icon={faUserPlus} text={text1} />
            <ButtonWithIcon url={url2} icon={faBook} text={text2} reverse />
        </div>
    );
}

export default function MaybeLetUsKnow({title}: {title?: string}) {
    if (!title) {
        return null;
    }
    return (<LetUsKnow title={title} />);
}
