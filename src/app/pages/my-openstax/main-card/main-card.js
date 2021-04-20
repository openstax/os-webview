import React, { useRef } from 'react';
import Navigator from './navigator/navigator';
import './main-card.scss';

export default function MainCard({ header, mainPanel }) {
    const contentEl = useRef(null);

    return (
        <div className='main-card'>
            <div className='layout-grid'>
                <div className='banner'>
                    {header}
                </div>
                <div className='left-bar'>
                    <Navigator />
                </div>
                <main className='main-content' ref={contentEl}>
                    {mainPanel}
                </main>
            </div>
        </div>
    );
}
