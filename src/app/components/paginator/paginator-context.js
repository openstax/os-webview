import {useState, useCallback} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';

function useContextValue(params={}) {
    const {resultsPerPage=1, initialPage=1} = params;
    const [currentPage, setCurrentPage] = useState(initialPage);
    const firstOnPage = (currentPage - 1) * resultsPerPage;
    const lastOnPage = firstOnPage + resultsPerPage - 1;
    const isVisible = useCallback(
        (childIndex) => childIndex >= firstOnPage && childIndex <= lastOnPage,
        [firstOnPage, lastOnPage]
    );
    const visibleChildren = useCallback(
        (children) => children.slice(firstOnPage, lastOnPage + 1),
        [firstOnPage, lastOnPage]
    );

    return {currentPage, setCurrentPage, resultsPerPage, firstOnPage, lastOnPage, isVisible, visibleChildren};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as PaginatorContextProvider
};
