import React from 'react';
import JITLoad from '~/helpers/jit-load';
import {useStickyData} from '../shared.js';
import Menus from './menus/menus';
import './header.scss';

export default function Header() {
    const stickyData = useStickyData();

    console.info('** Rendering header');

    React.useEffect(
        () => console.info('** sticky data', stickyData),
        [stickyData]
    );

    React.useEffect(
        () => {
            return () => console.info('** Destroying Header');
        },
        []
    );

    return (
        <div className="page-header">
            <JITLoad importFn={() => import('./sticky-note/sticky-note.js')} stickyData={stickyData} />
            <Menus key="header" />
        </div>
    );
}
