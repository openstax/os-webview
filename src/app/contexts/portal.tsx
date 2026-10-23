import React from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import {assertNotNull} from '~/helpers/data';

// Paths the server sends to other apps or services, which are never os-webview pages
const OTHER_APP_PATH = /^\/(?:apps|accounts|oxauth|r|l|blog-feed|documents)(?:[/?#]|$)/;
// REX book pages, which REX shows in a portal under its own portal path
const REX_BOOK_PATH = /^(?:\/apps\/rex)?\/books\//;

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

// What other portals have always done: prefix relative links, without checking
// whether they already have it
function prefixRelativeLinks(container: HTMLElement, portalPrefix: string) {
    const linkNodes = container.querySelectorAll('a[href^="/"]');

    for (const node of linkNodes) {
        const href = node.getAttribute('href');

        node.setAttribute('href', `${portalPrefix}${href}`);
    }
}

function useContextValue() {
    const [portal, setPortal] = React.useState('');
    // Start with true (GTM disabled) until we determine it's safe to enable
    const [isK12Portal, setIsK12Portal] = React.useState<boolean>(true);
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

    return {portalPrefix, linkPrefix, setPortal, hrefInPortal, rewriteLinks, isK12Portal, setIsK12Portal};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {useContext as default, ContextProvider as PortalContextProvider};
