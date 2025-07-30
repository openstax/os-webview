import React from 'react';
import Cookies from 'js-cookie';

export default function ContentWarning({
    link, track, close, onDownload, variant, warning, id
}: {
    link: string;
    track: string | undefined;
    close: () => void;
    onDownload?: React.MouseEventHandler;
    variant?: string;
    warning: string;
    id: string;
}) {
    const closeAfterDelay = React.useCallback(
        (event: React.MouseEvent) => {
            const key = cookieKey(id);

            if (onDownload) {
                onDownload(event);
            }
            Cookies.set(key, 'true', {expires: 28});
            window.setTimeout(close, 200);
        },
        [close, onDownload, id]
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

function cookieKey(id: string) {
    return `content-warning-${id}`;
}

export function checkWarningCookie(id: string) {
    return Cookies.get(id);
}
