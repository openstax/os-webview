import React from 'react';
import './paginator.css';

const RESULTS_PER_PAGE = 10;

export function PaginatedResults({currentPage, children}) {
    const firstOnPage = (currentPage - 1) * RESULTS_PER_PAGE;

    return (
        <div className="cards boxed">
            {
                children.slice(firstOnPage, firstOnPage + RESULTS_PER_PAGE)
            }
        </div>
    );
}

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
    return result;
}

function PageButtonBar({currentPage, pages, setCurrentPage}) {
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
        <div className="button-bar">
            <button disabled={disablePrevious} onClick={prevPage}>Previous</button>
            {
                pageIndicators.map((indicator) =>
                    <button
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

export function PaginatorControls({items, currentPage, setCurrentPage}) {
    const pages = Math.ceil(items / RESULTS_PER_PAGE);
    const firstIndex = (currentPage - 1) * RESULTS_PER_PAGE;
    const endBefore = Math.min(firstIndex + RESULTS_PER_PAGE, items);
    const resultRange = `${firstIndex + 1}-${endBefore}`;
    const searchTerm = decodeURIComponent(window.location.search.substr(1));

    return (
        <div className="paginator">
            {
                pages > 1 &&
                    <PageButtonBar
                        pages={pages}
                        currentPage={currentPage} setCurrentPage={setCurrentPage}
                    />
            }
            <div className="summary">{resultRange} of {items} for <b>'{searchTerm}'</b></div>
        </div>
    );
}
