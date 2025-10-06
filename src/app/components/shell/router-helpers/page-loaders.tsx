import React, {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
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

function usePage(name: string) {
    return React.useMemo(() => {
        return loadable({
            loader: () => import(`~/pages/${name}/${name}`),
            loading: LoadingPlaceholder,
            render(loaded, props: object) {
                const Component = loaded.default;

                return <Component {...props} />;
            }
        });
    }, [name]);
}

export function ImportedPage({name}: {name: string}) {
    const {pathname} = useLocation();
    const Page = usePage(name);
    const {layoutParameters, setLayoutParameters} = useLayoutContext();

    if (layoutParameters.name === null) {
        setLayoutParameters();
    }

    useAnalyticsPageView();

    // Scroll to the top when the pathname changes
    // (Avoids scrolling when going to a new tab)
    useEffect(() => window.scrollTo(0, 0), [name, pathname]);

    return <Page />;
}
