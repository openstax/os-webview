import React from 'react';
import JITLoad from '~/helpers/jit-load';
import {useStickyData} from '../shared.js';
import Menus from './menus/menus';
import $ from '~/helpers/$';
import { PageTitleConfirmation } from './announce-page-title';
import './header.scss';

function doSkipToContent(event) {
    event.preventDefault();
    const mainEl = document.getElementById('main');
    const target = mainEl.querySelector($.focusable);

    if (target) {
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
            <PageTitleConfirmation />
            <JITLoad importFn={() => import('./sticky-note/sticky-note.js')} stickyData={stickyData} />
            <Menus />
        </div>
    );
}
