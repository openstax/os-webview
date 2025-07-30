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
}

export type TrackedMouseEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> & {
    trackingInfo: TrackingInfo;
};

function handleExternalLink(href: Location['href'], el: HTMLElement) {
    if (el.dataset.local === 'true') {
        // REX books open in the current window; track them
        window.location.href = href;
    } else {
        const newWindow = window.open(href, '_blank');

        if (newWindow === null) {
            window.location.href = href;
        }
    }
}

type State = NavigateOptions & {x: number; y: number};

function isPortalRoot(portalPrefix: string) {
    const pathname = window.location.pathname.replace(/\/$/, '');

    return Boolean(portalPrefix && portalPrefix === pathname);
}

export default function useLinkHandler() {
    const navigate = useNavigate();
    const navigateTo = useCallback(
        (path: Location['href'], state: State = {x: 0, y: 0}) => {
            navigate(linkHelper.stripOpenStaxDomain(path), state);
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
                retry(() =>
                    fetch(
                        `${$.apiOriginAndOldPrefix}/salesforce/download-tracking/`,
                        {
                            method: 'POST',
                            mode: 'cors',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(e.trackingInfo)
                        }
                    )
                )
                    .catch((err) => {
                        console.error(`Unable to download-track: ${err}`);
                    })
                    .finally(followLink);
            } else {
                followLink();
            }
        },
        [navigateTo, portalPrefix]
    );

    return linkHandler;
}
