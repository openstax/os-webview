import React from 'react';
import usePaginatorContext, {PaginatorContextProvider} from '~/components/paginator/paginator-context';
import usePagesContext, {PagesContextProvider} from './pages-context';
import {FormattedMessage} from 'react-intl';
import ButtonRow from './buttons';
import './multi-page-form.scss';

function pass() {
    return true;
}

function MarkupChildren({children}: {children: React.ReactNode[]}) {
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
            <FormattedMessage id="form.step-of" values={{current: currentPage, total: pages}} />
        </div>
    );
}

type MultiPageFormProps = {
    children: React.ReactNode[];
    validatePage?: (p: number) => boolean;
    onPageChange?: (p: number) => void;
    onSubmit: (form: HTMLFormElement) => void;
    submitting: boolean;
    // onSubmit is redefined above to be simpler
} & Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>;

function MultiPageFormInContext({
    children,
    validatePage=pass, onPageChange=pass, onSubmit,
    submitting, ...formParams
}: MultiPageFormProps) {
    const formRef = React.useRef<HTMLFormElement>(null);

    return (
        <div className="multi-page-form">
            <form
                acceptCharset="UTF-8" className="form"
                method="post" ref={formRef} {...formParams}
                aria-label="form"
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

export default function MultiPageForm(params: MultiPageFormProps) {
    return (
        <PaginatorContextProvider>
            <MultiPageFormInContext {...params} />
        </PaginatorContextProvider>
    );
}
