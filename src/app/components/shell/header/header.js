import React from 'react';
import StickyNote from './sticky-note/sticky-note';
import Menus from './menus/menus';
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
    return (
        <div className="page-header">
            <SkipToContent />
            <StickyNote />
            <Menus />
        </div>
    );
}
