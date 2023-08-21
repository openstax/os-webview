import React, {useRef, useEffect} from 'react';
import useActiveElementContext from '~/contexts/active-element';
import {useIntl} from 'react-intl';
import $ from '~/helpers/$';
import cn from 'classnames';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBook} from '@fortawesome/free-solid-svg-icons/faBook';
import {faChalkboardTeacher} from '@fortawesome/free-solid-svg-icons/faChalkboardTeacher';
import {faEllipsisV} from '@fortawesome/free-solid-svg-icons/faEllipsisV';
import {faGraduationCap} from '@fortawesome/free-solid-svg-icons/faGraduationCap';
import assignableSnippet from '~/models/assignable-snippet';
import {usePromise} from '~/helpers/use-data';
import LazyLoad from 'react-lazyload';

function QuickLink({url, icon, text}) {
    return (
        <a href={url}>
            <FontAwesomeIcon icon={icon} />
            {text}
        </a>
    );
}

function Dropdown({urlBase, details}) {
    const intl = useIntl();
    const labels = [
        intl.formatMessage({id: 'getTheBook'}),
        intl.formatMessage({id: 'tabs.instructorResources'}),
        intl.formatMessage({id: 'tabs.studentResources'})
    ];

    function stopClickPropagation(event) {
        event.stopPropagation();
    }

    return (
        <div className="ur-dropdown" onClick={stopClickPropagation}>
            <QuickLink url={urlBase} icon={faBook} text={labels[0]} />
            {
                details.hasFacultyResources &&
                    <QuickLink
                        url={`${urlBase}?${labels[1]}`}
                        icon={faChalkboardTeacher} text={labels[1]}
                    />
            }
            {
                details.hasStudentResources &&
                    <QuickLink
                        url={`${urlBase}?${labels[2]}`}
                        icon={faGraduationCap} text={labels[2]} />
            }
        </div>
    );
}

// eslint-disable-next-line complexity
function handleKeysInMenu(event) {
    const el = document.activeElement;

    switch (event.key) {
    case 'ArrowUp':
        (el.previousSibling || el).focus();
        event.preventDefault();
        break;
    case 'ArrowDown':
        (el.nextSibling || el).focus();
        event.preventDefault();
        break;
    case 'Escape':
        document.activeElement.blur();
        event.preventDefault();
        break;
    default:
        break;
    }
}

function ThreeDotMenu({slug, details}) {
    const ref = useRef();
    const activeElement = useActiveElementContext();
    const active = ref.current?.contains(activeElement);
    const classList = ['ur-menu'];

    useEffect(() => {
        if (active) {
            const el = ref.current;

            el.addEventListener('keydown', handleKeysInMenu);
            el.querySelector('.ur-dropdown').firstChild.focus();

            return () => el.removeEventListener('keydown', handleKeysInMenu);
        }
        return null;
    }, [active]);

    if (details.coverColor !== 'yellow') {
        classList.push('dark');
    }

    if (active) {
        classList.push('active');
    }

    return (
        <div
            className={classList.join(' ')}
            role="button" aria-label="open-menu" tabIndex="0" ref={ref}
        >
            <FontAwesomeIcon icon={faEllipsisV} />
            <Dropdown urlBase={`/details/${slug}`} details={details} />
        </div>
    );
}

function AssignableBadge() {
    const snippet = usePromise(assignableSnippet);

    if (!snippet) {
        return null;
    }

    return (
        <img className="badge" src={snippet.assignableAvailableImage} alt={snippet.assignableDescription} />
    );
}

export default function BookCover({
    coverUrl,
    subjects,
    slug,
    title,
    bookState: state,
    coverColor,
    hasFacultyResources,
    hasStudentResources,
    assignableBook
}) {
    const details = {
        coverColor, hasFacultyResources, hasStudentResources
    };
    const comingSoon = state === 'coming_soon';
    const className = cn('cover', {
        'coming-soon': comingSoon,
        'assignable': assignableBook,
        polish: $.isPolish(slug)
    });

    return (
        <div className={className}>
            {!comingSoon && <ThreeDotMenu slug={slug} details={details} />}
            {assignableBook && <AssignableBadge />}
            <a
              href={`/details/${slug}`}
              data-analytics-select-content={title}
              data-content-type="Book"
              data-content-tags={['',
                  ...subjects.map((subject) => `subject=${subject}`),
              ''].join(',')}
            >
              <LazyLoad once offset={100}>
                  <img src={coverUrl} alt={title} />
              </LazyLoad>
              <div className="cover-caption">{title}</div>
            </a>
        </div>
    );
}
