import React from 'react';
import {enroll} from '@openstax/experiments';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHeart} from '@fortawesome/free-solid-svg-icons/faHeart';
import useGiveLinks from './use-give-links';

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
    doExperiment = false
}: {
    data: Data;
    onThankYouClick: (event: React.MouseEvent) => void;
    doExperiment?: boolean;
}) {
    const [controlLink, alternateLink] = useGiveLinks();
    const variants = [
        {
            name: 'control',
            // eslint-disable-next-line camelcase
            header_subtitle: data.header_subtitle,
            giveLink: controlLink
        },
        {
            name: 'public good',
            // eslint-disable-next-line camelcase
            header_subtitle:
                'Join us in sustaining OpenStax as a public good for years to come by giving today.',
            giveLink: alternateLink
        }
    ];
    const donationExperiment = doExperiment ? enroll({
        name: 'Donation Experiment 2023',
        variants
    }) : variants[0];

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
                <span>{donationExperiment.header_subtitle}</span>
            </p>
            <div className='button-row'>
                <a
                    href={donationExperiment.giveLink}
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
