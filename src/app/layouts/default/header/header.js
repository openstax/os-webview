import React from 'react';
import JITLoad from '~/helpers/jit-load';
import {useStickyData} from '../shared.js';
import Menus from './menus/menus';
import './header.scss';

export default function Header() {
    const stickyData = useStickyData();

    return (
        <div className="page-header">
            <JITLoad importFn={() => import('./sticky-note/sticky-note.js')} stickyData={stickyData} />
            <Menus />
        </div>
    );
}
