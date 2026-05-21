import React from 'react';

export default function CookieYesToggle() {
    const [cookieYesLoaded, setCookieYesLoaded] = React.useState(false);
    const handleCkyLoaded = React.useCallback(() => {
        if (!cookieYesLoaded && 'getCkyConsent' in window) {
            setCookieYesLoaded(true);
        }
    }, [cookieYesLoaded]);

    React.useEffect(() => {
        document.addEventListener('cookieyes_banner_load', handleCkyLoaded);
        return () => document.removeEventListener('cookieyes_banner_load', handleCkyLoaded);
    }, [handleCkyLoaded]);

    if (!cookieYesLoaded) {
        return null;
    }

    return (
        <button
            type="button"
            className="cky-banner-element small"
        >
            Manage cookies
        </button>
    );
}
