import React, {useState, useEffect} from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {assertNotNull} from '~/helpers/data';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import bookPromise from '~/models/book-titles';
import cn from 'classnames';
import './hero.scss';

type HeroData = {
    aboutHeader: string;
    aboutText: string;
    aboutPopup: string;
}

type HeroProps = {
    book: string;
}

type HeroContentProps = {
    data: HeroData;
}

type PopTipProps = {
    html: string;
    isOpen: boolean;
}

const NOT_FOUND = '*error*';

function useBookInfo(book: string): [string, string] {
    const [info, setInfo] = useState<[string, string]>(['', '']);

    useEffect(() => {
        bookPromise.then((bookList) => {
            const entry = bookList.find(({title}) => title === book);

            if (entry) {
                const slug = `books/${entry.meta.slug}`;
                const title = entry.title;

                setInfo([slug, title]);
            } else {
                setInfo([NOT_FOUND, `${book} not found`]);
            }
        });
    }, [book]);

    return info;
}

const middle = -135;
const margin = 3;

function shiftIntoView(
    ref: React.RefObject<HTMLDivElement>,
    leftOffset: number,
    setLeftOffset: (value: number) => void
) {
    const poptipEl = assertNotNull(ref.current);

    const {left, right} = poptipEl.getBoundingClientRect();
    const pageElement = assertNotNull(poptipEl.closest('.page'));

    const {right: pageRight} = pageElement.getBoundingClientRect();
    const overRight = right - pageRight + margin;
    const overLeft = margin - left;
    const rightWants = Math.min(middle, leftOffset - overRight);
    const leftWants = Math.max(rightWants, leftOffset + overLeft);

    setLeftOffset(leftWants);
}

function usePopTipStyle(isOpen: boolean) {
    const ref = React.useRef<HTMLDivElement>(null);
    const [leftOffset, setLeftOffset] = React.useState<number>(middle);

    useEffect(
        () => {
            if (isOpen) {
                shiftIntoView(ref, leftOffset, setLeftOffset);
            }
        },
        [isOpen, leftOffset]
    );

    return {ref, style: {left: leftOffset}};
}

function PopTip({html, isOpen}: PopTipProps) {
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
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const activate = React.useCallback(() => setIsOpen(true), []);
    const deactivate = React.useCallback(() => setIsOpen(false), []);

    return {isOpen, activate, deactivate};
}

function HeroContent({data}: HeroContentProps) {
    const {isOpen, activate, deactivate} = usePopTipState();

    return (
        <div>
            <div className="header">{data.aboutHeader}</div>
            <div className="about">
                <RawHTML Tag="span" className="about-text" html={data.aboutText} />
                {' '}
                <span
                    className={cn('with-tooltip', {active: isOpen})}
                    tabIndex={0}
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

export default function Hero({book}: HeroProps) {
    const [slug, title] = useBookInfo(book);

    if (slug === NOT_FOUND) {
        return <div className="hero">{title}</div>;
    }

    return (
        <div className="hero">
            {slug ?
                <div className="text-area">
                    <h1>{title} Errata</h1>
                    <LoaderPage slug="pages/errata" Child={HeroContent} />
                </div> :
                null
            }
        </div>
    );
}
