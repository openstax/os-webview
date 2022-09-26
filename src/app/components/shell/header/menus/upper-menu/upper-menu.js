import React from 'react';
import JITLoad from '~/helpers/jit-load';
import {useDataFromSlug} from '~/helpers/page-data-utils';
import useGiveToday from '~/models/give-today';
import './upper-menu.scss';

function BlogItem() {
    const data = useDataFromSlug(
        'pages?type=news.newsArticle&fields=id&limit=3'
    );

    const shouldDisplay = data?.items?.length > 0;

    if (!shouldDisplay) {
        return null;
    }
    return (
        <a className="nav-menu" href="/blog">Blog</a>
    );
}

function GiveItem() {
    return (
        <a
            className="nav-menu" target="_blank" rel="noreferrer"
            href="https://riceconnect.rice.edu/donation/support-openstax-header"
        >
            Give
        </a>
    );
}

export default function UpperMenu() {
    const {showButton} = useGiveToday();
    const importGiveButton = React.useCallback(() => import('../give-button/give-button'), []);

    return (
        <div className="container">
            <a className="nav-menu" href="/bookstore-suppliers">Bookstores</a>
            <a className="nav-menu" href="/impact">Our Impact</a>
            <a className="nav-menu" href="/foundation">Supporters</a>
            <BlogItem />
            {showButton ? null : <GiveItem />}
            <a className="nav-menu" href="https://openstax.secure.force.com/help">Help</a>
            <a className="logo rice-logo logo-wrapper" href="http://www.rice.edu">
                <img src="/dist/images/rice.webp" alt="Rice University logo" height="30" width="79" />
            </a>
            {showButton ? <JITLoad importFn={importGiveButton} /> : null}
        </div>
    );
}
