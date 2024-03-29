import React, { useState, useRef } from 'react';
import useDocumentHead, { useCanonicalLink } from '~/helpers/use-document-head';
import FormHeader from '~/components/form-header/form-header';
import RoleSelector from '~/components/role-selector/role-selector';
import StudentForm from '~/components/student-form/student-form';
import MultiPageForm from '~/components/multi-page-form/multi-page-form';
import ContactInfo from '~/components/contact-info/contact-info';
import BookSelector, {
    useSelectedBooks,
    useAfterSubmit,
    useFirstSearchArgument
} from '~/components/book-selector/book-selector';
import useFormTarget from '~/components/form-target/form-target';
import useSalesforceContext from '~/contexts/salesforce';
import FormInput from '~/components/form-input/form-input';
import FormCheckboxgroup from '~/components/form-checkboxgroup/form-checkboxgroup';
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
    const options = [
        { value: 'Web search', label: 'Web search' },
        { value: 'Colleague', label: 'Colleague' },
        { value: 'Conference', label: 'Conference' },
        { value: 'Email', label: 'Email' },
        { value: 'Facebook', label: 'Facebook' },
        { value: 'Twitter', label: 'Twitter' },
        { value: 'Webinar', label: 'Webinar' },
        { value: 'Partner organization', label: 'Partner organization' }
    ];
    const { onChange, BundledValuesInput } = useBundledValues();

    return (
        <React.Fragment>
            <FormCheckboxgroup
                longLabel="How did you hear about OpenStax?"
                instructions="Select all that apply (optional)."
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

    selectedBooksRef.current = selectedBooks;

    return (
        <div className="page-2">
            <BookSelector
                prompt="Which textbook(s) are you interested in using?"
                required
                selectedBooks={selectedBooks}
                preselectedTitle={preselectedTitle}
                toggleBook={toggleBook}
                limit="5"
            />
            <FormInput
                longLabel="How many students do you teach each semester?"
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
                    <input
                        type="hidden"
                        name="application_source"
                        value="OS Web"
                    />
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
