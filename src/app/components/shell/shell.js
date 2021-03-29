import React from 'react';
import ReactDOM from 'react-dom';
import Header from './header/header';
import LowerStickyNote from './lower-sticky-note/lower-sticky-note';
import Microsurvey from './microsurvey-popup/microsurvey-popup';
import Footer from './footer/footer';
import bus from './shell-bus';
import '~/helpers/font-awesome';

const mainObserver = new MutationObserver((observations) => {
    document.body.classList.remove('initial-load');
    mainObserver.disconnect();
});

mainObserver.observe(document.getElementById('main'), {childList: true, subtree: true});

[
    [Header, 'header'],
    [LowerStickyNote, 'lower-sticky-note'],
    [Microsurvey, 'microsurvey'],
    [Footer, 'footer']
].forEach(([Component, id]) => {
    const instance = React.createElement(Component);
    const el = document.getElementById(id);

    ReactDOM.render(instance, el);
});

let stickyCount = 0;
const mainEl = document.getElementById('main');

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
