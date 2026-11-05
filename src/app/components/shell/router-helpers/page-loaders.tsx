import React from 'react';
import loadable from 'react-loadable';
import * as Sentry from '@sentry/react';
import Error404 from '~/pages/404/404';
import LoadingPlaceholder from '~/components/loading-placeholder/loading-placeholder';
import LoadingFailure from '~/components/loading-placeholder/loading-failure';
import recoverFromStaleChunk from '~/helpers/stale-chunk';
import useLayoutContext from '~/contexts/layout';

type PageLoadingProps = {
    error?: Error;
    retry: () => void;
    pastDelay?: boolean;
};

// The CMS can serve a page whose React component no longer exists (a page
// type that was migrated to a FlexPage, for instance). Webpack's dynamic
// import rejects with MODULE_NOT_FOUND then, and retrying cannot help.
function isMissingPage(error?: Error) {
    return (error as {code?: string} | undefined)?.code === 'MODULE_NOT_FOUND';
}

// react-loadable catches the import rejection itself, so a page chunk that
// 404s after a deploy reaches neither the error boundary nor the
// unhandledrejection listener in stale-chunk. Recover here or the tab sits on
// the loader forever with nothing reported.
export function PageLoading({error, retry, pastDelay}: PageLoadingProps) {
    const missing = isMissingPage(error);

    React.useEffect(() => {
        if (error && !missing && !recoverFromStaleChunk(error)) {
            Sentry.captureException(error);
        }
    }, [error, missing]);

    if (missing) {
        return <Error404 />;
    }

    if (error) {
        return <LoadingFailure onRetry={retry} />;
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
