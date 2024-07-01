import React from 'react';

export default function ContentWarning({
    link, track, close, onDownload, variant, warning
}: {
    link: string;
    track: string | undefined;
    close: () => void;
    onDownload: (event: React.MouseEvent) => void;
    variant?: string;
    warning: string;
}) {
    const closeAfterDelay = React.useCallback(
        (event: React.MouseEvent) => {
            if (onDownload) {
                onDownload(event);
            }
            window.setTimeout(close, 200);
        },
        [close, onDownload]
    );

    return (
        <div className="give-before-pdf">
            <div className="text-content">
                {warning}
            </div>
            <a
                href={link}
                {...(track ? {'data-track': track} : {})}
                onClick={closeAfterDelay}
                className="btn go-to"
            >
                Go to your {variant === 'View online' ? 'book' : 'file'}
            </a>
        </div>
    );
}
