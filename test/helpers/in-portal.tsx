import React from 'react';
import usePortalContext from '~/contexts/portal';

// Like the app, renders portal pages only once the portal is set. Needs to be
// inside a PortalContextProvider (or ShellContextProvider).
export default function InPortal({portal, children}: React.PropsWithChildren<{portal: string}>) {
    const {portalPrefix, setPortal} = usePortalContext();

    React.useEffect(() => setPortal(portal), [setPortal, portal]);

    return portalPrefix === `/${portal}` ? <React.Fragment>{children}</React.Fragment> : null;
}
