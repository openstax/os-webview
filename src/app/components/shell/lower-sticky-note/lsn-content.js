import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronRight} from '@fortawesome/free-solid-svg-icons/faChevronRight';
import {faHeart} from '@fortawesome/free-solid-svg-icons/faHeart';
import analytics from '~/helpers/analytics';
import cn from 'classnames';
import './lower-sticky-note.scss';

function trackClickFor(el, target, eventArgs) {
    if (el && el.contains(target)) {
        analytics.sendPageEvent(...eventArgs);
    }
}

function matchesOrContains(el, selector) {
    return el.matches(selector) ? el : el?.querySelector(selector);
}

function trackClick(event) {
    const div = event.currentTarget;
    const target = event.target;
    const putAwayEl = div.querySelector('.put-away');
    const linkEl = matchesOrContains(div, '.blurb a');
    const buttonEl = matchesOrContains(div, 'a.primary');

    trackClickFor(putAwayEl, target,
        ['Microdonation header X', 'close', 'Microdonation header']
    );
    if (linkEl) {
        trackClickFor(linkEl, target,
            ['Microdonation header learn more link', 'open', linkEl.href]
        );
    }
    if (buttonEl) {
        trackClickFor(buttonEl, target,
            ['Microdonation header give button', 'open', buttonEl.href]
        );
    }
}

function NoteWithImage({bannerInfo}) {
    return (
        <div className="content with-image">
            <img src={bannerInfo.banner_thumbnail} height="70" width="70" alt="" />
            <div className="text-side">
                <RawHTML className="blurb" html={bannerInfo.html_message} />
                <a className="cta" href={bannerInfo.link_url} data-nudge-action="interacted">
                    {bannerInfo.link_text}
                    <FontAwesomeIcon icon={faChevronRight} />
                </a>
            </div>
        </div>
    );
}

function NoteWithoutImage({bannerInfo}) {
    return (
        <div className="content">
            <RawHTML className="blurb" html={bannerInfo.html_message} />
            <a className="cta" href={bannerInfo.link_url} data-nudge-action="interacted">
                <FontAwesomeIcon icon={faHeart} className="red-heart" />
                {bannerInfo.link_text}
                <FontAwesomeIcon icon={faChevronRight} />
            </a>
        </div>
    );
}

export default function LowerStickyNote({stickyData, PutAway}) {
    return (
        <div
            className={
                cn(
                    'lower-sticky-note-content',
                    {'with-image': stickyData.bannerInfo.banner_thumbnail}
                )
            }
            onClick={trackClick}
            data-analytics-view
            data-analytics-nudge="donation"
            data-nudge-placement="banner"
        >
            <PutAway />
            {
                stickyData.bannerInfo.banner_thumbnail ?
                    <NoteWithImage bannerInfo={stickyData.bannerInfo} /> :
                    <NoteWithoutImage bannerInfo={stickyData.bannerInfo} />
            }
        </div>
    );
}
