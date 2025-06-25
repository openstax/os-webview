import React from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import loadable from 'react-loadable';
import LoadingPlaceholder from '~/components/loading-placeholder/loading-placeholder';
import deepEqual from 'deep-equal';

// Webpack wasn't able to make the dynamic strings work in the Context value.
export type LayoutName = 'default' | 'landing';
const loaders = {
    default: () => import('~/layouts/default/default'),
    landing: () => import('~/layouts/landing/landing')
};

type LayoutParameters = {
    name: LayoutName | null;
    data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};
const defaultLayoutParameters: LayoutParameters = {name: 'default'};
const initialLayoutParameters: LayoutParameters = {name: null};

function useContextValue() {
    const [layoutParameters, setLayoutParameters] = React.useState(
        initialLayoutParameters
    );
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
                loader: () =>
                    loaders[
                        layoutParameters.name as Exclude<LayoutName, null>
                    ](),
                loading: LoadingPlaceholder
            }),
        [layoutParameters.name]
    );
    const Layout = React.useCallback(
        ({children}: React.PropsWithChildren<object>) => {
            // Avoids initial flash default -> landing
            return layoutParameters.name === null ? (
                <div>{children}</div>
            ) : (
                <LoadableLayout data={layoutParameters.data}>
                    {children}
                </LoadableLayout>
            );
        },
        [LoadableLayout, layoutParameters.data, layoutParameters.name]
    );

    return {Layout, setLayoutParameters: updateIfNotEqual, layoutParameters};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {useContext as default, ContextProvider as LayoutContextProvider};
