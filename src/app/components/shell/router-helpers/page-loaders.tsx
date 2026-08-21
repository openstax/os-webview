import React from 'react';
import loadable from 'react-loadable';
import LoadingPlaceholder from '~/components/loading-placeholder/loading-placeholder';
import useLayoutContext from '~/contexts/layout';

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
    const Page = usePage(name);
    const {layoutParameters, setLayoutParameters} = useLayoutContext();

    if (layoutParameters.name === null) {
        setLayoutParameters();
    }

    return <Page />;
}
