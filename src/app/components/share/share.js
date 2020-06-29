import React from 'react';
import WrappedJsx from '~/controllers/jsx-wrapper';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './share.css';

/* eslint-disable */
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id) || !fjs) return;
  js = d.createElement(s); js.id = id;
  js.src = '//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.8';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
/* eslint-enable */

function SocialLink({minimal, aClass, url, icon, iconLabel, target}) {
    return (
        <a className={aClass} target={target} href={url}>
            <FontAwesomeIcon className="social-icon" icon={{prefix: 'fab', iconName: icon}} />
            {
                !minimal && <span>{iconLabel}</span>
            }
        </a>
    );
}

function ShareInterior({pageUrl, message, minimal}) {
    const buttonData = [
        {
            aClass: 'fb-xfbml-parse-ignore facebook btn',
            url: `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}&src=share_button&sdk=joey&display=popup&app_id=`,
            icon: 'facebook-f',
            iconLabel: 'Facebook',
            target: '_blank'
        },
        {
            aClass: 'twitter twitter-share-button btn',
            url: `https://twitter.com/intent/tweet?text=${message}&url=${pageUrl}`,
            icon: 'twitter',
            iconLabel: 'Twitter'
        },
        {
            aClass: 'linkedin btn',
            url: `https://www.linkedin.com/shareArticle?url=${pageUrl}&mini=true&source=OpenStax&title=${message}`,
            icon: 'linkedin-in',
            iconLabel: 'LinkedIn'
        }
    ];

    return (
        <div className={`buttons ${minimal ? 'minimal' : ''}`}>
            <div className="fb-share-button"
                data-href="https://developers.facebook.com/docs/plugins/"
                data-layout="link"
                data-mobile-iframe="true"
            >
                <SocialLink {...buttonData[0]} minimal={minimal} />
            </div>
            {
                buttonData.slice(1).map((data) =>
                    <SocialLink {...data} minimal={minimal} />
                )
            }
        </div>
    );
}

export function ShareJsx(props) {
    return (
        <div className='share-buttons'>
            <ShareInterior {...props} />
        </div>
    );
}

const view = {
    classes: ['share-buttons']
};


export default class extends WrappedJsx {

    init(pageUrl, message, minimal) {
        super.init(ShareInterior, {
            pageUrl: encodeURIComponent(pageUrl),
            message: encodeURIComponent(message),
            minimal
        });
        this.view = view;
    }

};
