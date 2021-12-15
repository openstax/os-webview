import React, {useCallback} from 'react';
import usePaginatorContext, {PaginatorContextProvider} from '~/components/paginator/paginator-context';
import usePagesContext, {PagesContextProvider} from './pages-context';
import './multi-page-form.scss';

function pass() {
    return true;
}

function MarkupChildren({children}) {
    const {isVisible} = usePaginatorContext();
    const {validatedPages, activeRef} = usePagesContext();

    return (
        children.map((child, i) => {
            const isActive = isVisible(i);
            const pageNumber = i + 1;
            const isValidated = pageNumber in validatedPages;

            return (
                <div
                    className={isValidated ? 'validated' : undefined}
                    hidden={!isActive}
                    ref={isActive ? activeRef : null}
                    key={i}
                >
                    {child}
                </div>
            );
        })
    );
}

function PageCount() {
    const {currentPage} = usePaginatorContext();
    const {pages} = usePagesContext();

    return (
        <div className="page-count">
            Step {currentPage} of {pages}
        </div>
    );
}

function BackButton({disabled}) {
    const {currentPage, setCurrentPage} = usePaginatorContext();
    const previousPage = useCallback(
        () => setCurrentPage(currentPage - 1),
        [setCurrentPage, currentPage]
    );

    return (
        <button
            type="button" className="secondary back"
            hidden={currentPage === 1}
            onClick={previousPage}
            disabled={disabled}
        >
            Back
        </button>
    );
}

function SubmitButton({disabled, formRef, onSubmit}) {
    const {currentPage} = usePaginatorContext();
    const {pages, validateCurrentPage} = usePagesContext();
    const validateAndSubmit = useCallback(
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
            type="submit" className="primary"
            hidden={currentPage < pages}
            onClick={validateAndSubmit}
            disabled={disabled}
        >
            Submit
        </button>
    );
}

function NextButton({disabled}) {
    const {currentPage, setCurrentPage} = usePaginatorContext();
    const {pages, validateCurrentPage} = usePagesContext();
    const nextPage = useCallback(
        () => {
            if (validateCurrentPage()) {
                setCurrentPage(currentPage + 1);
            }
        },
        [validateCurrentPage, setCurrentPage, currentPage]
    );

    return (
        <button
            type="button" className="primary next"
            hidden={currentPage === pages}
            onClick={nextPage}
            disabled={disabled}
        >
            Next
        </button>
    );
}

function ButtonRow({
    formRef, onSubmit, disabled=false
}) {
    return (
        <div className="button-row">
            <BackButton disabled={disabled} />
            <SubmitButton
                disabled={disabled} onSubmit={onSubmit}
                formRef={formRef}
            />
            <NextButton disabled={disabled} />
        </div>
    );
}

function MultiPageFormInContext({
    children,
    validatePage=pass, onPageChange=pass, onSubmit=pass,
    submitting, ...formParams
}) {
    const formRef = React.useRef();

    return (
        <div className="multi-page-form">
            <form
                acceptCharset="UTF-8" className="form"
                method="post" ref={formRef} {...formParams}
            >
                <PagesContextProvider
                    contextValueParameters={{
                        pages: children.length,
                        validatePage,
                        onPageChange
                    }}
                >
                    <MarkupChildren children={children} />
                    <PageCount />
                    {
                        submitting &&
                            <div className="big-message">Submitting...</div>
                    }
                    <ButtonRow disabled={submitting} {...{formRef, onSubmit}} />
                </PagesContextProvider>
            </form>
        </div>
    );
}

export default function MultiPageForm(params) {
    return (
        <PaginatorContextProvider>
            <MultiPageFormInContext {...params} />
        </PaginatorContextProvider>
    );
}
