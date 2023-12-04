import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHeart} from '@fortawesome/free-solid-svg-icons/faHeart';

type Data = {
    header_subtitle: string;
    header_image: string;
    header_title: string;
    give_link_text: string;
    thank_you_link: string;
    thank_you_link_text: string;
    giving_optional: string;
};

export default function CommonElements({
    data,
    onThankYouClick,
    headerSubtitle = data.header_subtitle,
    giveLink
}: {
    data: Data;
    onThankYouClick: (event: React.MouseEvent) => void;
    headerSubtitle?: string;
    giveLink: string;
}) {
    return (
        <React.Fragment>
            <img
                className='header-image'
                src={data.header_image}
                alt=''
                height='165'
                width='165'
            />
            <p>
                <span className='header-title'>{data.header_title}</span>
                <br />
                <span>{headerSubtitle}</span>
            </p>
            <div className='button-row'>
                <a
                    href={giveLink}
                    className='btn primary'
                    onClick={OpenGiveInNewWindow}
                    data-nudge-action='interacted'
                >
                    {data.give_link_text}
                    <FontAwesomeIcon icon={faHeart} />
                </a>
                <a
                    href={data.thank_you_link}
                    className='btn secondary'
                    onClick={onThankYouClick}
                    data-nudge-action='thank-you'
                >
                    {data.thank_you_link_text}
                </a>
            </div>
            <p className='giving-optional'>{data.giving_optional}</p>
            <hr />
        </React.Fragment>
    );
}

function OpenGiveInNewWindow(event: React.MouseEvent) {
    event.preventDefault();
    const url = (event.target as HTMLAnchorElement).href;
    const {innerWidth, innerHeight} = window;
    const w = 0.8 * innerWidth;
    const h = 0.8 * innerHeight;

    window.open(url, 'givewindow', `menubar=0,width=${w},height=${h}`);
}
