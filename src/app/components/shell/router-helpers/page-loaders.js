import React, {useEffect} from 'react';
import {
    Navigate,
    useLocation
} from 'react-router-dom';
import loadable from 'react-loadable';
import LoadingPlaceholder from '~/components/loading-placeholder/loading-placeholder';
import useLayoutContext from '~/contexts/layout';

function useAnalyticsPageView() {
    const location = useLocation();
    const isRedirect = location.state?.redirect;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [isRedirect]);
}

function useLoading(name) {
    const {pathname} = useLocation();

    return React.useCallback(
        ({error, pastDelay, retry}) => {
            if (error) {
                if (error.code === 'MODULE_NOT_FOUND') {
                    return pathname.endsWith('/')
                    ? <h1>{name} did not load (module not found)</h1> // I don't think we ever get here
                    : <Navigate to={`${pathname}/`} replace />;
                }
                return <div>Error! <button onClick={ retry }>Retry</button></div>;
            }
            if (pastDelay) {
                return <LoadingPlaceholder />;
            }
            return null;
        },
        [name, pathname]
    );
}

function usePage(name) {
    const loading = useLoading(name);

    return React.useMemo(
        () => loadable({
            loader: () => import(`~/pages/${name}/${name}`),
            loading,
            render(loaded, props) {
                const Component = loaded.default;

                return <Component {...props} />;
            }
        }),
        [name, loading]
    );
}

export function ImportedPage({name}) {
    const {pathname} = useLocation();
    const Page = usePage(name);
    const {layoutParameters, setLayoutParameters} = useLayoutContext();

    if (layoutParameters.name === null) {
        setLayoutParameters();
    }

    useAnalyticsPageView();

    // Scroll to the top when the pathname changes
    // (Avoids scrolling when going to a new tab)
    useEffect(
        () => window.scrollTo(0, 0),
        [name, pathname]
    );

    return <Page />;
}

