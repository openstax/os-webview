import React from 'react';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {usePutAway, useStickyData} from '../shared.jsx';
import analytics from '~/helpers/analytics';
import './lower-sticky-note.css';

function trackClickFor(el, target, eventArgs) {
    if (el && el.contains(target)) {
        analytics.sendPageEvent(...eventArgs);
    }
}

function trackClick(event) {
    const div = event.currentTarget;
    const target = event.target;
    const putAwayEl = div.querySelector('.put-away');
    const linkEl = div.querySelector('.blurb a');
    const buttonEl = div.querySelector('a.primary');

    trackClickFor(putAwayEl, target,
        ['Microdonation header X', 'close', 'Microdonation header']
    );
    trackClickFor(linkEl, target,
        ['Microdonation header learn more link', 'open', linkEl.href]
    );
    trackClickFor(buttonEl, target,
        ['Microdonation header give button', 'open', buttonEl.href]
    );
}

// eXslint-disable-next-line complexity
function LowerStickyNote() {
    const stickyData = useStickyData();
    const [closed, PutAway] = usePutAway();
    const shouldNotDisplay = !stickyData || closed ||
        stickyData.mode !== 'banner';

    if (shouldNotDisplay) {
        return null;
    }

    return (
        <div className="lower-sticky-note-content" onClick={trackClick}>
            <PutAway />
            <div className="content">
                <h1>{stickyData.header}</h1>
                <RawHTML className="blurb" html={stickyData.body} />
                <a className="btn primary" href={stickyData.link}>
                    {stickyData.link_text}
                </a>
            </div>
        </div>
    );
}

export default new (pageWrapper(LowerStickyNote))();
