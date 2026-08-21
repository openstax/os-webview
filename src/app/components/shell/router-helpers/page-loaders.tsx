import React from 'react';
import loadable from 'react-loadable';
import * as Sentry from '@sentry/react';
import LoadingPlaceholder from '~/components/loading-placeholder/loading-placeholder';
import recoverFromStaleChunk from '~/helpers/stale-chunk';
import useLayoutContext from '~/contexts/layout';

// react-loadable catches the import rejection itself, so a page chunk that
// 404s after a deploy reaches neither the error boundary nor the
// unhandledrejection listener in stale-chunk. Recover here or the tab sits on
// the loader forever with nothing reported.
export function PageLoading({error, retry}: {error?: Error; retry: () => void}) {
    React.useEffect(() => {
        if (error && !recoverFromStaleChunk(error)) {
            Sentry.captureException(error);
        }
    }, [error]);

    if (error) {
        return (
            <div>
                <p>This page did not load.</p>
                <button type="button" onClick={retry}>
                    Try again
                </button>
            </div>
        );
    }

    return <LoadingPlaceholder />;
}

function usePage(name: string) {
    return React.useMemo(() => {
        return loadable({
            loader: () => import(`~/pages/${name}/${name}`),
            loading: PageLoading,
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
