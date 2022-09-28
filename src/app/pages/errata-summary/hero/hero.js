import React, {useState, useEffect} from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import bookPromise from '~/models/book-titles';
import useRouterContext from '~/components/shell/router-context';
import cn from 'classnames';
import './hero.scss';

function useBookInfo(book) {
    const [info, setInfo] = useState([]);
    const {fail} = useRouterContext();

    useEffect(() => {
        bookPromise.then((bookList) => {
            const entry = bookList.find(({title}) => title === book);

            if (entry) {
                const slug = `books/${entry.meta.slug}`;
                const title = entry.title;

                setInfo([slug, title]);
            } else {
                fail(`Could not find book info for ${book}`);
            }
        });
    }, [book, fail]);

    return info;
}

const middle = '-135';
const margin = 3;

function shiftIntoView(ref, leftOffset, setLeftOffset) {
    const {left, right} = ref.current.getBoundingClientRect();
    const {right: pageRight} = ref.current.closest('.page').getBoundingClientRect();
    const overRight = right - pageRight + margin;
    const overLeft = margin - left;
    const rightWants = Math.min(middle, leftOffset - overRight);
    const leftWants = Math.max(rightWants, leftOffset + overLeft);

    setLeftOffset(leftWants);
}

function usePopTipStyle(isOpen) {
    const ref = React.useRef();
    const [leftOffset, setLeftOffset] = React.useState(middle);

    useEffect(
        () => shiftIntoView(ref, leftOffset, setLeftOffset),
        [isOpen, leftOffset]
    );

    return {ref, style: {left: leftOffset}};
}

function PopTip({html, isOpen}) {
    const {ref, style} = usePopTipStyle(isOpen);

    return (
        <div className="poptip-attachment">
            <div className="poptip" ref={ref} style={style} role="tooltip" aria-hidden={!isOpen}>
                <div className="title-bar">
                    More information
                </div>
                <RawHTML className="body" html={html} />
            </div>
        </div>
    );
}

function usePopTipState() {
    const [isOpen, setIsOpen] = React.useState(false);

    return {
        isOpen,
        activate() {setIsOpen(true);},
        deactivate() {setIsOpen(false);}
    };
}

function HeroContent({data}) {
    const {isOpen, activate, deactivate} = usePopTipState();

    return (
        <div>
            <div className="header">{data.aboutHeader}</div>
            <div className="about">
                <RawHTML Tag="span" className="about-text" html={data.aboutText} />
                {' '}
                <span
                    className={cn('with-tooltip', {active: isOpen})}
                    tabIndex="0"
                    onMouseEnter={activate} onMouseLeave={deactivate}
                    onFocus={activate} onBlur={deactivate}
                >
                    <FontAwesomeIcon icon={faInfoCircle} />
                    <PopTip html={data.aboutPopup} isOpen={isOpen} />
                </span>
            </div>
        </div>
    );
}

export default function Hero({book}) {
    const [slug, title] = useBookInfo(book);

    if (!slug) {
        return null;
    }
    return (
        <div className="hero">
            <div className="text-area">
                <h1>{title} Errata</h1>
                <LoaderPage slug="pages/errata" Child={HeroContent} />
            </div>
        </div>
    );
}
