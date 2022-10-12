import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {useStickyData, useSeenCounter} from '../shared.js';
import analytics from '~/helpers/analytics';

const SEEN_ENOUGH = 3;

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
        ['Microdonation microsurvey X', 'close', 'Microdonation microsurvey']
    );
    if (linkEl) {
        trackClickFor(linkEl, target,
            ['Microdonation microsurvey learn more link', 'open', linkEl.href]
        );
    }
    if (buttonEl) {
        trackClickFor(buttonEl, target,
            ['Microdonation microsurvey give button', 'open', buttonEl.href]
        );
    }
}

function StickyContent({stickyData}) {
    const ref = React.useRef();

    React.useEffect(
        () => {
            const div = ref.current.parentNode;

            div.addEventListener('click', trackClick, true);

            return () => div.removeEventListener('click', trackClick, true);
        },
        []
    );

    return (
        <div className="microsurvey-content" ref={ref}>
            <RawHTML className="blurb" html={stickyData.body} />
            <a className="btn primary" href={stickyData.link}>
                {stickyData.link_text}
            </a>
        </div>
    );
}

function useBoundStickyContent(stickyData, incrementSeenCount) {
    // Increment seen count on each fresh load
    React.useEffect(
        () => incrementSeenCount(),
        [incrementSeenCount]
    );

    return React.useCallback(
        () => <StickyContent stickyData={stickyData} />,
        [stickyData]
    );
}

export default function useStickyMicrosurveyContent() {
    const stickyData = useStickyData();
    const [hasBeenSeenEnough, incrementSeenCount] = useSeenCounter(SEEN_ENOUGH);
    const BoundStickyContent = useBoundStickyContent(stickyData, incrementSeenCount);

    const ready = Boolean(
        stickyData?.mode === 'popup' && !hasBeenSeenEnough
    );

    return [ready, BoundStickyContent];
}
