import React, {useState, useRef, useEffect} from 'react';
import analytics from '~/helpers/analytics';
import './multi-page-form.scss';

function pass() {
    return true;
}

function MarkupChildren({children, currentPage, activeRef, validatedPages}) {
    return children.map((child, i) => {
        const pageNumber = i + 1;
        const isActive = pageNumber === currentPage;
        const isValidated = pageNumber in validatedPages;

        return (
            <div
                className={isValidated ? 'validated' : undefined}
                hidden={!isActive}
                ref={isActive ? activeRef : null}
                key={pageNumber}
            >
                {child}
            </div>
        );
    });
}

function trackSubmissionInGA(form) {
    if (form.action.startsWith('https://webto.salesforce.com/')) {
        const formData = new window.FormData(form);
        const eventLabel = formData.get('lead_source');

        analytics.sendEvent({
            eventCategory: 'Salesforce',
            eventAction: 'submit',
            eventLabel
        });
    }
}

function ButtonRow({pages, currentPage, setCurrentPage,
    validatePage, validatedPages, setValidatedPages,
    activeRef, formRef, onSubmit, disabled=false
}) {
    function validateCurrentPage() {
        const invalid = activeRef.current.querySelector(':invalid');

        setValidatedPages({[currentPage]: true, ...validatedPages});
        return invalid === null && validatePage(currentPage);
    }
    function previousPage() {
        setCurrentPage(currentPage - 1);
    }
    function nextPage() {
        if (validateCurrentPage()) {
            setCurrentPage(currentPage + 1);
        }
    }
    function validateAndSubmit(event) {
        if (validateCurrentPage()) {
            onSubmit(formRef.current);
            trackSubmissionInGA(formRef.current);
        }
        event.preventDefault();
    }

    return (
        <div className="button-row">
            <button
                type="button" className="secondary back"
                hidden={currentPage === 1}
                onClick={previousPage}
                disabled={disabled}
            >
                Back
            </button>
            <button
                type="submit" className="primary"
                hidden={currentPage < pages}
                onClick={validateAndSubmit}
                disabled={disabled}
            >
                Submit
            </button>
            <button
                type="button" className="primary next"
                hidden={currentPage === pages}
                onClick={nextPage}
                disabled={disabled}
            >
                Next
            </button>
        </div>
    );
}

export default function MultiPageForm({
    debug, action, children,
    validatePage=pass, onPageChange=pass, onSubmit=pass,
    submitting
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [validatedPages, setValidatedPages] = useState({});
    const formRef = useRef();
    const activeRef = useRef();
    const pages = children.length;
    const buttonRowProps = {
        pages,
        currentPage,
        setCurrentPage,
        validatePage,
        validatedPages,
        setValidatedPages,
        activeRef,
        formRef,
        onSubmit
    };

    useEffect(() => {
        onPageChange(currentPage);
    }, [currentPage, onPageChange]);

    return (
        <div className="multi-page-form">
            <iframe
                name="form-response" id="form-response" className="hidden"
                src="" width="0" height="0" tabIndex="-1" />
            <form
                acceptCharset="UTF-8" className="form"
                target={debug ? undefined : 'form-response'}
                action={action} method="post" ref={formRef}>
                <MarkupChildren
                    children={children}
                    currentPage={currentPage}
                    activeRef={activeRef}
                    validatedPages={validatedPages}
                    onSubmit={onSubmit}
                />
                {
                    submitting &&
                        <div className="big-message">Submitting...</div>
                }
                <ButtonRow disabled={submitting} {...buttonRowProps} />
            </form>
        </div>
    );
}
