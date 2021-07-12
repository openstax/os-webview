import React from 'react';
import NavigationContext from './navigation-context';
import {WalkthroughCookieContextProvider} from './walkthrough/walkthrough-cookie-context';
import cn from 'classnames';
import Walkthrough from './walkthrough/walkthrough';
import './navigator.scss';

function useElById(id) {
    const [el, setEl] = React.useState(document.getElementById(id));

    React.useEffect(() => {
        const elPoll = window.setInterval(() => {
            if (el) {
                window.clearInterval(elPoll);
            } else {
                setEl(document.getElementById(id));
            }
        }, 40);

        return () => window.clearInterval(elPoll);
    });

    return el;
}

function SectionTarget({id, index}) {
    const el = useElById(id);
    const {activeId, setActiveId} = React.useContext(NavigationContext);
    const active = activeId === id;

    if (!el) {
        return null;
    }

    return (
        <React.Fragment>
            <a className={cn('nav-item', {active})} href={`#${id}`} onClick={() => setActiveId(id)}>
                {el.firstChild.textContent}
            </a>
            <Walkthrough active={active} title={el.firstChild.textContent} index={index} />
        </React.Fragment>
    );
}

export default function Navigator({targetIds}) {
    return (
        <nav>
            <WalkthroughCookieContextProvider>
                {targetIds.map((id, index) => <SectionTarget id={id} key={id} index={index} />)}
            </WalkthroughCookieContextProvider>
        </nav>
    );
}
