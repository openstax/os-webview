import {useState} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';

function useContextValue() {
    const [portal, setPortal] = useState('');

    return {portal, setPortal};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {useContext as default, ContextProvider as PortalContextProvider};
