import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import {faChevronRight} from '@fortawesome/free-solid-svg-icons/faChevronRight';
import range from 'lodash/range';
import './simple-paginator.scss';

function ControlButton({active, icon, onClick}) {
    return (
        <button disabled={!active} onClick={onClick}>
            <FontAwesomeIcon icon={icon} />
        </button>
    );
}

function PageLink({page, setPage}) {
    const onClick = React.useCallback(
        (e) => {
            e.preventDefault();
            setPage(page);
        },
        [page, setPage]
    );

    return (
        <a href={page} onClick={onClick}>{page}</a>
    );
}

function PagesBeforeCurrent({currentPage, totalPages, setPage}) {
    if (currentPage === 1) {
        return null;
    }

    if (currentPage < 4) {
        return (
            <React.Fragment>
                {range(1, currentPage).map((p) => <PageLink page={p} key={p} setPage={setPage} />)}
            </React.Fragment>
        );
    }

    const numbersAfterCurrentPage = totalPages - currentPage;
    const pagesAfterEllipsis = Math.max(3 - numbersAfterCurrentPage, 0);
    const rangeStart = currentPage - pagesAfterEllipsis;

    return (
        <React.Fragment>
            <PageLink page={1} setPage={setPage} />
            &hellip;
            {range(rangeStart, currentPage).map((p) => <PageLink page={p} key={p} setPage={setPage} />)}
        </React.Fragment>
    );
}

function PagesAfterCurrent({currentPage, totalPages, setPage}) {
    if (currentPage === totalPages) {
        return null;
    }

    if (currentPage > totalPages - 4) {
        return (
            <React.Fragment>
                {
                    range(currentPage + 1, totalPages + 1)
                        .map((p) => <PageLink page={p} key={p} setPage={setPage} />)
                }
            </React.Fragment>
        );
    }

    const numbersBeforeCurrentPage = currentPage - 1;
    const pagesBeforeEllipsis = Math.max(3 - numbersBeforeCurrentPage, 1);
    const rangeEnd = currentPage + pagesBeforeEllipsis + 1;

    return (
        <React.Fragment>
            {range(currentPage + 1, rangeEnd).map((p) => <PageLink page={p} key={p} setPage={setPage} />)}
            &hellip;
            <PageLink page={totalPages} setPage={setPage} />
        </React.Fragment>
    );
}

export default function SimplePaginator({currentPage, setPage, totalPages}) {
    const nextPage = () => setPage(currentPage + 1);
    const prevPage = () => setPage(currentPage - 1);

    return (
        <div className="simple-paginator">
            <ControlButton active={currentPage > 1} icon={faChevronLeft} onClick={prevPage} />
            <PagesBeforeCurrent {...{currentPage, totalPages, setPage}} />
            <span className="current-page">{currentPage}</span>
            <PagesAfterCurrent {...{currentPage, totalPages, setPage}} />
            <ControlButton active={currentPage < totalPages} icon={faChevronRight} onClick={nextPage} />
        </div>
    );
}

export function itemRangeOnPage(page, perPage, totalCount) {
    const end = Math.min(totalCount, page * perPage);
    const start = (page - 1) * perPage + 1;

    return [start, end];
}

export function Showing({page, perPage=9, totalCount, ofWhat}) {
    const [start, end] = itemRangeOnPage(page, perPage, totalCount);
    const countMessage = totalCount <= perPage ? 'all' : `${start}-${end} of`;

    return (
        <div className="whats-showing">
            Showing {countMessage} {totalCount} {ofWhat}
        </div>
    );
}
