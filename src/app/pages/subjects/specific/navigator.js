import React from 'react';
import useSpecificSubjectContext from './context';
import useWindowContext from '~/contexts/window';
import $ from '~/helpers/$';
import './navigator.scss';

const LEARN_MORE_IDS = ['blog-posts', 'webinars', 'learn'];

function useCurrentSection() {
    const {innerHeight} = useWindowContext();
    const {subcategories: cats} = useSpecificSubjectContext();
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
    const onClick = React.useCallback(
        (event) => {
            event.preventDefault();
            el?.scrollIntoView({block: 'center', behavior: 'smooth'});
        },
        [el]
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

export default function Navigator({subject}) {
    const {subcategories: cats} = useSpecificSubjectContext();

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
