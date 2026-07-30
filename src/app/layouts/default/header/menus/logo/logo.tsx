import React from 'react';
import './logo.scss';

export default function Logo() {
    return (
        <span className="logo-wrapper streamlined">
            <span className="logo">
                <a href="/" aria-label="OpenStax" data-analytics-link>
                    <img
                        src="/dist/images/topnav-openstax.svg"
                        alt="OpenStax logo"
                        width="199"
                        height="111"
                    />
                </a>
            </span>
            <span className="logo-divider" aria-hidden="true" />
            <span className="rice-logo">
                <a href="https://www.rice.edu">
                    <img
                        src="/dist/images/topnav-rice.svg"
                        alt="Rice University logo"
                        width="227"
                        height="111"
                    />
                </a>
            </span>
        </span>
    );
}
