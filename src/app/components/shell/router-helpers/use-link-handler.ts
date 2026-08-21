import {useCallback} from 'react';
import {useNavigate, NavigateOptions} from 'react-router-dom';
import linkHelper from '~/helpers/link';
import $ from '~/helpers/$';
import usePortalContext from '~/contexts/portal';
import retry from '~/helpers/retry';

export type TrackingInfo = {
    book: string;
    account_uuid: string;
    book_format?: string;
    contact_id?: string;
    resource_name?: string;
    role?: string;
    source?: string;
}

export type TrackedMouseEvent = React.MouseEvent<HTMLAnchorElement> & {
    trackingInfo?: TrackingInfo;
};

function handleExternalLink(href: Location['href'], el: HTMLElement) {
    if (el.dataset.local === 'true') {
        // REX books open in the current window; track them
        window.location.assign(href);
    } else {
        const newWindow = window.open(href, '_blank');

        if (newWindow === null) {
            window.location.assign(href);
        }
    }
}

type State = NavigateOptions & {x: number; y: number};

function isPortalRoot(portalPrefix: string) {
    const pathname = window.location.pathname.replace(/\/$/, '');

    return Boolean(portalPrefix && portalPrefix === pathname);
}

// The request goes out before the navigation but is never awaited. Awaiting it
// delays window.open past the click's user activation, and the popup blocker
// then turns "open the resource in a new tab" into "replace the app with it" —
// a ~300ms report is safely inside the window, but a retried one is not.
// keepalive is what makes not-awaiting safe: it lets the request outlive the
// page when the resource opens via location.assign instead of a new tab.
function reportDownload(trackingInfo: TrackingInfo) {
    retry(() =>
        fetch(`${$.apiOriginAndOldPrefix}/salesforce/download-tracking/`, {
            method: 'POST',
            mode: 'cors',
            keepalive: true,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(trackingInfo)
        })
    ).catch((err) => {
        console.error(`Unable to download-track: ${err}`);
    });
}

export default function useLinkHandler() {
    const navigate = useNavigate();
    const navigateTo = useCallback(
        (path: Location['href'], state: State = {x: 0, y: 0}) => {
            const stripped = linkHelper.stripOpenStaxDomain(path);

            if (stripped.startsWith('http')) {
                window.location.assign(stripped);
            } else {
                navigate(stripped, state);
            }
        },
        [navigate]
    );
    const {portalPrefix} = usePortalContext();
    const linkHandler = useCallback(
        (e: TrackedMouseEvent) => {
            // Only handle left-clicks on links
            const el = linkHelper.validUrlClick(e);

            if (!el || e.button !== 0) {
                return;
            }
            e.preventDefault();

            const fullyQualifiedHref = el.href;

            const followLink = () => {
                if (isPortalRoot(portalPrefix) || el.target || linkHelper.isExternal(fullyQualifiedHref)) {
                    handleExternalLink(fullyQualifiedHref, el);
                } else {
                    navigateTo(fullyQualifiedHref);
                }
            };

            // Pardot tracking
            if ('piTracker' in window && window.piTracker instanceof Function) {
                window.piTracker(fullyQualifiedHref.split('#')[0]);
            }

            if (e.trackingInfo) {
                reportDownload(e.trackingInfo);
            }
            followLink();
        },
        [navigateTo, portalPrefix]
    );

    return linkHandler;
}
