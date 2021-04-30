import React from 'react';
import Header from './header/header';
import LowerStickyNote from './lower-sticky-note/lower-sticky-note';
import Microsurvey from './microsurvey-popup/microsurvey-popup';
import Footer from './footer/footer';
import {BrowserRouter} from 'react-router-dom';
import Router from './router';
import ReactModal from 'react-modal';
import bus from './shell-bus';

let stickyCount = 0;

function setUpBus(mainEl) {
    bus.on('with-sticky', () => {
        ++stickyCount;
        mainEl.classList.add('with-sticky');
    });

    bus.on('no-sticky', () => {
        --stickyCount;
        if (stickyCount <= 0) {
            mainEl.classList.remove('with-sticky');
        }
    });
    bus.on('with-modal', () => {
        mainEl.classList.add('with-modal');
        document.body.classList.add('no-scroll');
    });
    bus.on('no-modal', () => {
        mainEl.classList.remove('with-modal');
        document.body.classList.remove('no-scroll');
    });
}

function App() {
    const ref = React.useRef();

    React.useEffect(() => {
        setUpBus(ref.current);
        ReactModal.setAppElement(ref.current);
    }, []);

    // BrowserRouter has to include everything that uses useLocation
    return (
        <BrowserRouter>
            <div id="microsurvey">
                <Microsurvey />
            </div>
            <header id="header">
                <Header />
            </header>
            <div id="lower-sticky-note">
                <LowerStickyNote />
            </div>
            <div id="main" ref={ref}>
                <Router />
            </div>
            <footer id="footer">
                <Footer />
            </footer>
        </BrowserRouter>
    );
}

export default React.createElement(App);
