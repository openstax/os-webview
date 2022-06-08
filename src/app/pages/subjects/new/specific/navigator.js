import React from 'react';
import useSpecificSubjectContext from './context';
import {IfToggleIsOpen} from '~/components/toggle/toggle';
import ToggleControlBar from '~/components/toggle/toggle-control-bar';
import ArrowToggle from '~/components/toggle/arrow-toggle';
import AccordionGroup from '~/components/accordion-group/accordion-group';
import useNavigatorContext from './navigator-context';
import useLanguageContext from '~/contexts/language';
import {useLocation, Link} from 'react-router-dom';
import './navigator.scss';

const LEARN_MORE_IDS = ['blog-posts', 'webinars', 'learn'];

function SectionLink({id, text}) {
    const {currentId, registerId, unregisterId, goTo} = useNavigatorContext();
    const onClick = React.useCallback(
        (e) => {
            e.preventDefault();
            goTo(id);
        },
        [id, goTo]
    );
    const {hash} = useLocation();

    React.useEffect(
        () => {
            registerId(id);
            return () => unregisterId(id);
        },
        [registerId, unregisterId, id]
    );

    // Handle scrolling here initially if the hash is set
    React.useEffect(
        () => {
            if (hash.substr(1) === id) {
                goTo(id);
            }
        },
        [goTo, hash, id]
    );

    return (
        <Link
            to={{hash: `#${id}`}}
            replace={true}
            aria-current={id === currentId}
            onClick={onClick}
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

const localizedTexts = {
    'en': {
        categoryTitle: (subjectName) => `${subjectName} Book Categories`,
        learnMoreTitle: 'Learn more'
    },
    'es': {
        categoryTitle: (subjectName) => `Categorías de libros de ${subjectName}`,
        learnMoreTitle: 'Aprende más'
    }
};

function useTranslation() {
    const {language} = useLanguageContext();

    return localizedTexts[language];
}

function useAccordionItems(subjectName) {
    const tr = useTranslation();

    return [
        {
            title: tr.categoryTitle(subjectName),
            contentComponent: <CategorySectionLinks />
        },
        {
            title: tr.learnMoreTitle,
            contentComponent: <OtherSectionLinks subjectName={subjectName} />
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
    const tr = useTranslation();

    return (
        <nav className="navigator">
            <div style="position: sticky; top: 9rem;">
                <img src={subject.icon} role="presentation" />
                <div className="heading">{tr.categoryTitle(subject.html)}</div>
                <CategorySectionLinks />
                <div className="heading">{tr.learnMoreTitle}</div>
                <OtherSectionLinks subjectName={subject.html} />
            </div>
        </nav>
    );
}
