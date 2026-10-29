import React from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import {assertNotNull} from '~/helpers/data';
import {OTHER_SERVICE_PATH_NAMES} from '~/helpers/link';

export type SchoolData = {
    industry: string;
    salesforceId: string;
    researchAgreementActive: boolean;
};

// Paths the server sends to other apps or services, which are never os-webview pages
const OTHER_APP_PATH = new RegExp(
    `^/(?:apps|r|l|${OTHER_SERVICE_PATH_NAMES.join('|')})(?:[/?#]|$)`
);
// REX book pages, which REX shows in a portal under its own portal path. A bare
// /books/<title> is not one: the server redirects it to the book's details page.
const REX_BOOK_PATH = /^\/books\/(?=[^/?#]+\/pages\/)/;

// This site's own origin, and openstax.org with or without www (the CMS uses
// both). Relative paths and anything malformed (CMS links are typed in by hand)
// don't parse.
function isAbsoluteSiteUrl(href: string) {
    try {
        const {protocol, origin, hostname} = new URL(href);

        return ['http:', 'https:'].includes(protocol) &&
            (origin === window.location.origin || ['openstax.org', 'www.openstax.org'].includes(hostname));
    } catch {
        return false;
    }
}

function pathOfUrl(href: string) {
    const {pathname, search, hash} = new URL(href);

    return `${pathname}${search}${hash}`;
}

// A path starting with the portal name can only be in the portal, since no
// other page can have that name, so links already in the portal (whether
// rewritten by a nested container or written that way in the CMS) are kept.
// The portal name ends at a slash, query, fragment or the end of the path.
function isInPortal(path: string, portalPrefix: string) {
    const nextCharacter = path.charAt(portalPrefix.length);

    return path.startsWith(portalPrefix) && ['', '/', '?', '#'].includes(nextCharacter);
}

// The rest of a path after the portal prefix. A path that isn't in the portal is
// returned as it is, instead of being cut at the wrong place.
export function pathAfterPrefix(path: string, portalPrefix: string) {
    return isInPortal(path, portalPrefix) ? path.slice(portalPrefix.length) : path;
}

// A path on this site, not //other-host
function isSitePath(path: string) {
    return path.startsWith('/') && !path.startsWith('//');
}

function hrefInPortalFor(href: string, portalPrefix: string) {
    const path = isAbsoluteSiteUrl(href) ? pathOfUrl(href) : href;

    if (!isSitePath(path) || isInPortal(path, portalPrefix)) {
        return href;
    }
    if (REX_BOOK_PATH.test(path)) {
        return path.replace(REX_BOOK_PATH, `/apps/rex/portal${portalPrefix}/books/`);
    }
    return OTHER_APP_PATH.test(path) ? href : `${portalPrefix}${path}`;
}

function rewriteLinksInPortal(container: HTMLElement, portalPrefix: string) {
    const linkNodes = container.querySelectorAll('a[href]');

    for (const node of linkNodes) {
        const href = assertNotNull(node.getAttribute('href'));
        const newHref = hrefInPortalFor(href, portalPrefix);

        if (newHref !== href) {
            node.setAttribute('href', newHref);
        }
    }
}

// What other portals have always done: prefix relative links. Links that already
// have the prefix are left alone, so containers can be rewritten more than once.
function prefixRelativeLinks(container: HTMLElement, portalPrefix: string) {
    const linkNodes = container.querySelectorAll('a[href^="/"]');

    for (const node of linkNodes) {
        const href = assertNotNull(node.getAttribute('href'));

        if (!isInPortal(href, portalPrefix)) {
            node.setAttribute('href', `${portalPrefix}${href}`);
        }
    }
}

function useContextValue() {
    const [portal, setPortal] = React.useState('');
    // The school the portal belongs to, or null when the page is not in a school's portal
    const [schoolData, setSchoolData] = React.useState<SchoolData | null>(null);
    const isK12Portal = schoolData?.industry === 'K12';
    const portalPrefix = portal ? `/${portal}` : '';
    // Only K12 school portals keep readers in the portal, so this is the prefix
    // for site links there, and empty everywhere else
    const linkPrefix = isK12Portal ? portalPrefix : '';
    // In a K12 portal, links to os-webview pages on this site get the portal
    // prefix, and links to REX books go to REX's portal path; other links are
    // returned as they are.
    const hrefInPortal = React.useCallback(
        (href: string) => linkPrefix ? hrefInPortalFor(href, linkPrefix) : href,
        [linkPrefix]
    );
    const rewriteLinks = React.useCallback((container: HTMLElement) => {
        if (linkPrefix) {
            rewriteLinksInPortal(container, linkPrefix);
        } else if (portalPrefix) {
            prefixRelativeLinks(container, portalPrefix);
        }
    },
    [portalPrefix, linkPrefix]);

    return {
        portal, portalPrefix, linkPrefix, setPortal, schoolData, setSchoolData, isK12Portal, hrefInPortal, rewriteLinks
    };
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {useContext as default, ContextProvider as PortalContextProvider};
