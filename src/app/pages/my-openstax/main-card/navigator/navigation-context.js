import {useState} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';

function useContextValue(targetIds) {
    const initialId = window.location.hash.substr(1) || targetIds[0];
    const [activeId, setActiveId] = useState(initialId);

    return {
        activeId,
        setActiveId,
        targetIds
    };
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as NavigationContextProvider
};
