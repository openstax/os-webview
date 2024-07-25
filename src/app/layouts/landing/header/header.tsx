import React from 'react';
import useOptimizedImage from '~/helpers/use-optimized-image';
import { LinkFields, Link } from '../../../pages/flex-page/components/Link';
import './header.scss';

export default function Header({links}: {links: LinkFields[]}) {
    const riceLogo = useOptimizedImage('https://openstax.org/dist/images/rice.webp', 150);

    return (
        <div className="container">
            <menu data-analytics-nav="Landing Menu">
                <li>
                    <a href="/" aria-label="Home Page" data-analytics-link>
                        <img src="/dist/images/logo.svg" alt="OpenStax logo" width="354" height="81" />
                    </a>
                </li>
                <li>
                    <a href="http://www.rice.edu">
                        <img src={riceLogo} alt="Rice University logo" height="57" width="150" />
                    </a>
                </li>
            </menu>
            <menu data-analytics-nav="Landing Menu">
                {links.map((link, i) => <li key={i}><Link link={link} /></li>)}
                <li>
                    <a href="/give" className="give-button" data-analytics-link>Give</a>
                </li>
            </menu>
        </div>
    );
}
