import React, {useState, useEffect} from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import bookPromise from '~/models/book-titles';
import useRouterContext from '~/components/shell/router-context';
import cn from 'classnames';
import './hero.scss';

interface BookEntry {
    title: string;
    meta: {
        slug: string;
    };
}

interface HeroData {
    aboutHeader: string;
    aboutText: string;
    aboutPopup: string;
}

interface HeroProps {
    book: string;
}

interface HeroContentProps {
    data: HeroData;
}

interface PopTipProps {
    html: string;
    isOpen: boolean;
}

interface PopTipState {
    isOpen: boolean;
    activate: () => void;
    deactivate: () => void;
}

interface PopTipStyleResult {
    ref: React.RefObject<HTMLDivElement>;
    style: { left: number | string };
}

function useBookInfo(book: string): [string, string] {
    const [info, setInfo] = useState<[string, string]>(['', '']);
    const {fail} = useRouterContext();

    useEffect(() => {
        bookPromise.then((bookList: BookEntry[]) => {
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

const middle: string = '-135';
const margin: number = 3;

function shiftIntoView(
    ref: React.RefObject<HTMLDivElement>, 
    leftOffset: number | string, 
    setLeftOffset: (value: number | string) => void
): void {
    if (!ref.current) return;
    
    const {left, right} = ref.current.getBoundingClientRect();
    const pageElement = ref.current.closest('.page');
    if (!pageElement) return;
    
    const {right: pageRight} = pageElement.getBoundingClientRect();
    const overRight = right - pageRight + margin;
    const overLeft = margin - left;
    const leftOffsetNum = typeof leftOffset === 'string' ? parseInt(leftOffset) : leftOffset;
    const rightWants = Math.min(parseInt(middle), leftOffsetNum - overRight);
    const leftWants = Math.max(rightWants, leftOffsetNum + overLeft);

    setLeftOffset(leftWants);
}

function usePopTipStyle(isOpen: boolean): PopTipStyleResult {
    const ref = React.useRef<HTMLDivElement>(null);
    const [leftOffset, setLeftOffset] = React.useState<number | string>(middle);

    useEffect(
        () => shiftIntoView(ref, leftOffset, setLeftOffset),
        [isOpen, leftOffset]
    );

    return {ref, style: {left: leftOffset}};
}

function PopTip({html, isOpen}: PopTipProps): React.ReactElement {
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

function usePopTipState(): PopTipState {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);

    return {
        isOpen,
        activate(): void {setIsOpen(true);},
        deactivate(): void {setIsOpen(false);}
    };
}

function HeroContent({data}: HeroContentProps): React.ReactElement {
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

export default function Hero({book}: HeroProps): React.ReactElement | null {
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