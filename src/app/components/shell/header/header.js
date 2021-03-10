import React, {useRef} from 'react';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import StickyNote from './sticky-note/sticky-note';
import Menus from './menus/menus';
import $ from '~/helpers/$';
import {useToggle} from '~/components/jsx-helpers/jsx-helpers.jsx';
import cn from 'classnames';
import './header.css';

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

function Header() {
    return (
        <div className="page-header">
            <SkipToContent />
            <StickyNote />
            <Menus />
        </div>
    );
}

const HeaderConstructor = pageWrapper(Header);

export default new HeaderConstructor();
