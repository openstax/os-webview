import React, {Suspense} from 'react';

export default function JITLoad({importFn, ...componentParams}) {
    const Component = React.useMemo(
        () => React.lazy(importFn),
        [importFn]
    );

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Component {...componentParams} />
        </Suspense>
    );
}
