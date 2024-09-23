import React from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import loadable from 'react-loadable';
import LoadingPlaceholder from '~/components/loading-placeholder/loading-placeholder';
import deepEqual from 'deep-equal';

// Webpack wasn't able to make the dynamic strings work in the Context value.
type LayoutName = 'default' | 'landing';
const loaders = {
    default: () => import('~/layouts/default/default'),
    landing: () => import('~/layouts/landing/landing')
};

type LayoutParameters = {
    name: LayoutName;
    data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}
const defaultLayoutParameters: LayoutParameters = {name: 'default'};

function useContextValue() {
    const [layoutParameters, setLayoutParameters] = React.useState(defaultLayoutParameters);
    const updateIfNotEqual = React.useCallback(
        (newValue?: LayoutParameters) => {
            if (newValue === undefined) {
                setLayoutParameters(defaultLayoutParameters);
                return;
            }
            if (deepEqual(layoutParameters, newValue)) {
                return;
            }
            setLayoutParameters(newValue);
        },
        [layoutParameters]
    );
    const LoadableLayout = React.useMemo(
        () =>
            loadable({
                loader: () => loaders[layoutParameters.name](),
                loading: LoadingPlaceholder
            }),
        [layoutParameters.name]
    );
    const Layout = React.useCallback(
        ({children}: React.PropsWithChildren<object>) => (
            <LoadableLayout data={layoutParameters.data}>{children}</LoadableLayout>
        ),
        [LoadableLayout, layoutParameters.data]
    );

    return {Layout, setLayoutParameters: updateIfNotEqual, layoutParameters};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {useContext as default, ContextProvider as LayoutContextProvider};
