import React, { useState } from 'react';
import './navigator.scss';

function scrollSource(event) {
    const hash = (new window.URL(event.target.href)).hash;
    const el = document.getElementById(hash.substr(1));

    el.scrollIntoView({ behavior: 'smooth' });
    event.preventDefault();
}

function useElById(id) {
    const [el, setEl] = useState(document.getElementById(id));

    const elPoll = window.setInterval(() => {
        if (el) {
            window.clearInterval(elPoll);
        } else {
            setEl(document.getElementById(id));
        }
    }, 40);

    return el;
}

function SectionTarget({ id }) {
    const el = useElById(id);

    if (!el) {
        return null;
    }

    return (
        <a
            className='nav-item' href={`#${id}`}
            onClick={scrollSource} key={id}
        >
            {el.firstChild.textContent}
        </a>
    );
}

export default function Navigator() {
    const targetIds = ['account', 'profile', 'email-prefs'];

    return (
        <nav>
            {targetIds.map((id) => <SectionTarget id={id} key={id} />)}
        </nav>
    );
}
