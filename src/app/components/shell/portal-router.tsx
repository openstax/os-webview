import React from 'react';
import {RoutesAlsoInPortal} from './router';
import usePortalContext from '~/contexts/portal';
import {useParams} from 'react-router-dom';

export default function PortalRouter() {
    // If we want to validate the portal name, that can be done here
    const {portal, '*': rest} = useParams();
    const {setPortal} = usePortalContext();

    React.useEffect(() => {
        // It seems that the path "/press" in particular winds up matching
        // the portal-router Route, so we need to ensure it's really a portal
        // route by verifying that there's something after the :portal param
        if (rest) {
            setPortal(portal as string);
        }
    }, [rest, portal, setPortal]);

    return <RoutesAlsoInPortal />;
}
