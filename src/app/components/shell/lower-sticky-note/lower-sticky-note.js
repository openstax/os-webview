import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {usePutAway, useStickyData} from '../shared.jsx';
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

function NoteWithImage({stickyData}) {
    return (
        <div className="content with-image">
            <img src={stickyData.image} alt="" />
            <div className="text-side">
                <RawHTML className="blurb" html={stickyData.body} />
                <a className="cta" href={stickyData.link}>
                    {stickyData.link_text}
                    <FontAwesomeIcon icon={faChevronRight} />
                </a>
            </div>
        </div>
    );
}

function NoteWithoutImage({stickyData}) {
    return (
        <div className="content">
            <RawHTML className="blurb" html={stickyData.body} />
            <a className="cta" href={stickyData.link}>
                <FontAwesomeIcon icon={faHeart} className="red-heart" />
                {stickyData.link_text}
                <FontAwesomeIcon icon={faChevronRight} />
            </a>
        </div>
    );
}

export default function LowerStickyNote() {
    const stickyData = useStickyData();
    const [closed, PutAway] = usePutAway();
    const shouldNotDisplay = !stickyData || closed ||
        stickyData.mode !== 'banner';

    if (shouldNotDisplay) {
        return null;
    }

    // STUBBING!!
    // stickyData.image = 'https://via.placeholder.com/140x100';


    return (
        <div className={cn('lower-sticky-note-content', {'with-image': stickyData.image})} onClick={trackClick}>
            <PutAway />
            {
                stickyData.image ?
                    <NoteWithImage stickyData={stickyData} /> :
                    <NoteWithoutImage stickyData={stickyData} />
            }
        </div>
    );
}
