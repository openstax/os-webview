import React from 'react';
import Microsurvey from './microsurvey-popup/microsurvey-popup';
import Header from './header/header';
import LowerStickyNote from './lower-sticky-note/lower-sticky-note';
import Footer from './footer/footer';

export default function DefaultLayoutWrapper({children}: React.PropsWithChildren) {
    return (
        <React.Fragment>
            <Microsurvey />
            <header id="header">
                <Header key="default-header" />
            </header>
            <div id="lower-sticky-note">
                <LowerStickyNote />
            </div>
            {children}
            <footer id="footer">
                <Footer />
            </footer>
        </React.Fragment>
    );
}
