import {useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import buildContext from '~/components/jsx-helpers/build-context';

function useContextValue(targetIds) {
    const [activeId, setActiveId] = useState(targetIds[0]);
    const {hash, pathname} = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (hash.length > 1) {
            navigate(pathname, {replace: true});
            setActiveId(hash.substr(1));
        }
    }, [hash, pathname, navigate]);

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
