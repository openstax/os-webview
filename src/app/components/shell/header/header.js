import React from 'react';
import JITLoad from '~/helpers/jit-load';
import {useStickyData} from '../shared.jsx';
import Menus from './menus/menus';
import $ from '~/helpers/$';
import './header.scss';

function doSkipToContent(event) {
    event.preventDefault();
    const mainEl = document.getElementById('main');
    const focusableItems = Array.from(mainEl.querySelectorAll($.focusable));

    if (focusableItems.length > 0) {
        const target = focusableItems[0];

        $.scrollTo(target);
        target.focus();
    }
}

function SkipToContent() {
    return (
        <a className="skiptocontent" href="#main" onClick={doSkipToContent}>skip to main content</a>
    );
}

export default function Header() {
    const stickyData = useStickyData();

    return (
        <div className="page-header">
            <SkipToContent />
            <JITLoad importFn={() => import('./sticky-note/sticky-note.js')} stickyData={stickyData} />
            <Menus />
        </div>
    );
}
