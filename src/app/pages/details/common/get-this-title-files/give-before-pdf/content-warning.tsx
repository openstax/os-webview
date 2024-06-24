import React from 'react';

export default function ContentWarning({
    link, track, close, onDownload
}: {
    link: string;
    track: string | undefined;
    close: () => void;
    onDownload: (event: React.MouseEvent) => void;
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
        <div>
            <div>
                This material is intended for a post-secondary student audience,
                and includes descriptions and/or images of severe injury,
                assault, abuse, and exploitation. This content has been
                developed and extensively reviewed by nursing faculty and other
                experts, and aligns to course competencies regarding
                comprehensive, sensitive, patient-centered care.
            </div>
            <div className="button-row">
                <a
                    href={link}
                    {...(track ? {'data-track': track} : {})}
                    onClick={closeAfterDelay}
                    className="btn go-to"
                >
                    Go to your file
                </a>
            </div>
        </div>
    );
}
