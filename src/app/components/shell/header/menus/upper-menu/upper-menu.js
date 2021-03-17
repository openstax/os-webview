import React from 'react';
import {useDataFromSlug, useDataFromPromise} from '~/components/jsx-helpers/jsx-helpers.jsx';
import useGiveToday from '~/models/give-today';
import GiveButton from '../give-button/give-button';
import './upper-menu.css';

function BlogItem() {
    const data = useDataFromSlug('news');
    const shouldDisplay = data && Reflect.has(data, 'articles') &&
        Object.keys(data.articles).length;

    if (!shouldDisplay) {
        return null;
    }
    return (
        <a className="nav-menu" href="/blog">Blog</a>
    );
}

function GiveItem() {
    const giveData = useGiveToday();

    if (giveData.showButton) {
        return null;
    }
    return (
        <a className="nav-menu" href="/give" target="_blank" rel="noreferrer">Give</a>
    );
}

export default function UpperMenu() {
    return (
        <div className="container">
            <a className="nav-menu" href="/bookstore-suppliers">Bookstores</a>
            <a className="nav-menu" href="/impact">Our Impact</a>
            <a className="nav-menu" href="/foundation">Supporters</a>
            <BlogItem />
            <GiveItem />
            <a className="nav-menu" href="https://openstax.secure.force.com/help">Help</a>
            <a className="logo rice-logo logo-wrapper" href="http://www.rice.edu">
                <img src="/images/rice.png" alt="Rice University logo" height="30" />
            </a>
            <GiveButton />
        </div>
    );
}
