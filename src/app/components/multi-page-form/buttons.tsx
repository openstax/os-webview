import React, {useCallback} from 'react';
import usePaginatorContext from '~/components/paginator/paginator-context';
import usePagesContext from './pages-context';

type Args = {
    formRef: React.MutableRefObject<HTMLFormElement>;
    disabled: boolean;
    onSubmit: (form: HTMLFormElement) => void;
};

export default function ButtonRow({formRef, onSubmit, disabled = false}: Args) {
    return (
        <div className="button-row">
            <BackButton disabled={disabled} />
            <SubmitButton
                disabled={disabled}
                onSubmit={onSubmit}
                formRef={formRef}
            />
            <NextButton disabled={disabled} />
        </div>
    );
}

function BackButton({disabled}: Pick<Args, 'disabled'>) {
    const {currentPage, setCurrentPage} = usePaginatorContext();
    const previousPage = useCallback(
        () => setCurrentPage(currentPage - 1),
        [setCurrentPage, currentPage]
    );

    return (
        <button
            type="button"
            className="secondary back"
            hidden={currentPage === 1}
            onClick={previousPage}
            disabled={disabled}
        >
            Back
        </button>
    );
}

function SubmitButton({disabled, formRef, onSubmit}: Args) {
    const {currentPage} = usePaginatorContext();
    const {pages, validateCurrentPage} = usePagesContext();
    const validateAndSubmit = useCallback<React.MouseEventHandler>(
        (event) => {
            if (validateCurrentPage()) {
                onSubmit(formRef.current);
            }
            event.preventDefault();
        },
        [validateCurrentPage, onSubmit, formRef]
    );

    return (
        <button
            type="submit"
            className="primary"
            hidden={currentPage < pages}
            onClick={validateAndSubmit}
            disabled={disabled}
        >
            Submit
        </button>
    );
}

function NextButton({disabled}: Pick<Args, 'disabled'>) {
    const {currentPage, setCurrentPage} = usePaginatorContext();
    const {pages, validateCurrentPage} = usePagesContext();
    const nextPage = useCallback(() => {
        if (validateCurrentPage()) {
            setCurrentPage(currentPage + 1);
        }
    }, [validateCurrentPage, setCurrentPage, currentPage]);

    return (
        <button
            type="button"
            className="primary next"
            hidden={currentPage === pages}
            onClick={nextPage}
            disabled={disabled}
        >
            Next
        </button>
    );
}
