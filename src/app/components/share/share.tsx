import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {faFacebookF} from '@fortawesome/free-brands-svg-icons/faFacebookF';
import {faXTwitter} from '@fortawesome/free-brands-svg-icons/faXTwitter';
import {faLinkedinIn} from '@fortawesome/free-brands-svg-icons/faLinkedinIn';
import './facebook-script';
import './share.scss';

type ButtonData = {
    aClass: string;
    url: string;
    icon: IconDefinition;
    iconLabel: string;
    target?: string;
}

function SocialLink({aClass, url, icon, iconLabel, target}: ButtonData) {
    return (
        <a className={aClass} target={target} href={url} aria-label={iconLabel}>
            <FontAwesomeIcon className="social-icon" icon={icon} />
        </a>
    );
}

type Props = {
    pageUrl: string;
    message: string;
}

function ShareInterior({pageUrl, message}: Props) {
    const buttonData = [
        {
            aClass: 'fb-xfbml-parse-ignore facebook btn',
            url: `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}&src=share_button&sdk=joey&display=popup&app_id=`,
            icon: faFacebookF,
            iconLabel: 'Facebook',
            target: '_blank'
        },
        {
            aClass: 'twitter twitter-share-button btn',
            url: `https://twitter.com/intent/tweet?text=${message}&url=${pageUrl}`,
            icon: faXTwitter,
            iconLabel: 'Twitter'
        },
        {
            aClass: 'linkedin btn',
            url: `https://www.linkedin.com/shareArticle?url=${pageUrl}&mini=true&source=OpenStax&title=${message}`,
            icon: faLinkedinIn,
            iconLabel: 'LinkedIn'
        }
    ];

    return (
        <div className='buttons'>
            <div
                className="fb-share-button"
                data-href="https://developers.facebook.com/docs/plugins/"
                data-layout="link"
                data-mobile-iframe="true"
            >
                <SocialLink {...buttonData[0]} />
            </div>
            {
                buttonData.slice(1).map((data) =>
                    <SocialLink {...data} key={data.url} />
                )
            }
        </div>
    );
}

export function ShareJsx(props: Props) {
    return (
        <div className='share-buttons'>
            <ShareInterior {...props} />
        </div>
    );
}
