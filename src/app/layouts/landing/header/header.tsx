import React from 'react';
import useOptimizedImage from '~/helpers/use-optimized-image';
import {LinkFields, Link} from '../../../pages/flex-page/components/Link';
import './header.scss';

export default function Header({
    links,
    showGive = true
}: {
    links: LinkFields[];
    showGive?: boolean;
}) {
    const riceLogo = useOptimizedImage(
        'https://assets.openstax.org/oscms-prodcms/media/images/rice-logo-blue.original.webp',
        150
    );

    return (
        <div className="container" data-analytics-label="Header">
            <div className="pseudo-menu">
                <img
                    src="/dist/images/logo.svg"
                    alt="OpenStax logo"
                    width="354"
                    height="81"
                />
                <img
                    src={riceLogo}
                    alt="Rice University logo"
                    height="57"
                    width="150"
                />
            </div>
            <menu data-analytics-nav="Landing Menu">
                {links.map((link, i) => (
                    <li key={i}>
                        <Link link={link} />
                    </li>
                ))}
                {showGive && (
                    <li>
                        <a
                            href="https://riceconnect.rice.edu/donation/support-openstax-header"
                            className="give-button"
                            data-analytics-link
                        >
                            Give
                        </a>
                    </li>
                )}
            </menu>
        </div>
    );
}
