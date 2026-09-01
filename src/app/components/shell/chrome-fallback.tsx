import React from 'react';
import {DelayedFallback} from '~/helpers/jit-load';
import Header from '~/layouts/default/header/header';

// Keeps the real nav bar on screen while a router or layout chunk loads,
// instead of the bare logo those fallbacks would otherwise show.
export default function ChromeFallback() {
    return (
        <React.Fragment>
            <header id="header">
                <Header />
            </header>
            <DelayedFallback fullPage />
        </React.Fragment>
    );
}
