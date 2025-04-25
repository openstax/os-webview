import React from 'react';
import {RoutesAlsoInPortal} from './router';
import usePortalContext from '~/contexts/portal';
import {useParams} from 'react-router-dom';

export default function PortalRouter() {
    // If we want to validate the portal name, that can be done here
    const {portal} = useParams();
    const {setPortal} = usePortalContext();

    React.useEffect(() => setPortal(portal as string), [portal, setPortal]);

    return <RoutesAlsoInPortal />;
}
