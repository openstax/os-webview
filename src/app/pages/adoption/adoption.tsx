import React, {useState, useRef} from 'react';
import {useLocation} from 'react-router-dom';
import useDocumentHead, {useCanonicalLink} from '~/helpers/use-document-head';
import FormHeader from '~/components/form-header/form-header';
import RoleSelector from '~/components/role-selector/role-selector';
import StudentForm from '~/components/student-form/student-form';
import MultiPageForm from '~/components/multi-page-form/multi-page-form';
import ContactInfo from '~/components/contact-info/contact-info';
import YearSelector from '~/components/year-selector/year-selector';
import {useAfterSubmit} from '~/components/book-selector/after-form-submit';
import BookSelector, {
    useSelectedBooks
} from '~/components/book-selector/book-selector';
import {SalesforceBook} from '~/helpers/books';
import HowUsing from './how-using/how-using';
import useSalesforceContext from '~/contexts/salesforce';
import useFormTarget from '~/components/form-target/form-target';
import TrackingParameters from '~/components/tracking-parameters/tracking-parameters';
import {useIntl} from 'react-intl';
import './adoption.scss';

function BookSelectorPage({
    selectedBooksRef,
    year
}: {
    selectedBooksRef: React.MutableRefObject<SalesforceBook[]>;
    year?: string;
}) {
    const [selectedBooks, toggleBook] = useSelectedBooks();
    const bookList = React.useMemo(
        () =>
            selectedBooks.map((b) => b.value.replace(/ *\[.*/, '')).join('; '),
        [selectedBooks]
    );
    const {formatMessage} = useIntl();
    const instructions = formatMessage({id: 'adoption.instructions'});
    const includeFilter = React.useCallback(
        (b: SalesforceBook) => !b.comingSoon,
        []
    );

    selectedBooksRef.current = selectedBooks;
    return (
        <React.Fragment>
            <BookSelector
                prompt={formatMessage({id: 'adoption.book-prompt'})}
                selectedBooks={selectedBooks}
                toggleBook={toggleBook}
                limit={5}
                additionalInstructions={instructions}
                includeFilter={includeFilter}
            />
            <input type="hidden" name="subject_interest" value={bookList} />
            <label>
                <div className="control-group">
                    <HowUsing selectedBooks={selectedBooks} year={year} />
                </div>
            </label>
        </React.Fragment>
    );
}

function FacultyForm({
    position,
    onPageChange
}: {
    position: string;
    onPageChange: (page: number) => void;
}) {
    const selectedBooksRef = useRef<SalesforceBook[]>([]);
    const afterSubmit = useAfterSubmit(selectedBooksRef);
    const {onSubmit, submitting, FormTarget} = useFormTarget(afterSubmit);
    const {adoptionUrl} = useSalesforceContext();
    const validatePage = React.useCallback((page: number) => {
        if (page === 2 && selectedBooksRef.current.length < 1) {
            return false;
        }
        return true;
    }, []);
    const doSubmit = React.useCallback(
        (form: HTMLFormElement) => {
            form.submit();
            onSubmit();
        },
        [onSubmit]
    );
    const {search} = useLocation();
    const selectedYear =
        new window.URLSearchParams(search).get('year') ?? undefined;
    const [copyOfYear, setCopyOfYear] = React.useState<string>();

    return (
        <React.Fragment>
            <FormTarget />
            <MultiPageForm
                validatePage={validatePage}
                action={adoptionUrl}
                onPageChange={onPageChange}
                onSubmit={doSubmit}
                submitting={submitting}
                target="form-target"
            >
                <React.Fragment>
                    <TrackingParameters />
                    <input type="hidden" name="position" value={position} />
                    <input type="hidden" name="role" value="Instructor" />
                    <input
                        type="hidden"
                        name="lead_source"
                        value="Adoption Form"
                    />
                    <input
                        type="hidden"
                        name="process_adoptions"
                        value="true"
                    />
                    <div className="year-selector-container">
                        <YearSelector
                            selectedYear={selectedYear}
                            onValueUpdate={setCopyOfYear}
                        />
                    </div>
                    <ContactInfo />
                </React.Fragment>
                <BookSelectorPage
                    selectedBooksRef={selectedBooksRef}
                    year={copyOfYear}
                />
            </MultiPageForm>
        </React.Fragment>
    );
}

export default function AdoptionForm() {
    const [selectedRole, setSelectedRole] = useState('');
    const [hideRoleSelector, setHideRoleSelector] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const onPageChange = React.useCallback((page: number) => {
        setHideRoleSelector(page > 1);
        ref.current?.scrollIntoView();
    }, []);

    useDocumentHead({title: 'Adoption Form'});
    useCanonicalLink();

    return (
        <main className="adoption-form-v2">
            <FormHeader prefix="adoption" />
            <img
                className="strips"
                src="/dist/images/components/strips.svg"
                height="10"
                alt=""
                role="presentation"
            />
            <div className="text-content" ref={ref}>
                <RoleSelector
                    value={selectedRole}
                    setValue={setSelectedRole}
                    hidden={hideRoleSelector}
                >
                    <StudentForm />
                    <FacultyForm
                        position={selectedRole}
                        onPageChange={onPageChange}
                    />
                </RoleSelector>
            </div>
        </main>
    );
}
