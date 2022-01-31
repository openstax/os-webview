import React from 'react';
import useSpecificSubjectContext from './context';
import useWindowContext from '~/contexts/window';
import useToggleContext from '~/components/toggle/toggle-context.js';
import {IfToggleIsOpen} from '~/components/toggle/toggle';
import ToggleControlBar from '~/components/toggle/toggle-control-bar';
import ArrowToggle from '~/components/toggle/arrow-toggle';
import AccordionGroup from '~/components/accordion-group/accordion-group';
import $ from '~/helpers/$';
import './navigator.scss';

const LEARN_MORE_IDS = ['blog-posts', 'webinars', 'learn'];

function useCurrentSection() {
    const {innerHeight} = useWindowContext();
    const {osTextbookCategories: cats} = useSpecificSubjectContext();
    const ids = cats.map((c) => c.id).concat(LEARN_MORE_IDS);
    const midY = innerHeight/2;

    return ids.find((id) => {
        const el = window.document.getElementById(id);

        if (!el) {
            return null;
        }
        const {bottom} = el.getBoundingClientRect();

        return bottom >= midY || id === ids[ids.length - 1];
    });
}

// Poll for element to exist
function useElFor(id) {
    const [el, setEl] = React.useState();

    React.useEffect(() => {
        const i = window.setInterval(
            () => {
                const foundEl = window.document.getElementById(id);

                if (foundEl) {
                    setEl(foundEl);
                    window.clearInterval(i);
                }
            },
            60
        );

        return () => window.clearInterval(i);
    });

    return el;
}

function SectionLink({id, text}) {
    const el = useElFor(id); // Forces update when element exists
    const {toggle} = useToggleContext();
    const onClick = React.useCallback(
        (event) => {
            event.preventDefault();
            el?.scrollIntoView({block: 'center', behavior: 'smooth'});
            const io = new window.IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    window.setTimeout(toggle, 100);
                }
            });

            io.observe(el);
        },
        [el, toggle]
    );
    const currentId = useCurrentSection();

    return (
        <a
            href={id} onClick={onClick} onKeyDown={$.treatSpaceOrEnterAsClick}
            aria-current={id === currentId}
        >{text}</a>
    );
}

function CategoryLink({category}) {
    return (
        <SectionLink id={category.id} text={category.name} />
    );
}

function useAccordionItems(subjectName) {
    const {osTextbookCategories: cats} = useSpecificSubjectContext();

    return [
        {
            title: `${subjectName} Book Categories`,
            contentComponent:
    <React.Fragment>
        {cats.map((c) => <CategoryLink category={c} key={c.html} />)}
    </React.Fragment>
        },
        {
            title: 'Learn more',
            contentComponent:
    <React.Fragment>
        <SectionLink id='blog-posts' text={`${subjectName} blog posts`} />
        <SectionLink id='webinars' text={`${subjectName} webinars`} />
        <SectionLink id='learn' text="Learn about our books" />
    </React.Fragment>
        }
    ];
}

export function JumpToSection({subjectName}) {
    return (
        <div className="jump-to-section">
            <ToggleControlBar Indicator={ArrowToggle}>
                <div>Jump to section</div>
            </ToggleControlBar>
            <IfToggleIsOpen>
                <AccordionGroup items={useAccordionItems(subjectName)} noScroll />
            </IfToggleIsOpen>
        </div>
    );
}

export default function Navigator({subject}) {
    const {osTextbookCategories: cats} = useSpecificSubjectContext();

    return (
        <nav className="navigator">
            <div style="position: sticky; top: 9rem;">
                <img src={subject.icon} role="presentation" />
                <div className="heading">{`${subject.html} Book Categories`}</div>
                {cats.map((c) => <CategoryLink category={c} key={c.html} />)}
                <div className="heading">Learn more</div>
                <SectionLink id='blog-posts' text={`${subject.html} blog posts`} />
                <SectionLink id='webinars' text={`${subject.html} webinars`} />
                <SectionLink id='learn' text="Learn about our books" />
            </div>
        </nav>
    );
}
