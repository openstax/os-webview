import React, {useState, useEffect, useRef} from 'react';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import {useDataFromPromise, useCanonicalLink} from '~/components/jsx-helpers/jsx-helpers.jsx';
import $ from '~/helpers/$';
import FormHeader from '~/components/form-header/form-header';
import RoleSelector from '~/components/role-selector/role-selector';
import StudentForm from '~/components/student-form/student-form';
import MultiPageForm from '~/components/multi-page-form/multi-page-form';
import {HiddenFields, FormSubmitContext} from '~/components/salesforce-form/salesforce-form.jsx';
import ContactInfo from '~/components/contact-info/contact-info';
import BookSelector, {useSelectedBooks} from '~/components/book-selector/book-selector';
import salesforcePromise from '~/models/salesforce';
import HowUsing from './how-using/how-using';
import {afterFormSubmit} from '~/models/books';
import css from './adoption.css';

function ContactInfoPage({selectedRole, validatorRef}) {
    return (
        <React.Fragment>
            <HiddenFields leadSource="Adoption Form" />
            <input type="hidden" name="Role__c" value={selectedRole} />
            <ContactInfo validatorRef={validatorRef} />
        </React.Fragment>
    );
}

function firstSearchArgument() {
    return decodeURIComponent(window.location.search.substr(1))
        .replace(/&.*/, '');
}

function BookSelectorPage({selectedBooksRef}) {
    const preselectedTitle = firstSearchArgument();
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
            <HowUsing selectedBooks={selectedBooks} />
            <label>
                <div className="control-group">
                    <input type="checkbox" name="Have_Xanedu__c" />
                    Have Xanedu, the OpenStax print partner, contact me about how to
                    get print copies for my students.
                </div>
            </label>
        </React.Fragment>
    );
}

function FacultyForm({selectedRole, onPageChange}) {
    const contactValidatorRef = useRef();
    const selectedBooksRef = useRef();
    const [currentBook, setCurrentBook] = useState();
    const formRef = useRef();
    const salesforce = useDataFromPromise(salesforcePromise, {});

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

    useEffect(() => {
        if (currentBook) {
            formRef.current.submit();
        }
    }, [currentBook]);


    function onSubmit(form) {
        const selectedBooks = selectedBooksRef.current;
        const submitQueue = selectedBooks.slice();
        const iframe = document.getElementById(form.target);

        // eslint-disable-next-line no-use-before-define
        const submitAfterDelay = () => setTimeout(submitNextBook, 300);

        function submitNextBook() {
            const preselectedTitle = firstSearchArgument();

            if (submitQueue.length > 0) {
                setCurrentBook(submitQueue.shift());
            } else if (iframe) {
                setCurrentBook(null);
                iframe.removeEventListener('load', submitAfterDelay);
                afterFormSubmit(preselectedTitle, selectedBooks);
            }
        }

        formRef.current = form;
        if (iframe) {
            iframe.addEventListener('load', submitAfterDelay);
        }
        submitNextBook();
    }

    return (
        <FormSubmitContext.Provider value={currentBook}>
            <MultiPageForm
                validatePage={validatePage} action={salesforce.webtoleadUrl}
                onPageChange={onPageChange} onSubmit={onSubmit} debug={salesforce.debug}
                submitting={currentBook}
            >
                <ContactInfoPage selectedRole={selectedRole} validatorRef={contactValidatorRef} />
                <BookSelectorPage selectedBooksRef={selectedBooksRef} />
            </MultiPageForm>
        </FormSubmitContext.Provider>
    );
}

export function AdoptionForm() {
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
        <React.Fragment>
            <FormHeader slug="pages/adoption-form" />
            <img className="strips" src="/images/components/strips.svg" height="10" alt="" role="presentation" />
            <div className="text-content" ref={ref}>
                <RoleSelector value={selectedRole} setValue={setSelectedRole} hidden={hideRoleSelector}>
                    <StudentForm />
                    <FacultyForm selectedRole={selectedRole} onPageChange={onPageChange} />
                </RoleSelector>
            </div>
        </React.Fragment>
    );
}

const view = {
    classes: ['adoption-form-v2'],
    tag: 'main'
};

export default pageWrapper(AdoptionForm, view);
