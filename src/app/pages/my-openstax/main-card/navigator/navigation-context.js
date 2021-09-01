import {useState, useEffect} from 'react';
import {useLocation, useHistory} from 'react-router-dom';
import buildContext from '~/components/jsx-helpers/build-context';

function useContextValue(targetIds) {
    const [activeId, setActiveId] = useState(targetIds[0]);
    const {hash, pathname} = useLocation();
    const history = useHistory();

    useEffect(() => {
        if (hash.length > 1) {
            history.replace(pathname);
            setActiveId(hash.substr(1));
        }
    }, [hash, pathname, history]);

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
