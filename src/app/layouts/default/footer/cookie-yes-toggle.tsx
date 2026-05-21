import React from 'react';
import {isGTMInitialized} from '~/helpers/tag-manager';

export default function CookieYesToggle() {
    // Only show the cookie toggle if GTM is loaded
    // (GTM is disabled on K12 portals, so the cookie banner won't be present)
    if (!isGTMInitialized()) {
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
