import React, {useState, useEffect, useRef} from 'react';
import {useCanonicalLink} from '~/components/jsx-helpers/jsx-helpers.jsx';
import $ from '~/helpers/$';
import FormHeader from '~/components/form-header/form-header';
import RoleSelector from '~/components/role-selector/role-selector';
import StudentForm from '~/components/student-form/student-form';
import MultiPageForm from '~/components/multi-page-form/multi-page-form';
import ContactInfo from '~/components/contact-info/contact-info';
import BookSelector, {useSelectedBooks} from '~/components/book-selector/book-selector';
import HowUsing from './how-using/how-using';
import useFormTarget from '~/components/form-target/form-target';
import {afterFormSubmit} from '~/models/books';
import {useHistory, useLocation} from 'react-router-dom';
import './adoption.scss';

const formDestination = 'https://go.demo.pardot.com/l/308222/2021-09-17/33n';

function useFirstSearchArgument() {
    const {search} = useLocation();

    return decodeURIComponent(search.substr(1).replace(/&.*/, ''));
}

function BookSelectorPage({selectedBooksRef}) {
    const preselectedTitle = useFirstSearchArgument();
    const [selectedBooks, toggleBook] = useSelectedBooks();

    selectedBooksRef.current = selectedBooks;
    return (
        <React.Fragment>
            <BookSelector
                prompt="Which textbook(s) are you currently using?"
                required
                selectedBooks={selectedBooks}
                preselectedTitle={preselectedTitle}
                toggleBook={toggleBook}
            />
            <label>
                <div className="control-group">
                    <HowUsing selectedBooks={selectedBooks} />
                    <input type="checkbox" name="Have_Xanedu__c" />
                    Have Xanedu, the OpenStax print partner, contact me about how to
                    get print copies for my students.
                </div>
            </label>
        </React.Fragment>
    );
}

function useAfterSubmit(selectedBooksRef) {
    const history = useHistory();
    const preselectedTitle = useFirstSearchArgument();

    return React.useCallback(
        () => afterFormSubmit(history, preselectedTitle, selectedBooksRef.current),
        [history, selectedBooksRef, preselectedTitle]
    );
}

function FacultyForm({onPageChange}) {
    const contactValidatorRef = useRef();
    const selectedBooksRef = useRef();
    const afterSubmit = useAfterSubmit(selectedBooksRef);
    const {onSubmit, submitting, FormTarget} = useFormTarget(afterSubmit);

    function validatePage(page) {
        const validateContactInfo = contactValidatorRef.current;

        if (page === 1 && !validateContactInfo()) {
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
                validatePage={validatePage} action={formDestination}
                onPageChange={onPageChange} onSubmit={doSubmit}
                submitting={submitting} target="form-target"
            >
                <ContactInfo validatorRef={contactValidatorRef} />
                <BookSelectorPage selectedBooksRef={selectedBooksRef} />
            </MultiPageForm>
        </React.Fragment>
    );
}

export default function AdoptionForm() {
    const [selectedRole, setSelectedRole] = useState('');
    const [hideRoleSelector, setHideRoleSelector] = useState(false);
    const ref = useRef();

    function onPageChange(page) {
        setHideRoleSelector(page > 1);
        ref.current.scrollIntoView();
    }

    useEffect(() => {
        $.setPageTitleAndDescription('Adoption Form');
    }, []);
    useCanonicalLink();

    return (
        <main className="adoption-form-v2">
            <FormHeader slug="pages/adoption-form" />
            <img className="strips" src="/images/components/strips.svg" height="10" alt="" role="presentation" />
            <div className="text-content" ref={ref}>
                <RoleSelector value={selectedRole} setValue={setSelectedRole} hidden={hideRoleSelector}>
                    <StudentForm />
                    <FacultyForm onPageChange={onPageChange} />
                </RoleSelector>
            </div>
        </main>
    );
}
