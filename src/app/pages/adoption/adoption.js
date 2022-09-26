import React, {useState, useEffect, useRef} from 'react';
import {useCanonicalLink} from '~/helpers/page-data-utils';
import $ from '~/helpers/$';
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
import './adoption.scss';

function BookSelectorPage({selectedBooksRef}) {
    const preselectedTitle = useFirstSearchArgument();
    const [selectedBooks, toggleBook] = useSelectedBooks();
    const bookList = selectedBooks.map((b) => b.value).join('; ');
    const instructions = 'Select titles you are using even if the edition number is different.';

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
            />
            <input type="hidden" name="subject" value={bookList} />
            <label>
                <div className="control-group">
                    <HowUsing selectedBooks={selectedBooks} />
                    <input type="checkbox" name="have_xanedu" />
                    Have Xanedu, the OpenStax print partner, contact me about how to
                    get print copies for my students.
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

    function validatePage(page) {
        if (page === 1 && position === 'Student') {
            return false;
        }
        if (page === 2 && selectedBooksRef.current.length < 1) {
            return false;
        }
        return true;
    }

    function doSubmit(form) {
        form.submit();
        onSubmit();
    }

    return (
        <React.Fragment>
            <FormTarget submitting={submitting} />
            <MultiPageForm
                validatePage={validatePage} action={adoptionUrl}
                onPageChange={onPageChange} onSubmit={doSubmit}
                submitting={submitting} target="form-target"
            >
                <React.Fragment>
                    <input type="hidden" name="application_source" value="OS Web" />
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

    useEffect(() => {
        $.setPageTitleAndDescription('Adoption Form');
    }, []);
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
