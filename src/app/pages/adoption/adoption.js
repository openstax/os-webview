import React, {useState, useRef} from 'react';
import useDocumentHead, {useCanonicalLink} from '~/helpers/use-document-head';
import FormHeader from '~/components/form-header/form-header';
import RoleSelector from '~/components/role-selector/role-selector';
import StudentForm from '~/components/student-form/student-form';
import MultiPageForm from '~/components/multi-page-form/multi-page-form';
import ContactInfo from '~/components/contact-info/contact-info';
import BookSelector, {useSelectedBooks, useAfterSubmit, useFirstSearchArgument}
    from '~/components/book-selector/book-selector';
import HowUsing from './how-using/how-using';
import useSalesforceContext from '~/contexts/salesforce';
import useFormTarget from '~/components/form-target/form-target';
import TrackingParameters from '~/components/tracking-parameters/tracking-parameters';
import './adoption.scss';

function BookSelectorPage({selectedBooksRef}) {
    const preselectedTitle = useFirstSearchArgument();
    const [selectedBooks, toggleBook] = useSelectedBooks();
    const bookList = React.useMemo(
        () => selectedBooks.map((b) => b.value).join('; '),
        [selectedBooks]
    );
    const instructions = 'Select titles you are using even if the edition number is different.';
    const includeFilter = React.useCallback(
        (b) => !b.comingSoon,
        []
    );

    selectedBooksRef.current = selectedBooks;
    return (
        <React.Fragment>
            <BookSelector
                prompt="Which textbook(s) are you currently using?"
                required
                selectedBooks={selectedBooks}
                preselectedTitle={preselectedTitle}
                toggleBook={toggleBook}
                limit="5"
                additionalInstructions={instructions}
                includeFilter={includeFilter}
            />
            <input type="hidden" name="subject_interest" value={bookList} />
            <label>
                <div className="control-group">
                    <HowUsing selectedBooks={selectedBooks} />
                </div>
            </label>
        </React.Fragment>
    );
}

function FacultyForm({position, onPageChange}) {
    const selectedBooksRef = useRef();
    const afterSubmit = useAfterSubmit(selectedBooksRef);
    const {onSubmit, submitting, FormTarget} = useFormTarget(afterSubmit);
    const {adoptionUrl} = useSalesforceContext();
    const validatePage = React.useCallback(
        (page) => {
            if (page === 1 && position === 'Student') {
                return false;
            }
            if (page === 2 && selectedBooksRef.current.length < 1) {
                return false;
            }
            return true;
        },
        [position]
    );
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
                validatePage={validatePage} action={adoptionUrl}
                onPageChange={onPageChange} onSubmit={doSubmit}
                submitting={submitting} target="form-target"
            >
                <React.Fragment>
                    <TrackingParameters />
                    <input type="hidden" name="position" value={position} />
                    <input type="hidden" name="role" value="Instructor" />
                    <input type="hidden" name="lead_source" value="Adoption Form" />
                    <input type="hidden" name="process_adoptions" value={true} />
                    <ContactInfo />
                </React.Fragment>
                <BookSelectorPage selectedBooksRef={selectedBooksRef} />
            </MultiPageForm>
        </React.Fragment>
    );
}

export default function AdoptionForm() {
    const [selectedRole, setSelectedRole] = useState('');
    const [hideRoleSelector, setHideRoleSelector] = useState(false);
    const ref = useRef();
    const onPageChange = React.useCallback(
        (page) => {
            setHideRoleSelector(page > 1);
            ref.current.scrollIntoView();
        },
        []
    );

    useDocumentHead({title: 'Adoption Form'});
    useCanonicalLink();

    return (
        <main className="adoption-form-v2">
            <FormHeader prefix="adoption" />
            <img className="strips" src="/dist/images/components/strips.svg" height="10" alt="" role="presentation" />
            <div className="text-content" ref={ref}>
                <RoleSelector value={selectedRole} setValue={setSelectedRole} hidden={hideRoleSelector}>
                    <StudentForm />
                    <FacultyForm position={selectedRole} onPageChange={onPageChange} />
                </RoleSelector>
            </div>
        </main>
    );
}
