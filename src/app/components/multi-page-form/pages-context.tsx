import {useState, useRef, useEffect, useCallback} from 'react';
import usePaginatorContext from '~/components/paginator/paginator-context';
import buildContext from '~/components/jsx-helpers/build-context';

function useContextValue({pages, validatePage, onPageChange}: {
    pages: number;
    validatePage: (p: unknown) => boolean;
    onPageChange: (p: unknown) => void;
}) {
    const [validatedPages, setValidatedPages] = useState({});
    const activeRef = useRef<HTMLDivElement>(null);
    const {currentPage} = usePaginatorContext();
    const validateCurrentPage = useCallback(
        () => {
            const invalid = activeRef.current?.querySelector(':invalid');

            setValidatedPages({[currentPage]: true, ...validatedPages});
            return invalid === null && validatePage(currentPage);
        },
        [currentPage, validatedPages, validatePage]
    );

    useEffect(() => {
        onPageChange(currentPage);
    }, [currentPage, onPageChange]);

    return {pages, validatedPages, validateCurrentPage, activeRef};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as PagesContextProvider
};
