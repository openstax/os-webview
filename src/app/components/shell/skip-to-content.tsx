import React from 'react';
import $ from '~/helpers/$';
import './skip-to-content.scss';

// The link's href. When #main doesn't exist yet, the browser's own fragment
// navigation leaves this behind in the URL, and that is how the region knows,
// once it finally mounts, that somebody asked to be sent there.
const SKIP_TARGET_HASH = '#main';
const LINK_CLASS = 'skiptocontent';

// The skip link targets the main region itself rather than the first focusable
// thing inside it: #main carries tabIndex={-1} in every layout, and landing on
// a descendant would silently skip whatever content sits above it. Reports
// whether focus actually moved -- focus() is a no-op on an element that isn't
// focusable, so the caller has to be told rather than assume it took.
function focusMain() {
    const mainEl = document.getElementById('main');

    if (!mainEl) {
        return false;
    }

    mainEl.focus({preventScroll: true});

    if (document.activeElement !== mainEl) {
        return false;
    }
    // Ours to scroll only once the focus took. When it doesn't we leave the
    // click's default alone, the browser does its own fragment scroll, and a
    // second smooth scroll would be fighting it.
    $.scrollTo(mainEl);

    return true;
}

// Nobody else has taken focus since the click: it is still on the link, or on
// the body because nothing has claimed it, or already on #main -- a page's own
// useDocumentHead effect focuses the region on mount, and child effects run
// before the parent's, so we routinely arrive to find our own target focused.
// Being beaten to the focus by the thing we were going to focus is not a
// reason to skip the scroll that goes with it. Anything else is the user
// moving on while the layout loaded, and we leave them where they went.
function focusIsUnclaimed() {
    const active = document.activeElement;

    return (
        active === document.body ||
        active === document.getElementById('main') ||
        active === document.querySelector(`a.${LINK_CLASS}`)
    );
}

// Claim the focus the skip link asked for. A layout is what renders #main, so
// on a cold load the region can be missing at the moment a keyboard user
// reaches the link -- and the link is the first thing they reach. The click
// then falls through to the browser, which leaves #main in the URL and does
// nothing else; reading that here puts the answer where the region is created,
// rather than making the link watch the DOM for a region it doesn't own.
export function useSkipTargetFocus() {
    React.useEffect(() => {
        if (window.location.hash === SKIP_TARGET_HASH && focusIsUnclaimed()) {
            focusMain();
        }
    }, []);
}

export default function SkipToContent() {
    const onClick = React.useCallback(
        (event: React.MouseEvent<HTMLAnchorElement>) => {
            if (focusMain()) {
                event.preventDefault();
                return;
            }
            // Nothing to focus yet, so let the browser's own href="#main"
            // navigation stand: it leaves the hash behind for whichever layout
            // mounts #main. Keep the click away from the document-level link
            // handler, which would preventDefault it and route it instead --
            // a navigation that moves no focus and leaves no hash worth
            // reading.
            event.stopPropagation();
        },
        []
    );

    return (
        <a className={LINK_CLASS} href={SKIP_TARGET_HASH} onClick={onClick}>
            skip to main content
        </a>
    );
}
