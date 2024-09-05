import React from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import loadable from 'react-loadable';
import LoadingPlaceholder from '~/components/loading-placeholder/loading-placeholder';

// Webpack wasn't able to make the dynamic strings work in the Context value.
type LayoutName = 'default' | 'landing';
const loaders = {
    default: () => import('~/layouts/default/default'),
    landing: () => import('~/layouts/landing/landing')
};

function useContextValue() {
    const [layoutName, setLayoutName] = React.useState<LayoutName>('default');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [layoutData, setLayoutData] = React.useState<any>(undefined);
    const LoadableLayout = React.useMemo(
        () =>
            loadable({
                loader: () => loaders[layoutName](),
                loading: LoadingPlaceholder
            }),
        [layoutName]
    );
    const Layout = React.useCallback(
        ({children}: React.PropsWithChildren<object>) => (
            <LoadableLayout data={layoutData}>{children}</LoadableLayout>
        ),
        [LoadableLayout, layoutData]
    );
    const setLayoutParameters = React.useCallback(
        // eslint-disable-next-line no-shadow
        (
            {name, data}: {name: LayoutName; data?: unknown} = {name: 'default'}
        ) => {
            setLayoutName(name);
            // Optimization: it doesn't matter whether data gets reset if it is undefined
            if (
                JSON.stringify(data) !== JSON.stringify(layoutData) &&
                data !== undefined
            ) {
                setLayoutData(data);
            }
        },
        [layoutData]
    );

    return {Layout, setLayoutParameters};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {useContext as default, ContextProvider as LayoutContextProvider};
