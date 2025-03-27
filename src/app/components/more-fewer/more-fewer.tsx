import React, {useState, useEffect, useRef} from 'react';
import './more-fewer.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCaretLeft} from '@fortawesome/free-solid-svg-icons/faCaretLeft';
import {faCaretRight} from '@fortawesome/free-solid-svg-icons/faCaretRight';
import $ from '~/helpers/$';
import {treatSpaceOrEnterAsClick} from '~/helpers/events';

function PseudoButton({onClick, children}: React.PropsWithChildren<{
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}>) {
    return (
        <div role="button" tabIndex={0} onClick={onClick} onKeyDown={treatSpaceOrEnterAsClick}>
            {children}
        </div>
    );
}

function ButtonOrPresentation({condition, children, onClick}: React.PropsWithChildren<{
    condition: boolean;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}>) {
    return (
        condition ?
            <PseudoButton onClick={onClick} children={children} /> :
            <div role="presentation" children={children} />
    );
}

export function Paginated({children, perPage=10}: {
    perPage?: number;
    children: React.ReactNode[];
}) {
    const [pageNumber, setPageNumber] = useState(1);
    const [pageChanged, setPageChanged] = useState<number>();
    const lastPage = Math.ceil(children.length / perPage);
    const firstDisplayed = perPage * (pageNumber - 1);
    const displayedChildren = children
        .slice(perPage * (pageNumber - 1), firstDisplayed + perPage);
    const ref=useRef<HTMLDivElement>(null);

    function nextPage() {
        setPageNumber(pageNumber + 1);
        setPageChanged(Date.now());
    }
    function prevPage() {
        setPageNumber(pageNumber - 1);
        setPageChanged(Date.now());
    }
    useEffect(() => {
        if (pageChanged) {
            $.scrollTo(ref.current as HTMLDivElement, 70);
        }
    }, [pageChanged]);

    return (
        <div className="headline-paginator" ref={ref}>
            {displayedChildren}
            <div className="nav-buttons">
                <ButtonOrPresentation condition={pageNumber > 1} onClick={prevPage}>
                    <FontAwesomeIcon icon={faCaretLeft} />
                    Newer
                </ButtonOrPresentation>
                <ButtonOrPresentation condition={pageNumber < lastPage} onClick={nextPage}>
                    Older
                    <FontAwesomeIcon icon={faCaretRight} />
                </ButtonOrPresentation>
            </div>
        </div>
    );
}

export default function MoreFewer({children, pluralItemName}: {
    pluralItemName: string;
    children: React.ReactNode[];
}) {
    const [expanded, setExpanded] = useState(false);
    const displayedChildren = expanded ?
        <Paginated>{children}</Paginated> :
        <div className="fewer">{children.slice(0, 2)}</div>;
    const theOther = expanded ? 'fewer' : 'more';

    function toggle() {
        setExpanded(!expanded);
    }

    return (
        <div className="more-fewer">
            {displayedChildren}
            <PseudoButton onClick={toggle}>
                See {theOther} {pluralItemName}
            </PseudoButton>
        </div>
    );
}
