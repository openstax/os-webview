import React from 'react';
import usePortalContext from '~/contexts/portal';

// Like the app, renders portal pages only once the portal is set. Needs to be
// inside a PortalContextProvider (or ShellContextProvider). The portal is a K12
// school portal, which keeps readers in the portal, unless isK12Portal is false.
export default function InPortal({portal, isK12Portal = true, children}: React.PropsWithChildren<{
    portal: string;
    isK12Portal?: boolean;
}>) {
    const {portalPrefix, setPortal, setIsK12Portal} = usePortalContext();

    React.useEffect(() => {
        setPortal(portal);
        setIsK12Portal(isK12Portal);
    }, [setPortal, setIsK12Portal, portal, isK12Portal]);

    return portalPrefix === `/${portal}` ? <React.Fragment>{children}</React.Fragment> : null;
}
