import React, {useState, useEffect, useRef} from 'react';
import './more-fewer.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import $ from '~/helpers/$';

function PseudoButton({onClick, children}) {
    return (
        <div role="button" tabIndex="0" onClick={onClick} onKeyDown={$.treatSpaceOrEnterAsClick}>
            {children}
        </div>
    );
}

function ButtonOrPresentation({condition, children, onClick}) {
    return (
        condition ?
            <PseudoButton onClick={onClick} children={children} /> :
            <div role="presentation" children={children} />
    );
}

export function Paginated({children}) {
    const [pageNumber, setPageNumber] = useState(1);
    const [pageChanged, setPageChanged] = useState();
    const perPage = 10;
    const lastPage = Math.ceil(children.length / perPage);
    const firstDisplayed = perPage * (pageNumber - 1);
    const displayedChildren = children
        .slice(perPage * (pageNumber - 1), firstDisplayed + perPage);
    const ref=useRef();

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
            $.scrollTo(ref.current, 70);
        }
    }, [pageChanged]);

    return (
        <div className="headline-paginator" ref={ref}>
            {displayedChildren}
            <div class="nav-buttons">
                <ButtonOrPresentation condition={pageNumber > 1} onClick={prevPage}>
                    <FontAwesomeIcon icon="caret-left" />
                    Newer
                </ButtonOrPresentation>
                <ButtonOrPresentation condition={pageNumber < lastPage} onClick={nextPage}>
                    Older
                    <FontAwesomeIcon icon="caret-right" />
                </ButtonOrPresentation>
            </div>
        </div>
    );
}

export default function MoreFewer({children, pluralItemName}) {
    const [expanded, setExpanded] = useState(false);
    const displayedChildren = expanded ?
        <Paginated>{children}</Paginated> :
        <div class="fewer">{children.slice(0, 2)}</div>;
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
