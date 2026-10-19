import React from 'react';
import buildContext from '~/components/jsx-helpers/build-context';

function useContextValue() {
    const [portal, setPortal] = React.useState('');
    const portalPrefix = portal ? `/${portal}` : '';
    const rewriteLinks = React.useCallback((container: HTMLElement) => {
        if (!portalPrefix) {return;}
        const linkNodes = container.querySelectorAll('a[href^="/"]');

        for (const node of linkNodes) {
            const href = node.getAttribute('href');

            node.setAttribute('href', `${portalPrefix}${href}`);
        }
    },
    [portalPrefix]);

    return {portalPrefix, setPortal, rewriteLinks};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {useContext as default, ContextProvider as PortalContextProvider};
