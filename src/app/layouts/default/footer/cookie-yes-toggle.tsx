import React from 'react';

// CookieYes fires its load event once, and the toggle can mount after that (it sits in
// the CMS footer columns, which arrive on a later request), so remember it here.
let cookieYesLoaded = false;

document.addEventListener('cookieyes_banner_load', () => {
    cookieYesLoaded ||= 'getCkyConsent' in window;
});

function isCookieYesReady() {
    return cookieYesLoaded && 'getCkyConsent' in window;
}

export default function CookieYesToggle() {
    const [ready, setReady] = React.useState(isCookieYesReady);

    React.useEffect(() => {
        const handleCkyLoaded = () => setReady(isCookieYesReady());

        document.addEventListener('cookieyes_banner_load', handleCkyLoaded);
        return () => document.removeEventListener('cookieyes_banner_load', handleCkyLoaded);
    }, []);

    if (!ready) {
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
