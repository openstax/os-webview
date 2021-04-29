import React from 'react';
import NavigationContext from '../navigation-context';
import cn from 'classnames';
import './navigator.scss';

function useElById(id) {
    const [el, setEl] = React.useState(document.getElementById(id));

    const elPoll = window.setInterval(() => {
        if (el) {
            window.clearInterval(elPoll);
        } else {
            setEl(document.getElementById(id));
        }
    }, 40);

    return el;
}

function SectionTarget({id}) {
    const el = useElById(id);
    const [activeId, setActiveId] = React.useContext(NavigationContext);
    const active = activeId === id;

    if (!el) {
        return null;
    }

    return (
        <a className={cn('nav-item', {active})} href={`#${id}`} onClick={() => setActiveId(id)}>
            {el.firstChild.textContent}
        </a>
    );
}

export default function Navigator({targetIds}) {
    return (
        <nav>
            {targetIds.map((id) => <SectionTarget id={id} key={id} />)}
        </nav>
    );
}
