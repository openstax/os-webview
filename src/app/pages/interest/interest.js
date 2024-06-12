import React, { useState, useRef } from 'react';
import useDocumentHead, { useCanonicalLink } from '~/helpers/use-document-head';
import FormHeader from '~/components/form-header/form-header';
import RoleSelector from '~/components/role-selector/role-selector';
import StudentForm from '~/components/student-form/student-form';
import MultiPageForm from '~/components/multi-page-form/multi-page-form';
import ContactInfo from '~/components/contact-info/contact-info';
import {
    useAfterSubmit,
    useFirstSearchArgument
} from '~/components/book-selector/after-form-submit';
import BookSelector, {
    useSelectedBooks
} from '~/components/book-selector/book-selector';
import useFormTarget from '~/components/form-target/form-target';
import useSalesforceContext from '~/contexts/salesforce';
import FormInput from '~/components/form-input/form-input';
import FormCheckboxgroup from '~/components/form-checkboxgroup/form-checkboxgroup';
import TrackingParameters from '~/components/tracking-parameters/tracking-parameters';
import {useIntl} from 'react-intl';
import './interest.scss';

function useBundledValues() {
    const [bundledValues, setBundledValues] = useState('');
    const onChange = React.useCallback(
        (values) => setBundledValues(values.join('; ')),
        []
    );

    function BundledValuesInput() {
        return (
            <input
                type="hidden"
                name="how_did_you_hear"
                value={bundledValues}
            />
        );
    }

    return { onChange, BundledValuesInput };
}

function HowDidYouHear() {
    const {formatMessage} = useIntl();
    const options = [
        { value: 'Web search', label: formatMessage({id: 'interest.option.Web search'}) },
        { value: 'Colleague', label: formatMessage({id: 'interest.option.Colleague'}) },
        { value: 'Conference', label: formatMessage({id: 'interest.option.Conference'}) },
        { value: 'Email', label: formatMessage({id: 'interest.option.Email'}) },
        { value: 'Facebook', label: formatMessage({id: 'interest.option.Facebook'}) },
        { value: 'Twitter', label: formatMessage({id: 'interest.option.Twitter'}) },
        { value: 'Webinar', label: formatMessage({id: 'interest.option.Webinar'}) },
        { value: 'Partner organization', label: formatMessage({id: 'interest.option.Partner organization'}) }
    ];
    const { onChange, BundledValuesInput } = useBundledValues();

    return (
        <React.Fragment>
            <FormCheckboxgroup
                longLabel={formatMessage({id: 'interest.how'})}
                instructions={formatMessage({id: 'interest.select-instruction'})}
                options={options}
                onChange={onChange}
            />
            <BundledValuesInput />
        </React.Fragment>
    );
}

function BookSelectorPage({ selectedBooksRef }) {
    const preselectedTitle = useFirstSearchArgument();
    const [selectedBooks, toggleBook] = useSelectedBooks();
    const bookList = selectedBooks.map((b) => b.value).join('; ');
    const {formatMessage} = useIntl();

    selectedBooksRef.current = selectedBooks;

    return (
        <div className="page-2">
            <BookSelector
                prompt={formatMessage({id: 'interest.books-prompt'})}
                required
                selectedBooks={selectedBooks}
                preselectedTitle={preselectedTitle}
                toggleBook={toggleBook}
                limit="5"
            />
            <FormInput
                longLabel={formatMessage({id: 'interest.students-prompt'})}
                inputProps={{
                    name: 'number_of_students',
                    type: 'number',
                    min: '1',
                    max: '999',
                    required: true
                }}
            />
            <input type="hidden" name="subject_interest" value={bookList} />
            <HowDidYouHear />
        </div>
    );
}

function FacultyForm({ position, onPageChange, role }) {
    const selectedBooksRef = useRef();
    const afterSubmit = useAfterSubmit(selectedBooksRef);
    const { onSubmit, submitting, FormTarget } = useFormTarget(afterSubmit);
    const { interestUrl } = useSalesforceContext();

    function validatePage(page) {
        return Boolean(page !== 1 || position !== 'Student');
    }

    const doSubmit = React.useCallback(
        (form) => {
            if (selectedBooksRef.current?.length > 0) {
                form.submit();
                onSubmit();
            }
        },
        [onSubmit]
    );

    return (
        <React.Fragment>
            <FormTarget submitting={submitting} />
            <MultiPageForm
                validatePage={validatePage}
                action={interestUrl}
                onPageChange={onPageChange}
                onSubmit={doSubmit}
                submitting={submitting}
                target="form-target"
            >
                <React.Fragment>
                    <TrackingParameters />
                    <input type="hidden" name="position" value={position} />
                    <input type="hidden" name="role" value={role} />
                    <input
                        type="hidden"
                        name="lead_source"
                        value="Interest Form"
                    />
                    <ContactInfo />
                </React.Fragment>
                <BookSelectorPage selectedBooksRef={selectedBooksRef} />
            </MultiPageForm>
        </React.Fragment>
    );
}

export function InterestForm({ role = 'Instructor' }) {
    const [selectedRole, setSelectedRole] = useState('');
    const [hideRoleSelector, setHideRoleSelector] = useState(false);
    const ref = useRef();
    const onPageChange = React.useCallback((page) => {
        setHideRoleSelector(page > 1);
        ref.current.scrollIntoView();
    }, []);

    return (
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
                    role={role}
                />
            </RoleSelector>
        </div>
    );
}

export default function InterestPage() {
    useDocumentHead({ title: 'Interest Form' });
    useCanonicalLink();

    return (
        <main className="interest-form-v2">
            <FormHeader prefix="interest" />
            <img
                className="strips"
                src="/dist/images/components/strips.svg"
                height="10"
                alt=""
                role="presentation"
            />
            <InterestForm />
        </main>
    );
}
