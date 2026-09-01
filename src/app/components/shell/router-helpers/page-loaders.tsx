import React from 'react';
import loadable from 'react-loadable';
import * as Sentry from '@sentry/react';
import LoadingPlaceholder from '~/components/loading-placeholder/loading-placeholder';
import recoverFromStaleChunk from '~/helpers/stale-chunk';
import useLayoutContext from '~/contexts/layout';

type PageLoadingProps = {
    error?: Error;
    retry: () => void;
    pastDelay?: boolean;
};

// react-loadable catches the import rejection itself, so a page chunk that
// 404s after a deploy reaches neither the error boundary nor the
// unhandledrejection listener in stale-chunk. Recover here or the tab sits on
// the loader forever with nothing reported.
export function PageLoading({error, retry, pastDelay}: PageLoadingProps) {
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

    if (!pastDelay) {
        return null;
    }

    return <LoadingPlaceholder fullPage />;
}

function usePage(name: string) {
    return React.useMemo(() => {
        return loadable({
            loader: () => import(`~/pages/${name}/${name}`),
            loading: PageLoading,
            delay: 300,
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
