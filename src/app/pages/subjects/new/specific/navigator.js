import React from 'react';
import useSpecificSubjectContext from './context';
import {IfToggleIsOpen} from '~/components/toggle/toggle';
import ToggleControlBar from '~/components/toggle/toggle-control-bar';
import ArrowToggle from '~/components/toggle/arrow-toggle';
import AccordionGroup from '~/components/accordion-group/accordion-group';
import useNavigatorContext from './navigator-context';
import {FormattedMessage, useIntl} from 'react-intl';
import {Link} from 'react-router-dom';
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

    React.useEffect(
        () => {
            registerId(id);
            return () => unregisterId(id);
        },
        [registerId, unregisterId, id]
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
        <SectionLink id={category} text={category} />
    );
}

function CategorySectionLinks() {
    const {categories} = useSpecificSubjectContext();

    return (
        <React.Fragment>
            {categories.map(([c]) => <CategoryLink category={c} key={c.html} />)}
        </React.Fragment>
    );
}

function OtherSectionLinks() {
    const {learnMoreAboutBooks, learnMoreBlogPosts, learnMoreWebinars} = useSpecificSubjectContext();

    return (
        <React.Fragment>
            <SectionLink id='blog-posts' text={learnMoreBlogPosts} />
            <SectionLink id='webinars' text={learnMoreWebinars} />
            <SectionLink id='learn' text={learnMoreAboutBooks} />
        </React.Fragment>
    );
}

function useAccordionItems(subjectName) {
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
    return (
        <nav className="navigator">
            <div style="position: sticky; top: 9rem;">
                <img src={subject.icon} role="presentation" />
                <div className="heading">
                    <FormattedMessage
                        id="subject.categoryTitle"
                        defaultMessage="{subjectName} Book Categories"
                        values={{subjectName: subject.html}}
                    />
                </div>
                <CategorySectionLinks />
                <div className="heading">
                    <FormattedMessage id="subject.learnMoreTitle" defaultMessage="Learn more" />
                </div>
                <OtherSectionLinks />
            </div>
        </nav>
    );
}
