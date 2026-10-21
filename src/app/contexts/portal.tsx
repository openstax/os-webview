import React from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import {assertNotNull} from '~/helpers/data';

function useContextValue() {
    const [portal, setPortal] = React.useState('');
    // Start with true (GTM disabled) until we determine it's safe to enable
    const [isK12Portal, setIsK12Portal] = React.useState<boolean>(true);
    const portalPrefix = portal ? `/${portal}` : '';
    // Site links get the portal prefix; other links are returned as they are.
    // A path starting with the portal name can only be in the portal, since no
    // other page can have that name, so links already in the portal (whether
    // rewritten by a nested container or written that way in the CMS) are kept.
    const hrefInPortal = React.useCallback(
        (href: string) => portalPrefix &&
            href.startsWith('/') &&
            href !== portalPrefix &&
            !href.startsWith(`${portalPrefix}/`)
            ? `${portalPrefix}${href}`
            : href,
        [portalPrefix]
    );
    const rewriteLinks = React.useCallback((container: HTMLElement) => {
        if (!portalPrefix) {return;}
        const linkNodes = container.querySelectorAll('a[href^="/"]');

        for (const node of linkNodes) {
            node.setAttribute('href', hrefInPortal(assertNotNull(node.getAttribute('href'))));
        }
    },
    [portalPrefix, hrefInPortal]);

    return {portalPrefix, setPortal, hrefInPortal, rewriteLinks, isK12Portal, setIsK12Portal};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {useContext as default, ContextProvider as PortalContextProvider};
