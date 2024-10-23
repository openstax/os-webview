import React from 'react';
import useSpecificSubjectContext from './context';
import useNavigatorContext from './navigator-context';
import {IfToggleIsOpen} from '~/components/toggle/toggle';
import ToggleControlBar from '~/components/toggle/toggle-control-bar';
import ArrowToggle from '~/components/toggle/arrow-toggle';
import AccordionGroup from '~/components/accordion-group/accordion-group';
import {FormattedMessage, useIntl} from 'react-intl';
import {Link} from 'react-router-dom';
import type {Category} from '~/contexts/subject-category';
import {assertDefined} from '~/helpers/data';
import './navigator.scss';

const LEARN_MORE_IDS = ['blog-posts', 'webinars', 'learn'];

export default function Navigator({subject}: {subject: Category}) {
    return (
        <div className="navigator">
            <div style={{position: 'sticky', top: '9rem'}}>
                <nav aria-labelledby="category-section-links-header">
                    <img src={subject.icon} role="presentation" />
                    <h2 id="category-section-links-header">
                        <FormattedMessage
                            id="subject.categoryTitle"
                            defaultMessage="{subjectName} Book Categories"
                            values={{subjectName: subject.html}}
                        />
                    </h2>
                    <CategorySectionLinks />
                </nav>
                <nav aria-labelledby="other-section-links-header">
                    <h2 id="other-section-links-header">
                        <FormattedMessage
                            id="subject.learnMoreTitle"
                            defaultMessage="Learn more"
                        />
                    </h2>
                    <OtherSectionLinks />
                </nav>
            </div>
        </div>
    );
}

function CategorySectionLinks() {
    const {categories} = useSpecificSubjectContext();

    return (
        <React.Fragment>
            {categories.map(([c]) => (
                <CategoryLink category={c} key={c} />
            ))}
        </React.Fragment>
    );
}

function CategoryLink({category}: {category: string}) {
    return <SectionLink id={category} text={category} />;
}

function SectionLink({id, text}: {id: string; text: string}) {
    const {currentId, registerId, unregisterId, goTo} = useNavigatorContext();
    const onClick = React.useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            goTo(id);
        },
        [id, goTo]
    );

    React.useEffect(() => {
        registerId(id);
        return () => unregisterId(id);
    }, [registerId, unregisterId, id]);

    return (
        <Link
            to={{hash: `#${id}`}}
            replace={true}
            aria-current={id === currentId}
            onClick={onClick}
        >
            {text}
        </Link>
    );
}

function OtherSectionLinks() {
    const {learnMoreAboutBooks, learnMoreBlogPosts, learnMoreWebinars} =
        useSpecificSubjectContext();

    // If one is defined, they all are
    if (!learnMoreAboutBooks) {
        return null;
    }
    return (
        <React.Fragment>
            <SectionLink
                id="blog-posts"
                text={assertDefined(learnMoreBlogPosts)}
            />
            <SectionLink
                id="webinars"
                text={assertDefined(learnMoreWebinars)}
            />
            <SectionLink id="learn" text={learnMoreAboutBooks} />
        </React.Fragment>
    );
}

function useAccordionItems(subjectName: string) {
    const intl = useIntl();

    return [
        {
            title: intl.formatMessage(
                {id: 'subject.categoryTitle'},
                {subjectName}
            ),
            contentComponent: <CategorySectionLinks />
        },
        {
            title: intl.formatMessage({id: 'subject.learnMoreTitle'}),
            contentComponent: <OtherSectionLinks />
        }
    ];
}

export function JumpToSection({subjectName}: {subjectName: string}) {
    return (
        <div className="jump-to-section">
            <ToggleControlBar Indicator={ArrowToggle}>
                <div>Jump to section</div>
            </ToggleControlBar>
            <IfToggleIsOpen>
                <AccordionGroup
                    items={useAccordionItems(subjectName)}
                    noScroll
                />
            </IfToggleIsOpen>
        </div>
    );
}
