import React from 'react';
import usePortalContext from '~/contexts/portal';

// Wrapper component that enables GTM for non-portal routes
// Used for:
//   - Top-level routes: home, footer pages, errata, details
//   - No-data pages under /:dir/* (e.g., /adoption, /blog)
//
// The /:dir/* route itself is NOT wrapped at the router level because it
// includes portal routes that need conditional GTM handling via RouteAsPortalOrNot.
// However, specific non-portal sub-cases within /:dir/* (like no-data pages)
// use this wrapper to enable GTM.
export function NonPortalRouteWrapper({children}: {children: React.ReactNode}) {
    const {setIsK12Portal, setPortal} = usePortalContext();

    React.useEffect(() => {
        // These are all non-portal routes, so enable GTM
        setIsK12Portal(false);
        // Clear any stale portal prefix from previous navigation
        setPortal('');
    }, [setIsK12Portal, setPortal]);

    return <>{children}</>;
}
