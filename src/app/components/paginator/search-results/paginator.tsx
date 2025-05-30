import React from 'react';
import usePaginatorContext from '../paginator-context';
import './paginator.scss';

function getPageIndicators(pages: number, currentPage: number) {
    const indicatorCount = Math.min(pages, 5);
    const propsFor = (label: number) => ({
        label,
        page: `page ${label}`,
        disabled: label === currentPage,
        selected: label === currentPage
    });
    const result = Array(indicatorCount).fill(0);

    if (pages - currentPage < 3) {
        result[0] = pages - indicatorCount + 1;
    } else {
        result[0] = currentPage > 3 ? currentPage - 2 : 1;
    }
    for (let i = 1; i < indicatorCount; ++i) {
        result[i] = result[i - 1] + 1;
    }
    return result.map(propsFor);
}

function PageButtonBar({pages}: {pages: number}) {
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
        <nav aria-label="pagination">
            <ul className="no-bullets button-bar">
                <li>
                    <button disabled={disablePrevious} onClick={prevPage}>
                        Previous
                    </button>
                </li>
                {pageIndicators.map((indicator) => (
                    <li key={indicator.page}>
                        <button
                            disabled={indicator.disabled}
                            aria-current={indicator.selected ? 'page' : 'false'}
                            aria-label={indicator.page}
                            onClick={() => setCurrentPage(indicator.label)}
                        >
                            {indicator.label}
                        </button>
                    </li>
                ))}
                <li>
                    <button disabled={disableNext} onClick={nextPage}>
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export function PaginatorControls({items}: {items: number}) {
    const {currentPage, resultsPerPage} = usePaginatorContext();
    const pages = Math.ceil(items / resultsPerPage);
    const firstIndex = (currentPage - 1) * resultsPerPage;
    const endBefore = Math.min(firstIndex + resultsPerPage, items);
    const resultRange = `${firstIndex + 1}-${endBefore}`;
    const searchTerm = new window.URLSearchParams(window.location.search).get(
        'q'
    );

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
