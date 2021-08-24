import {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import buildContext from '~/components/jsx-helpers/build-context';

function useContextValue(targetIds) {
    const [activeId, setActiveId] = useState(targetIds[0]);
    const loc = useLocation();

    useEffect(() => {
        const hash = loc.hash;

        if (hash.length > 1) {
            window.history.replaceState(history.state, '', loc.pathname + loc.search);
            setActiveId(hash.substr(1));
        }
    }, [loc]);

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
