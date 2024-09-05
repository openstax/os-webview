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

type LayoutParameters = {
    name: LayoutName;
    data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}
const defaultLayoutParameters: LayoutParameters = {name: 'default'};

function useContextValue() {
    const [layoutParameters, setLayoutParameters] = React.useReducer(
        (state: LayoutParameters, newState: LayoutParameters) => {
            if (newState === undefined) {
                return defaultLayoutParameters;
            }
            if (state.name === newState.name && (
                JSON.stringify(state.data) === JSON.stringify(newState.data) ||
                state.name === 'default'
            )) {
                return state;
            }
            return newState;
        },
        defaultLayoutParameters
    );
    const layoutData = React.useMemo(
        () => layoutParameters.name === 'default' ? undefined : layoutParameters.data,
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
            <LoadableLayout data={layoutData}>{children}</LoadableLayout>
        ),
        [LoadableLayout, layoutData]
    );

    return {Layout, setLayoutParameters};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {useContext as default, ContextProvider as LayoutContextProvider};
