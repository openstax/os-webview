import React from 'react';
import StickyNote from './sticky-note/sticky-note';
import {useStickyData} from '../shared';
import Menus from './menus/menus';
import './header.scss';

export default function Header() {
    const stickyData = useStickyData();

    return (
        <div className="page-header">
            <StickyNote stickyData={stickyData} />
            <Menus />
        </div>
    );
}
