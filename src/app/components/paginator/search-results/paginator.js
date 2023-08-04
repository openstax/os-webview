import React from 'react';
import usePaginatorContext from '../paginator-context';
import './paginator.scss';

function getPageIndicators(pages, currentPage) {
    const indicatorCount = Math.min(pages, 5);
    const propsFor = (label) => ({
        label,
        page: `page ${label}`,
        disabled: label === currentPage,
        selected: label === currentPage
    });
    const result = Array(indicatorCount).fill();

    if (pages - currentPage < 3) {
        result[0] = pages - indicatorCount + 1;
    } else {
        result[0] = (currentPage > 3) ? currentPage - 2 : 1;
    }
    for (let i = 1; i < indicatorCount; ++i) {
        result[i] = result[i-1] + 1;
    }
    return result.map(propsFor);
}

function PageButtonBar({pages}) {
    const {currentPage, setCurrentPage} = usePaginatorContext();
    const disablePrevious = currentPage === 1;
    const disableNext = currentPage === pages;
    const pageIndicators = getPageIndicators(pages, currentPage);

    function prevPage() {
        setCurrentPage(currentPage - 1);
    }
    function nextPage() {
        setCurrentPage(currentPage + 1);
    }

    return (
        <div className="button-bar" role="listbox">
            <button disabled={disablePrevious} onClick={prevPage}>Previous</button>
            {
                pageIndicators.map((indicator) =>
                    <button
                        role="option"
                        key={indicator}
                        disabled={indicator.disabled}
                        aria-selected={indicator.selected}
                        aria-label={indicator.page}
                        onClick={() => setCurrentPage(indicator.label)}
                    >{indicator.label}</button>
                )
            }
            <button disabled={disableNext} onClick={nextPage}>Next</button>
        </div>
    );
}

export function PaginatorControls({items}) {
    const {currentPage, resultsPerPage} = usePaginatorContext();
    const pages = Math.ceil(items / resultsPerPage);
    const firstIndex = (currentPage - 1) * resultsPerPage;
    const endBefore = Math.min(firstIndex + resultsPerPage, items);
    const resultRange = `${firstIndex + 1}-${endBefore}`;
    const searchTerm = new window.URLSearchParams(window.location.search).get('q');

    return (
        <div className="paginator">
            {pages > 1 && <PageButtonBar pages={pages} />}
            <div className="summary">
                {items > 0 && `${resultRange} of `}
                {items} for <b>&apos;{searchTerm}&apos;</b>
            </div>
        </div>
    );
}
