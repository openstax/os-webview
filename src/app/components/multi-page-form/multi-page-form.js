import React, {useState, useRef, useEffect} from 'react';
import analytics from '~/helpers/analytics';
import './multi-page-form.css';

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
        const formData = new FormData(form);
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
    activeRef, formRef, onSubmit
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
        <div class="button-row">
            <button
                type="button" class="secondary back"
                hidden={currentPage === 1}
                onClick={previousPage}
            >
                Back
            </button>
            <button
                type="submit" class="primary"
                hidden={currentPage < pages}
                onClick={validateAndSubmit}
            >
                Submit
            </button>
            <button
                type="button" class="primary next"
                hidden={currentPage === pages}
                onClick={nextPage}
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
    }, [currentPage]);

    return (
        <div className="multi-page-form">
            <iframe
                name="form-response" id="form-response" class="hidden"
                src="" width="0" height="0" tabindex="-1" />
            <form
                accept-charset="UTF-8" class="form"
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
                    submitting ?
                        <div className="big-message">Submitting...</div> :
                        <ButtonRow {...buttonRowProps} />
                }
            </form>
        </div>
    );
}
