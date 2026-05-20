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

    // Clear portal state during render (not in useEffect) to prevent race conditions
    // This follows the same pattern as RouteAsPortalOrNot for non-portal pages
    // (portal-page-routes.tsx:70-71) which calls setters synchronously during render.
    // This ensures FlexPage's useLayoutEffect sees the correct portal state and
    // doesn't rewrite links with a stale portal prefix.
    setPortal('');
    setIsK12Portal(false);

    return <>{children}</>;
}
