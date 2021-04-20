import 'preact/debug';
import React from 'react';
import { StoreContext } from 'storeon/preact';
import { store } from './store.js';
import MainCard from './main-card/main-card';
import Header from './header/header';
import MainPanel from './main-panel/main-panel';
import './my-openstax.scss';

export default function MyOpenStax() {
    return (
        <div className="my-openstax page">
            <StoreContext.Provider value={store}>
                <MainCard
                    header={<Header />}
                    mainPanel={<MainPanel />}
                />
            </StoreContext.Provider>
        </div>
    );
}
