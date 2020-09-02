import React, {useState, useRef, useEffect, useContext} from 'react';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import {ActiveElementContext} from '~/components/jsx-helpers/jsx-helpers.jsx';
import $ from '~/helpers/$';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

function QuickLink({url, icon, text}) {
    return (
        <a href={url}>
            <FontAwesomeIcon icon={icon} />
            {text}
        </a>
    );
}

function Dropdown({urlBase, details}) {
    const ref = useRef();

    useEffect(() => {
        const el = ref.current;
        const theClickStopsHere = (event) => event.stopPropagation();

        el.addEventListener('click', theClickStopsHere);

        return () => el.removeEventListener('click', theClickStopsHere);
    });

    return (
        <div className="ur-dropdown" ref={ref}>
            <QuickLink url={urlBase} icon="book" text="Get this book" />
            {
                details.hasFacultyResources &&
                    <QuickLink
                        url={`${urlBase}?Instructor%20resources`}
                        icon="chalkboard-teacher" text="Instructor Resources"
                    />
            }
            {
                details.hasStudentResources &&
                    <QuickLink
                        url={`${urlBase}?Student%20resources`}
                        icon="graduation-cap" text="Student Resources" />
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
    const activeElement = useContext(ActiveElementContext);
    const active = ref.current && ref.current.contains(activeElement);
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
            role="button" tabIndex="0" ref={ref}
        >
            <FontAwesomeIcon icon="ellipsis-v" />
            <Dropdown urlBase={`details/${slug}`} details={details} />
        </div>
    );
}

export function BookCover({
    cover_url: coverUrl,
    slug,
    title,
    book_state: state,
    cover_color: coverColor,
    has_faculty_resources: hasFacultyResources,
    has_student_resources: hasStudentResources
}) {
    const classList = ['cover'];
    const details = {
        coverColor, hasFacultyResources, hasStudentResources
    };

    if (state === 'coming_soon') {
        classList.push('coming-soon');
    }
    if ($.isPolish(slug)) {
        classList.push('polish');
    }

    return (
        <div className={classList.join(' ')}>
            <ThreeDotMenu slug={slug} details={details} />
            <a href={`/details/${slug}`}>
                <img src={coverUrl} alt={title} />
            </a>
        </div>
    );
}

export default pageWrapper(BookCover);
