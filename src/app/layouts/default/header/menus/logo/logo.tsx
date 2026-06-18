import React from 'react';
import useOptimizedImage from '~/helpers/use-optimized-image';
import './logo.scss';

const riceLogoSrc =
    'https://assets.openstax.org/oscms-prodcms/media/images/rice-logo-blue.original.webp';

export default function Logo() {
    const riceLogo = useOptimizedImage(riceLogoSrc, 80);

    return (
        <span className="logo-wrapper">
            <span className="logo">
                <a href="/" aria-label="Openstax" data-analytics-link>
                    <img
                        className="logo-color" src="/dist/images/logo.svg" alt="OpenStax logo"
                        width="354" height="81"
                    />
                    <img className="logo-white" src="/dist/images/logo-white.svg" alt="OpenStax logo" />
                </a>
            </span>
            <span className="logo-divider" aria-hidden="true" />
            <span className="rice-logo">
                <a href="https://www.rice.edu">
                    <img src={riceLogo} alt="Rice University logo" height="30" width="79" />
                </a>
            </span>
        </span>
    );
}
