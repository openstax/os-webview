import React from 'react';
import cookie from '~/helpers/cookie';

export default function ContentWarning({
    link, track, close, onDownload, variant, warning, id
}: {
    link: string;
    track: string | undefined;
    close: () => void;
    onDownload: (event: React.MouseEvent) => void;
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
            cookie.setKey(key, 'true', inAWeek());
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
    return cookieKey(id) in cookie.hash;
}

function inAWeek() {
    return new Date(Date.now() + 7 * 24 * 3600 * 1000);
}
