import React from 'react';
import useSpecificSubjectContext from './context';
import {IfToggleIsOpen} from '~/components/toggle/toggle';
import ToggleControlBar from '~/components/toggle/toggle-control-bar';
import ArrowToggle from '~/components/toggle/arrow-toggle';
import AccordionGroup from '~/components/accordion-group/accordion-group';
import {useLocation, Link} from 'react-router-dom';
import './navigator.scss';

const LEARN_MORE_IDS = ['blog-posts', 'webinars', 'learn'];

function useCurrentSection() {
    const {hash} = useLocation();

    return window.decodeURIComponent(hash.substr(1));
}

function SectionLink({id, text}) {
    const currentId = useCurrentSection();

    return (
        <Link
            to={{hash: `#${id}`}}
            replace={true}
            aria-current={id === currentId}
        >{text}</Link>
    );
}

function CategoryLink({category}) {
    return (
        <SectionLink id={category.heading} text={category.heading} />
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
    const currentId = useCurrentSection();

    React.useLayoutEffect(
        () => {
            const target = document.getElementById(currentId);

            if (target) {
                // Some update nonsense to avoid
                window.setTimeout(() => {
                    target.scrollIntoView({block: 'center', behavior: 'smooth'});
                }, 20);
            } else {
                console.warn('Target not found', currentId);
            }
        },
        [currentId]
    );

    return (
        <nav className="navigator">
            <div style="position: sticky; top: 9rem;">
                <img src={subject.icon} role="presentation" />
                <div className="heading">{`${subject.html} Book Categories`}</div>
                {cats[0].map((c) => <CategoryLink category={c} key={c.html} />)}
                <div className="heading">Learn more</div>
                <SectionLink id='blog-posts' text={`${subject.html} blog posts`} />
                <SectionLink id='webinars' text={`${subject.html} webinars`} />
                <SectionLink id='learn' text="Learn about our books" />
            </div>
        </nav>
    );
}
