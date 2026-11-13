import React from 'react';
import './loading-failure.scss';

// Shown in place of the loading placeholder once we know the data is not
// coming. Without it a failed fetch is indistinguishable from a slow one.
export default function LoadingFailure({onRetry}: {onRetry: () => void}) {
    return (
        <div className="os-loading-failure" role="alert">
            <h2>This page didn&apos;t load</h2>
            <p>Something went wrong on our end. Please try again.</p>
            <button type="button" className="btn primary" onClick={onRetry}>
                Try again
            </button>
        </div>
    );
}
