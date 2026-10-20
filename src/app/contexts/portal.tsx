import React from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import {assertNotNull} from '~/helpers/data';

function useContextValue() {
    const [portal, setPortal] = React.useState('');
    // Start with true (GTM disabled) until we determine it's safe to enable
    const [isK12Portal, setIsK12Portal] = React.useState<boolean>(true);
    const portalPrefix = portal ? `/${portal}` : '';
    const rewriteLinks = React.useCallback((container: HTMLElement) => {
        if (!portalPrefix) {return;}
        const linkNodes = container.querySelectorAll('a[href^="/"]');

        for (const node of linkNodes) {
            const href = assertNotNull(node.getAttribute('href'));

            // Nested containers rewrite the same links, and CMS links can already
            // point into the portal; a path starting with the portal name can only
            // be in the portal, since no other page can have that name
            if (href !== portalPrefix && !href.startsWith(`${portalPrefix}/`)) {
                node.setAttribute('href', `${portalPrefix}${href}`);
            }
        }
    },
    [portalPrefix]);

    return {portalPrefix, setPortal, rewriteLinks, isK12Portal, setIsK12Portal};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {useContext as default, ContextProvider as PortalContextProvider};
