import React, {Suspense} from 'react';
import LoadingPlaceholder from '~/components/loading-placeholder/loading-placeholder';

export default function JITLoad({importFn, ...componentParams}) {
    const Component = React.useMemo(
        () => React.lazy(importFn),
        [importFn]
    );

    return (
        <Suspense fallback={<LoadingPlaceholder />}>
            <Component {...componentParams} />
        </Suspense>
    );
}
