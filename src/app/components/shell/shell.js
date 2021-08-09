import React from 'react';
import 'preact/debug';
import {LanguageContextProvider} from '~/models/language-context';
import {BrowserRouter} from 'react-router-dom';
import Router from './router';
import ReactModal from 'react-modal';
import {FlagContextProvider} from './flag-context';
import Welcome from './welcome/welcome';
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

function Suspense() {
    return (
        <div>Loading...</div>
    );
}

// Because lazy/Suspense is not yet recommended...
function ImportedComponent({name}) {
    const [Content, setContent] = React.useState(Suspense);

    React.useEffect(
        () => import(`./${name}/${name}`)
            .then((content) => setContent(<content.default />)),
        [name]
    );

    return Content;
}

const Microsurvey = () => <ImportedComponent name="microsurvey-popup" />;
const Header = () => <ImportedComponent name="header" />;
const LowerStickyNote = () => <ImportedComponent name="lower-sticky-note" />;
const Footer = () => <ImportedComponent name="footer" />;

function App() {
    const ref = React.useRef();

    React.useEffect(() => {
        setUpBus(ref.current);
        ReactModal.setAppElement(ref.current);
    }, []);

    // BrowserRouter has to include everything that uses useLocation
    return (
        <LanguageContextProvider>
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
                <FlagContextProvider>
                    <div id="main" ref={ref}>
                        <Welcome />
                        <Router />
                    </div>
                </FlagContextProvider>
                <footer id="footer">
                    <Footer />
                </footer>
            </BrowserRouter>
        </LanguageContextProvider>
    );
}

export default React.createElement(App);
