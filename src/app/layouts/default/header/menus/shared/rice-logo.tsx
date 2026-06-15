import React from 'react';
import useOptimizedImage from '~/helpers/use-optimized-image';

export default function RiceLogo() {
    const riceLogo = useOptimizedImage(
        'https://assets.openstax.org/oscms-prodcms/media/images/rice-logo-blue.original.webp',
        80
    );

    return (
        <li className="logo rice-logo logo-wrapper">
            <a href="https://www.rice.edu">
                <img src={riceLogo} alt="Rice University logo" height="30" width="79" />
            </a>
        </li>
    );
}
