import React from 'react';
import useNavigationContext from './navigation-context';
import useWalkthroughCookieContext, {WalkthroughCookieContextProvider}
    from './walkthrough/walkthrough-cookie-context';
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
    const {activeId, setActiveId} = useNavigationContext();
    const active = activeId === id;

    function clickId(event) {
        event.preventDefault();
        setActiveId(id);
    }

    if (!el) {
        return null;
    }

    return (
        <React.Fragment>
            <a className={cn('nav-item', {active})} href={`#${id}`} onClick={clickId}>
                {el.firstChild.textContent}
            </a>
            <Walkthrough active={active} title={el.firstChild.textContent} index={index} />
        </React.Fragment>
    );
}

function StepWrapper({children}) {
    const [showWalkthrough] = useWalkthroughCookieContext();
    const {setActiveId, targetIds} = useNavigationContext();

    // If we're going to show the walkthrough, reset to the first navigation item
    // Delayed, so hash-navigation can be finished first
    React.useEffect(() => {
        if (showWalkthrough) {
            window.requestAnimationFrame(() => {
                setActiveId(targetIds[0]);
            });
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return children;
}

export default function Navigator({targetIds}) {
    return (
        <nav>
            <WalkthroughCookieContextProvider>
                <StepWrapper>
                    {targetIds.map((id, index) => <SectionTarget id={id} key={id} index={index} />)}
                </StepWrapper>
            </WalkthroughCookieContextProvider>
        </nav>
    );
}
