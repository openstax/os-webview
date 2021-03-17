import React from 'react';
import routerBus from '~/helpers/router-bus';
import {useLocation} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './navigator.css';

const basePath = '/creator-fest';
const pathFromUrl = (url) => url === 'home' ? basePath : `${basePath}/${url}`;

function currentClass(url) {
    return window.location.pathname === pathFromUrl(url) ? 'current' : '';
}

function onClick(event) {
    event.preventDefault();
    const url = event.target.getAttribute('href');
    const yTarget = history.state.y;

    routerBus.emit('navigate', pathFromUrl(url), {
        path: basePath
    });
    window.scrollTo(0, yTarget);
}

function NavLink({url, text}) {
    return (
        <a href={url} className={currentClass(url)} onClick={onClick}>
            {text}
        </a>
    );
}

export default function Navigator({navLinks}) {
    const location = useLocation();

    return (
        <nav id="navigator" className="boxed navigator-container">
            <div className="navigator">
                <a href="home" className={currentClass('home')} onClick={onClick}>Home</a>
                {
                    navLinks.map(({url, text}) =>
                        <NavLink url={url} text={text} key={url} />
                    )
                }
            </div>
        </nav>
    );
}
