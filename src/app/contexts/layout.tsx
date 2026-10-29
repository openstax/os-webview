import React from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import loadable from 'react-loadable';
import ChromeFallback from '~/components/shell/chrome-fallback';
import {DelayedFallback} from '~/helpers/jit-load';
import deepEqual from 'deep-equal';

// Webpack wasn't able to make the dynamic strings work in the Context value.
export type LayoutName = 'default' | 'landing';
const loaders = {
    default: () => import('~/layouts/default/default'),
    landing: () => import('~/layouts/landing/landing')
};
// Landing pages, portals among them, bring their own header, so the default
// nav must not stand in for it while their layout loads.
const fallbacks = {
    default: ChromeFallback,
    landing: () => <DelayedFallback fullPage />
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
    const Layout = React.useCallback(
        ({children}: React.PropsWithChildren<object>) => {
            const layoutParameterName = layoutParameters.name;

            if (layoutParameterName === null) {
                return <div>{children}</div>;
            }
            const LoadableLayout = loadable({
                loader: () => loaders[layoutParameterName](),
                loading: fallbacks[layoutParameterName]
            });

            // Avoids initial flash default -> landing
            return (
                <LoadableLayout data={layoutParameters.data}>
                    {children}
                </LoadableLayout>
            );
        },
        [layoutParameters.data, layoutParameters.name]
    );

    return {Layout, setLayoutParameters: updateIfNotEqual, layoutParameters};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {useContext as default, ContextProvider as LayoutContextProvider};
