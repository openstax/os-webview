import React from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import type {SchoolData} from '~/pages/flex-page/flex-page';

// name is '' and schoolData is null when the page is not in a portal;
// schoolData is also null for a portal that is not linked to a school
type Portal = {
    name: string;
    schoolData: SchoolData | null;
};

function useContextValue() {
    // null until routing knows which portal, if any, the page is in;
    // analytics must not load before then
    const [portal, setPortalState] = React.useState<Portal | null>(null);
    // Routing calls this while rendering, so it keeps the same object when nothing changed;
    // a new object every time would re-render forever
    const setPortal = React.useCallback((name: string, schoolData: SchoolData | null = null) => setPortalState(
        (previous) => previous?.name === name && previous.schoolData === schoolData
            ? previous
            : {name, schoolData}
    ), []);
    const portalPrefix = portal?.name ? `/${portal.name}` : '';
    const rewriteLinks = React.useCallback((container: HTMLElement) => {
        if (!portalPrefix) {return;}
        const linkNodes = container.querySelectorAll('a[href^="/"]');

        for (const node of linkNodes) {
            const href = node.getAttribute('href');

            node.setAttribute('href', `${portalPrefix}${href}`);
        }
    },
    [portalPrefix]);

    return {
        portalPrefix,
        setPortal,
        rewriteLinks,
        portal
    };
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {useContext as default, ContextProvider as PortalContextProvider};
