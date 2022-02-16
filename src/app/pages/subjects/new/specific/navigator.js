import React from 'react';
import useSpecificSubjectContext from './context';
import {IfToggleIsOpen} from '~/components/toggle/toggle';
import ToggleControlBar from '~/components/toggle/toggle-control-bar';
import ArrowToggle from '~/components/toggle/arrow-toggle';
import useToggleContext from '~/components/toggle/toggle-context';
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

function CategorySectionLinks() {
    const {osTextbookCategories: cats} = useSpecificSubjectContext();

    return (
        <React.Fragment>
            {cats[0].map((c) => <CategoryLink category={c} key={c.html} />)}
        </React.Fragment>
    );
}

function OtherSectionLinks({subjectName}) {
    return (
        <React.Fragment>
            <SectionLink id='blog-posts' text={`${subjectName} blog posts`} />
            <SectionLink id='webinars' text={`${subjectName} webinars`} />
            <SectionLink id='learn' text="Learn about our books" />
        </React.Fragment>
    );
}

function useAccordionItems(subjectName) {
    return [
        {
            title: `${subjectName} Book Categories`,
            contentComponent: <CategorySectionLinks />
        },
        {
            title: 'Learn more',
            contentComponent: <OtherSectionLinks subjectName={subjectName} />
        }
    ];
}

export function JumpToSection({subjectName}) {
    const currentId = useCurrentSection();
    const previousIdRef = React.useRef(currentId);
    const {isOpen, toggle} = useToggleContext();

    // Coordinate closing the Jump-To dropdown with scrolling (which happens
    // even if using the Navigator instead of the Jump-To)
    React.useEffect(
        () => {
            if (currentId !== previousIdRef.current) {
                if (isOpen) {
                    toggle();
                } else {
                    const target = document.getElementById(currentId);

                    if (target) {
                        target.scrollIntoView({block: 'center', behavior: 'smooth'});
                    } else {
                        console.warn('Target not found', currentId);
                    }
                    previousIdRef.current = currentId;
                }
            }
        },
        [currentId, isOpen, toggle]
    );

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
    return (
        <nav className="navigator">
            <div style="position: sticky; top: 9rem;">
                <img src={subject.icon} role="presentation" />
                <div className="heading">{`${subject.html} Book Categories`}</div>
                <CategorySectionLinks />
                <div className="heading">Learn more</div>
                <OtherSectionLinks subjectName={subject.html} />
            </div>
        </nav>
    );
}
