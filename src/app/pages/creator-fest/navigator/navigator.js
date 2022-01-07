import React from 'react';
import {NavLink, useLocation} from 'react-router-dom';
import './navigator.scss';

const basePath = '/creator-fest';
const pathFromUrl = (url) => url === 'home' ? basePath : `${basePath}/${url}`;

export default function Navigator({navLinks}) {
    const {pathname} = useLocation();
    const currentClass = React.useCallback((url) => pathname === pathFromUrl(url) ? 'current' : '', [pathname]);

    return (
        <nav id="navigator" className="boxed navigator-container">
            <div className="navigator">
                <NavLink to={basePath} className={currentClass('home')}>Home</NavLink>
                {
                    navLinks.map(({url, text}) =>
                        <NavLink to={pathFromUrl(url)} className={currentClass(url)} key={url}>
                            {text}
                        </NavLink>
                    )
                }
            </div>
        </nav>
    );
}
