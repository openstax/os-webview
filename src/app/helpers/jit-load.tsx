import React, {Suspense} from 'react';
import LoadingPlaceholder from '~/components/loading-placeholder/loading-placeholder';

export type ImportFunction<T> = () => Promise<{
    default: React.FunctionComponent<T>;
}>;
type Args<T> = {
    importFn: ImportFunction<T>;
} & T;
type ImportedComponent<T> = React.FunctionComponent<Omit<Args<T>, 'importFn'>>;

// importFn is a promise returning a function whose parameters are type T
// componentParams are those parameters
export default function JITLoad<T>({
    importFn,
    ...componentParams
}: Args<T>) {
    const Component = React.useMemo(
        () => React.lazy(importFn) as unknown as ImportedComponent<T>,
        [importFn]
    );

    return (
        <Suspense fallback={<LoadingPlaceholder />}>
            <Component {...componentParams} />
        </Suspense>
    );
}
