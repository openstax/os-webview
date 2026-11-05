import React from 'react';
import usePortalContext, {SchoolData} from '~/contexts/portal';

const k12School: SchoolData = {
    industry: 'K12',
    salesforceId: '0010000000school',
    researchAgreementActive: false
};
const otherSchool: SchoolData = {...k12School, industry: 'Higher Education'};

// Only the portals of K12 schools keep readers in the portal. This returns the
// same object each time, so setting it during render does not render again.
export function schoolDataFor(isK12Portal: boolean) {
    return isK12Portal ? k12School : otherSchool;
}

// Like the app, renders portal pages only once the portal is set. Needs to be
// inside a PortalContextProvider (or ShellContextProvider). The portal is a K12
// school portal, which keeps readers in the portal, unless isK12Portal is false.
export default function InPortal({portal, isK12Portal = true, children}: React.PropsWithChildren<{
    portal: string;
    isK12Portal?: boolean;
}>) {
    const {portalPrefix, setPortal, setSchoolData} = usePortalContext();

    React.useEffect(() => {
        setPortal(portal);
        setSchoolData(schoolDataFor(isK12Portal));
    }, [setPortal, setSchoolData, portal, isK12Portal]);

    return portalPrefix === `/${portal}` ? <React.Fragment>{children}</React.Fragment> : null;
}
