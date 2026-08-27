import React, {Suspense, useEffect, useState} from 'react';
import LoadingPlaceholder from '~/components/loading-placeholder/loading-placeholder';

export type ImportFunction<T> = () => Promise<{
    default: React.FunctionComponent<T>;
}>;
type Args<T> = {
    importFn: ImportFunction<T>;
    fallback?: React.ReactNode;
} & T;
type ImportedComponent<T> = React.FunctionComponent<Omit<Args<T>, 'importFn' | 'fallback'>>;

const FALLBACK_DELAY_MS = 300;

// A Suspense fallback has no way to know how long its chunk has been
// loading, so the delay before showing anything lives here instead.
export function DelayedFallback({fullPage = false}: {fullPage?: boolean}) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const timer = window.setTimeout(() => setReady(true), FALLBACK_DELAY_MS);

        return () => window.clearTimeout(timer);
    }, []);

    return ready ? <LoadingPlaceholder fullPage={fullPage} /> : null;
}

// importFn is a promise returning a function whose parameters are type T
// componentParams are those parameters
export default function JITLoad<T>({
    importFn,
    fallback = <DelayedFallback />,
    ...componentParams
}: Args<T>) {
    const Component = React.useMemo(
        () => React.lazy(importFn) as unknown as ImportedComponent<T>,
        [importFn]
    );

    return (
        <Suspense fallback={fallback}>
            <Component {...componentParams} />
        </Suspense>
    );
}
